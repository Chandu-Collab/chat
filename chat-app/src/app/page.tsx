'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { Menu } from 'lucide-react';

export default function Home() {
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleChatSelect = (chatId: string) => {
    setCurrentChatId(chatId);
    // Close mobile sidebar when selecting a chat
    setMobileSidebarOpen(false);
  };

  const handleNewChat = () => {
    setCurrentChatId(undefined);
    setMobileSidebarOpen(false);
  };

  const handleChatCreated = (chatId: string) => {
    setCurrentChatId(chatId);
  };

  const handleSidebarToggle = (collapsed: boolean) => {
    setSidebarCollapsed(collapsed);
  };

  const handleMobileSidebarToggle = () => {
    setMobileSidebarOpen(!mobileSidebarOpen);
  };

  return (
    <div className="h-screen flex bg-white dark:bg-gray-900 overflow-hidden">
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={handleMobileSidebarToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm font-semibold">AI</span>
            </div>
            <h1 className="text-lg font-medium text-gray-900 dark:text-white">
              AI Assistant
            </h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Mobile Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-40 responsive-transition animate-fade-in"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed md:relative z-50 md:z-auto h-full responsive-transition
        ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${sidebarCollapsed ? 'md:w-20' : 'md:w-80'}
      `}>
        <Sidebar 
          currentChatId={currentChatId}
          onChatSelect={handleChatSelect}
          onNewChat={handleNewChat}
          onToggleCollapse={handleSidebarToggle}
          onMobileClose={() => setMobileSidebarOpen(false)}
          isCollapsed={sidebarCollapsed}
          isMobileOpen={mobileSidebarOpen}
        />
      </div>

      {/* Main Content */}
      <div className={`
        flex-1 flex flex-col min-w-0 responsive-transition
        pt-16 md:pt-0
        ${sidebarCollapsed ? 'md:ml-0' : 'md:ml-0'}
      `}>
        <ChatInterface 
          chatId={currentChatId}
          onChatCreated={handleChatCreated}
        />
      </div>
    </div>
  );
}