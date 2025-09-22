'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';

export default function Home() {
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleNewChat = () => {
    setCurrentChatId(undefined);
  };

  const handleChatCreated = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900">
      <Sidebar 
        currentChatId={currentChatId}
        onChatSelect={handleChatSelect}
        onNewChat={handleNewChat}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <ChatInterface 
          chatId={currentChatId}
          onChatCreated={handleChatCreated}
        />
      </div>
    </div>
  );
}