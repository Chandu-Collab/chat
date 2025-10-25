'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { ChatInterface } from '@/components/chat-interface';
import { ModelSelector } from '@/components/model-selector';
import { ThemeToggle } from '@/components/theme-toggle';
import { useTheme } from '@/hooks/use-theme';
import { Avatar } from '@/components/ui/icon';
import { Typography } from '@/components/ui/typography';
import { MessageSquare } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [currentChatId, setCurrentChatId] = useState<string | undefined>(undefined);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [selectedModel, setSelectedModel] = useState('gemini-2.0-flash-lite-001');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { theme, actualTheme } = useTheme();

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      
      if (token && userId) {
        setIsAuthenticated(true);
      } else {
        // Redirect to auth page if not authenticated
        router.push('/auth');
        return;
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

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

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('userId');
    router.push('/auth');
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin mb-4 mx-auto"></div>
          <span className="text-gray-500 dark:text-gray-400">Loading...</span>
        </div>
      </div>
    );
  }

  // Don't render the main app if not authenticated (should redirect)
  if (!isAuthenticated) {
    return null;
  }

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
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Logout
          </button>
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