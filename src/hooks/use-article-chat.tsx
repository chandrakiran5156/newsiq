
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
  const [retryCount, setRetryCount] = useState<number>(0);
  
  // Track processed message IDs to prevent duplicate rendering
  const [processedMessageIds, setProcessedMessageIds] = useState<Set<string>>(new Set());

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
        
        // Track processed message IDs
        const messageIds = new Set(existingMessages.map(msg => msg.id));
        setProcessedMessageIds(messageIds);
        
        setMessages(existingMessages);
      } catch (err: any) {
        console.error('Failed to initialize chat:', err);
        setError(err.message || 'Failed to initialize chat');
        toast({
          title: "Error",
          description: "Failed to load chat history",
          variant: "destructive"
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
        const exists = processedMessageIds.has(newMessage.id);
        if (exists) return prev;
        
        // Add message ID to processed set
        setProcessedMessageIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.add(newMessage.id);
          return newIds;
        });
        
        return [...prev, newMessage];
      });
    });
    
    return unsubscribe;
  }, [session?.id, processedMessageIds]);

  // Handle message sending with retry logic
  const handleSendMessage = useCallback(async (message: string) => {
    if (!user?.id || !session?.id || !message.trim()) return;
    
    setIsSending(true);
    setError(null);
    
    try {
      // Send message to API without adding optimistic messages
      // The real messages will come through the subscription
      await sendMessage(
        message,
        articleId,
        user.id,
        session.id
      );
      
      // Reset retry count on success
      setRetryCount(0);
    } catch (err: any) {
      console.error('Failed to send message:', err);
      
      // Set error state
      const errorMessage = err.message || 'Failed to send message';
      setError(errorMessage);
      
      // Add error message to chat if retried multiple times
      if (retryCount >= 2) {
        const errorMsg: ChatMessage = {
          id: `error-${Date.now()}`,
          sessionId: session.id,
          message: "Sorry, I'm having trouble connecting right now. Please try again later.",
          role: 'assistant',
          createdAt: new Date().toISOString(),
        };
        
        setMessages(prev => [...prev, errorMsg]);
        setRetryCount(0); // Reset after showing error to user
      } else {
        // Increment retry count
        setRetryCount(prev => prev + 1);
      }
      
      // Show toast notification
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSending(false);
    }
  }, [user?.id, session?.id, articleId, toast, retryCount]);

  // Reset chat state
  const resetChat = useCallback(async () => {
    if (!user?.id || !articleId) return;
    
    setIsLoading(true);
    setMessages([]);
    setError(null);
    setRetryCount(0);
    setProcessedMessageIds(new Set());
    
    try {
      const chatSession = await getOrCreateChatSession(
        user.id, 
        articleId, 
        articleTitle
      );
      setSession(chatSession);
    } catch (err: any) {
      console.error('Failed to reset chat:', err);
      setError(err.message || 'Failed to reset chat');
      toast({
        title: "Error",
        description: "Failed to reset chat",
        variant: "destructive"
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
