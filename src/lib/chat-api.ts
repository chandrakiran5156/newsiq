
import { supabase } from '@/integrations/supabase/client';
import { ChatSession, ChatMessage, ChatResponse } from '@/types';

// Mapper functions
function mapDbSessionToSession(session: any): ChatSession {
  return {
    id: session.id,
    userId: session.user_id,
    articleId: session.article_id,
    title: session.title,
    createdAt: session.created_at,
    updatedAt: session.updated_at,
  };
}

function mapDbMessageToMessage(message: any): ChatMessage {
  return {
    id: message.id,
    sessionId: message.session_id,
    message: message.message,
    role: message.role,
    createdAt: message.created_at,
  };
}

// Get or create a chat session for an article and user
export async function getOrCreateChatSession(userId: string, articleId: string, articleTitle: string) {
  try {
    // First, check if session exists
    const { data: existingSession, error: fetchError } = await supabase
      .from('chat_sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('article_id', articleId)
      .maybeSingle();
    
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking for existing chat session:', fetchError);
      throw new Error(fetchError.message);
    }
    
    if (existingSession) {
      console.log('Found existing chat session:', existingSession.id);
      return mapDbSessionToSession(existingSession);
    }
    
    // Create a new session
    const title = `Chat about: ${articleTitle}`;
    const { data: newSession, error: createError } = await supabase
      .from('chat_sessions')
      .insert({
        user_id: userId,
        article_id: articleId,
        title
      })
      .select('*')
      .single();
    
    if (createError) {
      console.error('Error creating chat session:', createError);
      throw new Error(createError.message);
    }
    
    console.log('Created new chat session:', newSession.id);
    return mapDbSessionToSession(newSession);
  } catch (error) {
    console.error('Error in getOrCreateChatSession:', error);
    throw error;
  }
}

// Get messages for a session
export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  try {
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching chat messages:', error);
      throw new Error(error.message);
    }
    
    return data.map(mapDbMessageToMessage);
  } catch (error) {
    console.error('Error in getChatMessages:', error);
    throw error;
  }
}

// Send a message to the article AI chat
export async function sendMessage(
  userMessage: string,
  articleId: string, 
  userId: string, 
  sessionId: string
): Promise<ChatResponse> {
  try {
    // Add more detailed logging for debugging
    console.log('Sending message to edge function:', {
      userMessage: userMessage.substring(0, 50) + (userMessage.length > 50 ? '...' : ''),
      articleId,
      userId,
      sessionId
    });
    
    const response = await supabase.functions.invoke('article-chat', {
      body: { 
        userMessage, 
        articleId, 
        userId, 
        sessionId 
      },
    });
    
    if (response.error) {
      console.error('Edge function error:', response.error);
      throw new Error(response.error.message || 'Error communicating with AI chat');
    }
    
    // Add logging about the response
    console.log('Received response from edge function:', {
      status: 'success',
      n8nStatus: response.data?.n8nStatus,
      messageLength: response.data?.message?.length || 0
    });
    
    return response.data as ChatResponse;
  } catch (error) {
    console.error('Error in sendMessage:', error);
    throw error;
  }
}

// Subscribe to new messages in a chat session
export function subscribeToMessages(sessionId: string, callback: (message: ChatMessage) => void) {
  const channel = supabase
    .channel('chat-messages')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'chat_messages',
        filter: `session_id=eq.${sessionId}`
      },
      (payload) => {
        if (payload.new) {
          callback(mapDbMessageToMessage(payload.new));
        }
      }
    )
    .subscribe();
    
  return () => {
    supabase.removeChannel(channel);
  };
}
