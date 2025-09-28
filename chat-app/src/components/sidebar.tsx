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
import { Icon, Avatar, IconButton } from './ui/icon';
import { Typography, Heading, Label, Caption } from './ui/typography';
import { designTokens } from '@/lib/design-system';

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
      // Get userId from localStorage/sessionStorage (set after login/signup)
      const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
      if (!userId) {
        alert('You must be logged in to start a chat.');
        return;
      }
      const response = await fetch('/api/chat/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
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
    <div className="flex flex-col h-full bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="flex items-center justify-between p-6">
        {!isCollapsed && (
          <div className="flex items-center gap-3">
            <Avatar icon={MessageSquare} size="sm" gradient />
            <Heading level={3} className="tracking-tight">
              Chats
            </Heading>
          </div>
        )}
        <div className="flex items-center gap-2">
          <IconButton
            icon={isCollapsed ? ChevronRight : ChevronLeft}
            size="md"
            color="muted"
            onClick={() => {
              const newCollapsed = !isCollapsed;
              onToggleCollapse?.(newCollapsed);
            }}
            className="hidden md:flex"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          />
        </div>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <button
          onClick={handleNewChat}
          className={cn(
            "w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105",
            designTokens.typography.weight.medium,
            isCollapsed && "justify-center"
          )}
        >
          <Icon icon={Plus} size="md" color="white" />
          {!isCollapsed && (
            <Typography size="sm" weight="medium" color="primary" className="text-white">
              New Chat
            </Typography>
          )}
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
          <div className="text-center py-12">
            {!isCollapsed && (
              <div className="animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                  <Icon icon={MessageSquare} size="xl" color="disabled" className="opacity-40" />
                </div>
                <Typography weight="medium" color="muted" className="mb-1">
                  No conversations yet
                </Typography>
                <Caption>Start a new chat to get going</Caption>
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
                <Avatar 
                  icon={MessageSquare} 
                  size="sm" 
                  gradient={chat.id === currentChatId}
                  className={cn(
                    chat.id !== currentChatId && "bg-gray-100 dark:bg-gray-700"
                  )}
                />
                
                {!isCollapsed && (
                  <>
                    <div className="flex-1 min-w-0">
                      <Typography 
                        size="sm" 
                        weight="medium" 
                        color="primary"
                        className="truncate mb-1"
                      >
                        {chat.title || 'New Chat'}
                      </Typography>
                      <Caption className="font-normal">
                        {formatDate(chat.updated_at)}
                      </Caption>
                    </div>
                    <button
                      onClick={(e) => handleDeleteChat(chat.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 dark:hover:text-red-400 rounded-xl transition-all duration-200 transform hover:scale-110"
                      title="Delete chat"
                    >
                      <Icon icon={Trash2} size="sm" color="error" />
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

      {/* Footer with settings */}
      <div className="p-4">
        {!isCollapsed && (
          <div className="flex items-center gap-2">
            <Icon icon={Settings} size="sm" color="muted" />
            <Label>Settings</Label>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={cn(
      "h-full responsive-transition",
      isCollapsed ? "w-16" : "w-44"
    )}>
      {sidebarContent}
    </div>
  );
}