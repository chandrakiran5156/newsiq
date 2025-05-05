
import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useArticleChat } from '@/hooks/use-article-chat';
import { MessageCircle, Send, Bot, RefreshCw } from 'lucide-react';
import { Article } from '@/types';
import { useAuth } from '@/lib/supabase-auth';
import { useToast } from '@/hooks/use-toast';
import ChatMessage from './ChatMessage';

interface ArticleChatPanelProps {
  article: Article;
}

export default function ArticleChatPanel({ article }: ArticleChatPanelProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const messageContainerRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    isSending,
    sendMessage,
    resetChat
  } = useArticleChat(article.id, article.title);
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messageContainerRef.current && isOpen) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);
  
  // Handle message sending
  const handleSendMessage = () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication required",
        description: "Please sign in to use the chat feature",
        variant: "destructive"
      });
      return;
    }
    
    if (inputMessage.trim() === '') return;
    
    sendMessage(inputMessage);
    setInputMessage('');
  };
  
  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
  };
  
  // Initial welcome message when no messages exist
  const welcomeMessage = {
    id: 'welcome',
    message: `Hi there! I'm your article assistant for "${article.title}". Ask me any questions about this article or related topics!`,
    role: 'assistant' as const,
    sessionId: '',
    createdAt: new Date().toISOString()
  };
  
  // Display welcome message if no other messages exist
  const displayMessages = messages.length > 0 ? messages : [welcomeMessage];
  
  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className="fixed bottom-24 right-8 z-50 flex items-center gap-2 shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-4 h-auto"
        >
          <MessageCircle size={20} />
          <span className="sr-only md:not-sr-only">Chat about article</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col h-full p-0">
        <SheetHeader className="p-4 border-b">
          <SheetTitle className="flex items-center gap-2">
            <Bot size={20} />
            <span>Article Assistant</span>
          </SheetTitle>
        </SheetHeader>
        
        {!isAuthenticated ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <p className="mb-4">Please sign in to use the chat feature</p>
              <Button onClick={() => window.location.href = '/auth'}>
                Sign In
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Messages container */}
            <div 
              ref={messageContainerRef}
              className="flex-1 overflow-y-auto p-4 space-y-4"
            >
              {isLoading ? (
                <div className="flex justify-center p-4">
                  <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
                </div>
              ) : (
                displayMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    user={user}
                  />
                ))
              )}
              {isSending && (
                <div className="flex space-x-2 items-center text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              )}
            </div>

            {/* Input area */}
            <div className="p-4 border-t">
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={resetChat}
                  title="Reset conversation"
                >
                  <RefreshCw size={18} />
                </Button>
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask a question about this article..."
                  className="min-h-10 flex-1 resize-none"
                  rows={1}
                  disabled={isSending}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={isSending || inputMessage.trim() === ''}
                  size="icon"
                >
                  <Send size={18} />
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
