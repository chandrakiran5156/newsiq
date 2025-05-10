
import { useState } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MessageSquareText } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { useArticleChat } from '@/hooks/use-article-chat';
import { useAuth } from '@/lib/supabase-auth';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';

interface ArticleChatPanelProps {
  article: Article;
}

export default function ArticleChatPanel({ article }: ArticleChatPanelProps) {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { messages, sendMessage, isLoading } = useArticleChat(article.id, article.title || '');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button 
            className="rounded-full h-14 w-14 shadow-lg flex items-center justify-center"
            size="icon"
          >
            <MessageSquareText className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent className="w-[90%] sm:w-[450px] md:w-[500px]" side="right">
          <SheetHeader>
            <SheetTitle>Chat about this article</SheetTitle>
          </SheetHeader>
          
          <div className="mt-4 flex flex-col h-[calc(100%-150px)]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4">
              {messages.map((msg, index) => (
                <ChatMessage key={index} message={msg} user={user} />
              ))}
            </div>
            
            <div className="mt-auto pt-4 border-t flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send'}
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
