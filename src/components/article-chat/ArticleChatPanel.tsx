
import { useState } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './ChatMessage';
import { useArticleChat } from '@/hooks/use-article-chat';
import { useAuth } from '@/lib/supabase-auth';

interface ArticleChatPanelProps {
  article: Article;
}

export default function ArticleChatPanel({ article }: ArticleChatPanelProps) {
  const [message, setMessage] = useState('');
  const { user } = useAuth();
  const { messages, sendMessage, isLoading } = useArticleChat(article.id, article.title || '');

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="w-full">
      <div className="space-y-4 max-h-[300px] overflow-y-auto mb-4 p-2">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} user={user} />
        ))}
      </div>
      <div className="mt-4 flex items-center space-x-2">
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
  );
}
