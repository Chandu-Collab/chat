'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { ModelSelector } from '@/components/model-selector';

export default function Home() {
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleNewChat = () => {
    setCurrentChatId(undefined);
  };

  const handleChatCreated = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-900 overflow-hidden">
      {/* Fixed App Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-900">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-semibold">AI</span>
          </div>
          <h1 className="text-lg font-medium text-gray-900 dark:text-white">
            AI Assistant
          </h1>
        </div>
        
        {/* Model Selector */}
        <ModelSelector 
          selectedModel={selectedModel}
          onModelChange={setSelectedModel}
        />
      </div>

      {/* Main Layout Container */}
      <div className="flex flex-1">
        {/* Sidebar - Full Height */}
        <div className={`
          ${sidebarCollapsed ? 'w-16' : 'w-44'} 
          flex-shrink-0 responsive-transition
        `}>
          <Sidebar 
            currentChatId={currentChatId}
            onChatSelect={handleChatSelect}
            onNewChat={handleNewChat}
            onToggleCollapse={handleSidebarToggle}
            onMobileClose={() => {}}
            isCollapsed={sidebarCollapsed}
            isMobileOpen={false}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <ChatInterface 
            chatId={currentChatId}
            onChatCreated={handleChatCreated}
            selectedModel={selectedModel}
          />
        </div>
      </div>
    </div>
  );
}