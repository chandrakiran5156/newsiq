
import { useState, useRef, useEffect } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useArticleChat } from '@/hooks/use-article-chat';
import { MessageCircle, Send, Bot, RefreshCw, Mic, MicOff, Volume, VolumeX } from 'lucide-react';
import { Article } from '@/types';
import { useAuth } from '@/lib/supabase-auth';
import { useToast } from '@/hooks/use-toast';
import { useVoiceRecorder } from '@/hooks/use-voice-recorder';
import { useVoicePlayback } from '@/hooks/use-voice-playback';
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
    error,
    sendMessage,
    resetChat
  } = useArticleChat(article.id, article.title);
  
  const {
    isRecording,
    isProcessing,
    transcribedText,
    startRecording,
    stopRecording,
    cancelRecording,
    setTranscribedText
  } = useVoiceRecorder();

  const {
    isEnabled: isVoiceEnabled,
    isPlaying,
    isLoading: isAudioLoading,
    toggleEnabled: toggleVoice,
    playText
  } = useVoicePlayback();
  
  // Scroll to bottom on new messages
  useEffect(() => {
    if (messageContainerRef.current && isOpen) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages, isOpen]);
  
  // Show toast for errors
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);
  
  // Update input with transcribed text
  useEffect(() => {
    if (transcribedText) {
      setInputMessage(transcribedText);
    }
  }, [transcribedText]);

  // Play assistant messages with text-to-speech
  useEffect(() => {
    if (isVoiceEnabled && messages.length > 0) {
      const lastMessage = messages[messages.length - 1];
      if (lastMessage.role === 'assistant') {
        playText(lastMessage.message);
      }
    }
  }, [isVoiceEnabled, messages, playText]);
  
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
    setTranscribedText('');
  };
  
  // Handle enter key press
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle voice recording
  const handleVoiceRecord = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        setInputMessage(text);
      }
    } else {
      await startRecording();
    }
  };
  
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    
    // Cancel any ongoing recording when closing the panel
    if (!open && isRecording) {
      cancelRecording();
    }
  };
  
  // Initial welcome message when no messages exist
  const welcomeMessage = {
    id: 'welcome',
    message: `Hi there! I'm your article assistant for "${article.title}". Ask me any questions about this article or related topics!`,
    role: 'assistant' as const,
    sessionId: '',
    createdAt: new Date().toISOString()
  };
  
  // Filter out duplicate messages by checking consecutive messages with the same role and content
  const filteredMessages = messages.length > 0 ? 
    messages.filter((message, index, array) => {
      if (index === 0) return true;
      const prevMessage = array[index - 1];
      return !(message.role === prevMessage.role && message.message === prevMessage.message);
    }) : 
    [welcomeMessage];
  
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
          <div className="flex justify-between items-center">
            <SheetTitle className="flex items-center gap-2">
              <Bot size={20} />
              <span>Article Assistant</span>
            </SheetTitle>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleVoice} 
              className="text-muted-foreground hover:text-foreground" 
              title={isVoiceEnabled ? "Disable voice responses" : "Enable voice responses"}
            >
              {isVoiceEnabled ? <Volume size={18} /> : <VolumeX size={18} />}
            </Button>
          </div>
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
                filteredMessages.map((message) => (
                  <ChatMessage
                    key={message.id}
                    message={message}
                    user={user}
                  />
                ))
              )}
              {(isSending || isAudioLoading) && (
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
                  disabled={isSending || isRecording || isProcessing}
                />
                <Button
                  variant={isRecording ? "destructive" : "outline"}
                  size="icon"
                  onClick={handleVoiceRecord}
                  disabled={isSending || isProcessing}
                  className="relative"
                  title={isRecording ? "Stop recording" : "Start voice recording"}
                >
                  {isRecording ? <MicOff size={18} /> : <Mic size={18} />}
                  {isRecording && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  )}
                </Button>
                <Button 
                  onClick={handleSendMessage}
                  disabled={isSending || isProcessing || inputMessage.trim() === ''}
                  size="icon"
                >
                  <Send size={18} />
                </Button>
              </div>
              
              {isProcessing && (
                <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center">
                  <span className="mr-2">Processing speech</span>
                  <div className="animate-spin h-3 w-3 border border-current border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
