'use client';

import { useState, useEffect } from 'react';
import { Bot } from 'lucide-react';
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
    <div className="flex gap-4 group justify-start">
      <div className="flex-shrink-0">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
          <Bot className="h-4 w-4 text-white" />
        </div>
      </div>
      
      <div className="flex-1 max-w-3xl">
        <div className="relative px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white mr-auto">
          {/* Message content */}
          <div className="whitespace-pre-wrap break-words">
            {displayContent}
            {/* Typing cursor */}
            {!isComplete && (
              <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse" />
            )}
          </div>
          
          {/* Timestamp - only show when complete */}
          {isComplete && (
            <div className="text-xs mt-2 opacity-70 text-gray-500 dark:text-gray-400">
              Just now
            </div>
          )}
        </div>
      </div>
    </div>
  );
}