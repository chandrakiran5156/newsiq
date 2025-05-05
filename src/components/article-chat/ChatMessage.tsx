
import { User } from '@supabase/supabase-js';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ChatMessage as ChatMessageType } from '@/types';
import { Bot } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  user: User | null;
}

export default function ChatMessage({ message, user }: ChatMessageProps) {
  const isUser = message.role === 'user';
  const initials = user?.email ? user.email.substring(0, 2).toUpperCase() : 'U';
  
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <Avatar className="h-8 w-8">
        {isUser ? (
          <>
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{initials}</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot size={16} />
            </AvatarFallback>
          </>
        )}
      </Avatar>
      
      <div className={`rounded-lg px-3 py-2 max-w-[80%] ${
        isUser 
          ? 'bg-primary text-primary-foreground' 
          : 'bg-muted'
      }`}>
        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
      </div>
    </div>
  );
}
