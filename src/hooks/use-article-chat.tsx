
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '@/lib/supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { 
  getOrCreateChatSession, 
  getChatMessages, 
  sendMessage, 
  subscribeToMessages 
} from '@/lib/chat-api';
import { ChatMessage, ChatSession } from '@/types';

export function useArticleChat(articleId: string, articleTitle: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [session, setSession] = useState<ChatSession | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Initialize the chat session
  useEffect(() => {
    if (!user?.id || !articleId) return;

    const initializeChat = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Get or create chat session
        const chatSession = await getOrCreateChatSession(
          user.id, 
          articleId, 
          articleTitle
        );
        setSession(chatSession);
        
        // Get existing messages
        const existingMessages = await getChatMessages(chatSession.id);
        setMessages(existingMessages);
      } catch (err: any) {
        setError(err.message || 'Failed to initialize chat');
        toast({
          title: 'Error',
          description: 'Failed to load chat history',
          variant: 'destructive'
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    initializeChat();
  }, [user?.id, articleId, articleTitle, toast]);

  // Subscribe to new messages
  useEffect(() => {
    if (!session?.id) return;
    
    // Set up subscription
    const unsubscribe = subscribeToMessages(session.id, (newMessage) => {
      setMessages(prev => {
        // Check if message already exists to avoid duplicates
        const exists = prev.some(msg => msg.id === newMessage.id);
        if (exists) return prev;
        return [...prev, newMessage];
      });
    });
    
    return unsubscribe;
  }, [session?.id]);

  // Handle message sending
  const handleSendMessage = useCallback(async (message: string) => {
    if (!user?.id || !session?.id || !message.trim()) return;
    
    setIsSending(true);
    setError(null);
    
    try {
      await sendMessage(
        message,
        articleId,
        user.id,
        session.id
      );
    } catch (err: any) {
      setError(err.message || 'Failed to send message');
      toast({
        title: 'Error',
        description: 'Failed to send message. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setIsSending(false);
    }
  }, [user?.id, session?.id, articleId, toast]);

  // Reset chat state
  const resetChat = useCallback(async () => {
    if (!user?.id || !articleId) return;
    
    setIsLoading(true);
    setMessages([]);
    
    try {
      const chatSession = await getOrCreateChatSession(
        user.id, 
        articleId, 
        articleTitle
      );
      setSession(chatSession);
    } catch (err: any) {
      setError(err.message || 'Failed to reset chat');
      toast({
        title: 'Error',
        description: 'Failed to reset chat',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  }, [user?.id, articleId, articleTitle, toast]);

  return useMemo(() => ({
    messages,
    isLoading,
    isSending,
    error,
    sendMessage: handleSendMessage,
    resetChat
  }), [
    messages,
    isLoading,
    isSending,
    error,
    handleSendMessage,
    resetChat
  ]);
}
