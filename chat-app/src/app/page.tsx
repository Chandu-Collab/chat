'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { ModelSelector } from '@/components/model-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/hooks/use-theme';
import { Avatar } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { MessageSquare } from 'lucide-react';

export default function Home() {
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-1.5-flash');
  const { theme, actualTheme } = useTheme();

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
        <div className="flex items-center gap-3">
          <Avatar icon={MessageSquare} size="sm" gradient />
          <Typography size="lg" weight="medium" color="primary">
            AI Assistant
          </Typography>
        </div>
        
        {/* Model Selector and Theme Controls */}
        <div className="flex items-center gap-3">
          <ThemeToggle variant="default" showLabel={false} />
          <ModelSelector 
            selectedModel={selectedModel}
            onModelChange={setSelectedModel}
          />
        </div>
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