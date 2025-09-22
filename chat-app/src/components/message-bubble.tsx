'use client';

import { Message } from '@/lib/types';
import { formatDate, cn } from '@/lib/utils';
import { User, Bot, Copy, Check, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Icon, Avatar, IconButton } from './ui/icon';
import { Typography, Caption } from './ui/typography';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy message:', error);
    }
  };

  return (
    <div className={cn("flex gap-4 group animate-fade-in", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <div className="flex-shrink-0 relative">
          <Avatar icon={Bot} size="sm" gradient />
          <div className="absolute inset-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 animate-pulse"></div>
        </div>
      )}
      
      <div className={cn("flex-1 max-w-3xl", isUser && "flex justify-end")}>
        <div
          className={cn(
            "relative px-6 py-4 shadow-sm",
            isUser
              ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-3xl rounded-br-lg ml-auto shadow-blue-200 dark:shadow-blue-900/30"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-3xl rounded-bl-lg mr-auto border border-gray-200 dark:border-gray-700 shadow-gray-200 dark:shadow-gray-900/30"
          )}
        >
          {/* AI indicator for assistant messages */}
          {!isUser && (
            <div className="flex items-center gap-2 mb-2">
              <Icon icon={Sparkles} size="xs" color="accent" />
              <Typography size="xs" weight="medium" color="accent">
                AI Assistant
              </Typography>
            </div>
          )}

          {/* Message content */}
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </div>
          
          {/* Timestamp and actions */}
          <div className="flex items-center justify-between mt-3">
            <Caption className={cn("opacity-70", isUser && "text-blue-100")}>
              {formatDate(message.created_at)}
            </Caption>

            {/* Copy button - only show for AI messages */}
            {!isUser && (
              <button
                onClick={handleCopy}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 transform hover:scale-110"
                title="Copy message"
              >
                {copied ? (
                  <Icon icon={Check} size="sm" color="success" />
                ) : (
                  <Icon icon={Copy} size="sm" color="muted" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {isUser && (
        <div className="flex-shrink-0 relative">
          <Avatar icon={User} size="sm" className="bg-gradient-to-br from-gray-400 to-gray-600 dark:from-gray-600 dark:to-gray-700" />
        </div>
      )}
    </div>
  );
}