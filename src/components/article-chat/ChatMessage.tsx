
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from '@supabase/supabase-js';
import { ChatMessage as ChatMessageType } from '@/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Mic } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  user: User | null;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, user }) => {
  const isUser = message.role === 'user';
  
  // Format the timestamp for display
  const formattedTime = message.createdAt ? 
    format(new Date(message.createdAt), 'h:mm a') : '';
  
  // Get user's initials for avatar fallback
  const getInitials = () => {
    if (!user?.email) return '?';
    const email = user.email;
    return email.substring(0, 2).toUpperCase();
  };

  return (
    <div className={cn("flex gap-3 max-w-[90%]", 
      isUser ? "ml-auto flex-row-reverse" : ""
    )}>
      {/* Avatar */}
      <Avatar className="h-8 w-8">
        {isUser ? (
          <>
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </>
        ) : (
          <>
            <AvatarImage src="/assets/bot-avatar.png" />
            <AvatarFallback>AI</AvatarFallback>
          </>
        )}
      </Avatar>

      {/* Message bubble */}
      <div className={cn(
        "rounded-lg px-4 py-2 space-y-1 max-w-full break-words",
        isUser 
          ? "bg-primary text-primary-foreground" 
          : "bg-muted"
      )}>
        {/* Message content */}
        <div className="whitespace-pre-wrap">
          {message.message}
          {message.isVoice && (
            <span className="inline-flex items-center ml-2 text-xs opacity-70">
              <Mic size={12} className="mr-1" />
              voice
            </span>
          )}
        </div>
        
        {/* Timestamp */}
        <div className={cn(
          "text-xs opacity-70 text-right",
          isUser ? "text-primary-foreground/70" : "text-muted-foreground"
        )}>
          {formattedTime}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
