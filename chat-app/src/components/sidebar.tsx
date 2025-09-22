'use client';

import { useState, useEffect } from 'react';
import { Chat } from '@/lib/types';
import { formatDate, cn } from '@/lib/utils';
import { 
  Plus, 
  MessageSquare, 
  Menu, 
  X, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

interface SidebarProps {
  currentChatId?: string;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  onToggleCollapse?: (collapsed: boolean) => void;
  onMobileClose?: () => void;
  isCollapsed?: boolean;
  isMobileOpen?: boolean;
}

export function Sidebar({ 
  currentChatId, 
  onChatSelect, 
  onNewChat,
  onToggleCollapse,
  onMobileClose,
  isCollapsed = false,
  isMobileOpen = false
}: SidebarProps) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch chats
  const fetchChats = async () => {
    try {
      const response = await fetch('/api/chats');
      if (response.ok) {
        const data = await response.json();
        setChats(data);
      }
    } catch (error) {
      console.error('Failed to fetch chats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [currentChatId]); // Refresh when current chat changes

  const handleNewChat = async () => {
    try {
      const response = await fetch('/api/chat/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const newChat = await response.json();
        onNewChat();
        onChatSelect(newChat.id);
        fetchChats(); // Refresh the chat list
        onMobileClose?.(); // Close mobile sidebar
      }
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  };

  const handleDeleteChat = async (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!confirm('Are you sure you want to delete this chat?')) return;

    try {
      const response = await fetch(`/api/chats/${chatId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setChats(chats.filter(chat => chat.id !== chatId));
        
        // If we're deleting the current chat, create a new one
        if (chatId === currentChatId) {
          handleNewChat();
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageSquare className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-light text-gray-900 dark:text-white tracking-tight">
              Chats
            </h1>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newCollapsed = !isCollapsed;
              onToggleCollapse?.(newCollapsed);
            }}
            className="hidden md:flex p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            )}
          </button>
          <button
            onClick={onMobileClose}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 font-medium",
            isCollapsed && "justify-center"
          )}
        >
          <Plus className="h-5 w-5 flex-shrink-0" />
          {!isCollapsed && <span>New Chat</span>}
        </button>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-14 bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-2xl animate-pulse"
              />
            ))}
          </div>
        ) : chats.length === 0 ? (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            {!isCollapsed && (
              <div className="animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="h-8 w-8 opacity-40" />
                </div>
                <p className="font-medium mb-1">No conversations yet</p>
                <p className="text-sm opacity-70">Start a new chat to get going</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-2 animate-fade-in">
            {chats.map((chat, index) => (
              <div
                key={chat.id}
                className={cn(
                  "group flex items-center gap-3 p-4 rounded-2xl cursor-pointer transition-all duration-200 relative overflow-hidden",
                  "hover:shadow-md hover:scale-[1.02]",
                  chat.id === currentChatId
                    ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-700 dark:text-blue-300 shadow-md border border-blue-200 dark:border-blue-800"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 border border-transparent"
                )}
                onClick={() => {
                  onChatSelect(chat.id);
                  onMobileClose?.();
                }}
                style={{animationDelay: `${index * 0.05}s`}}
              >
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  chat.id === currentChatId
                    ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                )}>
                  <MessageSquare className="h-4 w-4" />
                </div>
                
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <div className="truncate font-medium text-sm mb-1">
                        {chat.title || 'New Chat'}
                      </div>
                      <div className="text-xs opacity-60 font-normal">
                        {formatDate(chat.updated_at)}
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-all duration-200 transform hover:scale-110"
                      title="Delete chat"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </>
                )}
                
                {/* Active indicator */}
                {chat.id === currentChatId && (
                  <div className="absolute inset-0 border-2 border-blue-300 dark:border-blue-600 rounded-2xl opacity-50 animate-pulse" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer with theme toggle */}
      <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/50">
        {!isCollapsed ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">Settings</span>
            </div>
            <ThemeToggle />
          </div>
        ) : (
          <div className="flex justify-center">
            <ThemeToggle />
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn(
      "h-full responsive-transition",
      isCollapsed ? "w-20" : "w-80"
    )}>
      {sidebarContent}
    </div>
  );
}