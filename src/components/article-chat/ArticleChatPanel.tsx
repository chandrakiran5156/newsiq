import { useState } from 'react';
import { Article } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ChatMessage from './ChatMessage';
import useArticleChat from '@/hooks/use-article-chat';

interface ArticleChatPanelProps {
  article: Article;
}

export default function ArticleChatPanel({ article }: ArticleChatPanelProps) {
  const [message, setMessage] = useState('');
  const { messages, sendMessage, isLoading } = useArticleChat(article.id);

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      sendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="border rounded-md p-4">
      <h3 className="text-lg font-semibold mb-4">Chat about this article</h3>
      <div className="space-y-2">
        {messages.map((msg, index) => (
          <ChatMessage key={index} message={msg} />
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
