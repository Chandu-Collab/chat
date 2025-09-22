'use client';

import { useState, useEffect } from 'react';
import { Bot, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StreamingMessageProps {
  content: string;
  isComplete: boolean;
}

export function StreamingMessage({ content, isComplete }: StreamingMessageProps) {
  const [displayContent, setDisplayContent] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayContent(content.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20); // Adjust speed as needed

      return () => clearTimeout(timer);
    }
  }, [content, currentIndex]);

  // Update display content when new content arrives
  useEffect(() => {
    if (content.length > displayContent.length) {
      setDisplayContent(content);
      setCurrentIndex(content.length);
    }
  }, [content, displayContent.length]);

  return (
    <div className="flex gap-4 group justify-start animate-fade-in">
      <div className="flex-shrink-0 relative">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
          <Bot className="h-5 w-5 text-white" />
        </div>
        <div className="absolute inset-0 w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 opacity-20 animate-pulse"></div>
      </div>
      
      <div className="flex-1 max-w-3xl">
        <div className="relative px-6 py-4 rounded-3xl rounded-bl-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white mr-auto border border-gray-200 dark:border-gray-700 shadow-sm shadow-gray-200 dark:shadow-gray-900/30">
          {/* AI indicator */}
          <div className="flex items-center gap-2 mb-2 text-xs font-medium text-blue-600 dark:text-blue-400">
            <Sparkles className="h-3 w-3 animate-pulse" />
            <span>AI Assistant is typing...</span>
          </div>

          {/* Message content */}
          <div className="whitespace-pre-wrap break-words leading-relaxed">
            {displayContent}
            {/* Typing cursor */}
            {!isComplete && (
              <span className="inline-block w-0.5 h-5 bg-blue-500 ml-1 animate-pulse rounded-full" />
            )}
          </div>
          
          {/* Timestamp - only show when complete */}
          {isComplete && (
            <div className="text-xs mt-3 opacity-70 text-gray-500 dark:text-gray-400">
              Just now
            </div>
          )}
        </div>
      </div>
    </div>
  );
}