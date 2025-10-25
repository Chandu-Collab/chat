'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, ChatWithMessages } from '@/lib/types';
import { MessageBubble } from './message-bubble';
import { StreamingMessage } from './streaming-message';
import { MessageInput } from './message-input';
import { Loader2, MessageSquare, Settings, ChevronUp, ChevronDown } from 'lucide-react';
import { Icon, Avatar } from './ui/icon';
import { Typography, Heading, Caption } from './ui/typography';
import { designTokens } from '@/lib/design-system';

interface ChatInterfaceProps {
  chatId?: string;
  onChatCreated?: (chatId: string) => void;
  selectedModel?: string;
}

export function ChatInterface({ chatId, onChatCreated, selectedModel = 'gemini-2.0-flash-lite-001' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showStreamingMessage, setShowStreamingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingHideStreaming, setPendingHideStreaming] = useState(false);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Simple scroll to bottom function (only when explicitly called)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Detect if user is manually scrolling to show/hide scroll-to-bottom button
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (container) {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setIsUserScrolling(!isNearBottom);
    }
  };

  // NO AUTO-SCROLL - Let user control scrolling completely

  // Load chat messages when chatId changes
  useEffect(() => {
    if (chatId) {
      loadChatMessages();
    } else {
      setMessages([]);
      setError(null);
    }
  }, [chatId]);

  const loadChatMessages = async () => {
    if (!chatId) return;

    setIsLoadingMessages(true);
    setError(null);

    try {
      console.log('Loading messages for chat:', chatId);
      const response = await fetch(`/api/chats/${chatId}`);
      if (response.ok) {
        const chatData: ChatWithMessages = await response.json();
        console.log('Loaded chat data:', chatData.messages.length, 'messages');
        setMessages(chatData.messages);
        
        // Remove streaming message if we have new messages
        if (pendingHideStreaming) {
          console.log('Hiding streaming message after loading new messages');
          setShowStreamingMessage(false);
          setStreamingContent('');
          setPendingHideStreaming(false);
        }
      } else {
        throw new Error('Failed to load chat messages');
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      setError('Failed to load chat messages');
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const sendMessage = async (message: string, attachedFile?: File, fileType?: string, processedData?: string) => {
    console.log('sendMessage called with:', message, 'currentChatId:', chatId, 'file:', attachedFile?.name, 'type:', fileType);
    
    let currentChatId = chatId;
    
    // Create new chat if we don't have one
    if (!currentChatId) {
      console.log('Creating new chat...');
      try {
        // Get userId from localStorage/sessionStorage (set after login/signup)
        const userId = localStorage.getItem('userId') || sessionStorage.getItem('userId');
        if (!userId) {
          setError('You must be logged in to start a chat.');
          return;
        }
        const response = await fetch('/api/chat/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId }),
        });

        if (response.ok) {
          const newChat = await response.json();
          currentChatId = newChat.id;
          console.log('New chat created with ID:', currentChatId);
          onChatCreated?.(newChat.id);
        } else {
          throw new Error('Failed to create new chat');
        }
      } catch (error) {
        console.error('Error creating chat:', error);
        setError('Failed to create new chat');
        return;
      }
    }

    console.log('Sending message to chat:', currentChatId);
    setIsStreaming(true);
    setShowStreamingMessage(true);
    setStreamingContent('');
    setError(null);
    setPendingHideStreaming(false);

    // Add user message immediately
    const userMessage: Message = {
      id: `temp-${Date.now()}`,
      chat_id: currentChatId as string,
      content: message,
      sender: 'user',
      created_at: new Date(),
      updated_at: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const requestBody: any = {
        message,
        chatId: currentChatId,
        model: selectedModel,
      };

      // Add file data if available
      if (attachedFile && fileType) {
        requestBody.fileData = {
          name: attachedFile.name,
          type: fileType,
          size: attachedFile.size,
          processedData: processedData
        };
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body');
      }

      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        // Keep the last incomplete line in the buffer
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              console.log('Streaming complete, loading chat messages...');
              setIsStreaming(false);
              setPendingHideStreaming(true);
              
              // Load new messages - the streaming message will be hidden once new messages are confirmed
              setTimeout(async () => {
                await loadChatMessages();
                setShowStreamingMessage(false);
                setStreamingContent('');
                setPendingHideStreaming(false);
              }, 500); // Longer delay to ensure AI response is saved
              break;
            }

            try {
              const parsed = JSON.parse(data);
              if (parsed.content) {
                setStreamingContent(prev => prev + parsed.content);
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      
      // Set specific error messages based on error type
      if (error instanceof Error) {
        if (error.message.includes('overloaded') || error.message.includes('503')) {
          setError('The AI model is currently overloaded. Please try switching to a different model (like Gemini 2.0 Flash Experimental) or wait a few minutes and try again.');
        } else if (error.message.includes('quota')) {
          setError('API quota exceeded. Please wait a few minutes or try switching to Gemini Flash Lite model.');
        } else if (error.message.includes('not found')) {
          setError('Selected model is not available. Please choose a different model.');
        } else {
          setError(`Failed to send message: ${error.message}`);
        }
      } else {
        setError('Failed to send message');
      }
      
      setIsStreaming(false);
      setShowStreamingMessage(false);
      setStreamingContent('');
      setPendingHideStreaming(false);
      // Remove the temporary user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    }
  };

  if (!chatId && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col h-full bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        {/* Welcome screen */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-6 min-h-0">
          <div className="text-center max-w-2xl mx-auto animate-fade-in">
            <div className="relative mb-8">
              <Avatar icon={MessageSquare} size="lg" gradient />
              <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            </div>
            
            <Heading level={1} className="mb-3">
              Hello! I'm your AI Assistant
            </Heading>
            <Typography size="lg" color="secondary" className="mb-8 leading-relaxed">
              I'm here to help you with questions, creative tasks, analysis, and more. 
              What would you like to explore today?
            </Typography>
            
            {/* Quick starter prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button 
                  onClick={() => sendMessage("Help me write a creative story")}
                  className="p-4 text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
                >
                  <Typography size="sm" weight="medium" color="primary" className="mb-1">
                    ✨ Creative Writing
                  </Typography>
                  <Caption>
                    Help me write a creative story
                  </Caption>
                </button>              <button 
                onClick={() => sendMessage("Explain a complex topic in simple terms")}
                className="p-4 text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
              >
                <Typography size="sm" weight="medium" color="primary" className="mb-1">
                  🧠 Learning
                </Typography>
                <Caption>
                  Explain a complex topic simply
                </Caption>
              </button>
              
              <button 
                onClick={() => sendMessage("Help me solve a coding problem")}
                className="p-4 text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
              >
                <Typography size="sm" weight="medium" color="primary" className="mb-1">
                  💻 Coding Help
                </Typography>
                <Caption>
                  Help me solve a coding problem
                </Caption>
              </button>
              
              <button 
                onClick={() => sendMessage("Plan my day and set priorities")}
                className="p-4 text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
              >
                <Typography size="sm" weight="medium" color="primary" className="mb-1">
                  📋 Planning
                </Typography>
                <Caption>
                  Plan my day and set priorities
                </Caption>
              </button>
            </div>
          </div>
        </div>

        {/* Message input fixed at bottom */}
        <div className="flex-shrink-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4">
          <div className="max-w-4xl mx-auto">
            <MessageInput onSendMessage={sendMessage} disabled={isStreaming} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Messages area - takes full height minus input area */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-auto px-4 md:px-6"
        onScroll={handleScroll}
      >
        <div className="w-full max-w-4xl mx-auto py-8">
          {loading ? (
            <div className="flex items-center justify-center py-12 animate-fade-in">
              <div className="text-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin mb-4 mx-auto"></div>
                <span className="text-gray-500 dark:text-gray-400">Loading conversation...</span>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-12 animate-fade-in">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-red-500 text-2xl">⚠️</span>
              </div>
              <p className="text-red-600 dark:text-red-400 mb-4 text-lg">{error}</p>
              <button
                onClick={loadChatMessages}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                Try Again
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {messages.map((message, index) => (
                <div key={message.id}>
                  <MessageBubble message={message} />
                </div>
              ))}
              
              {/* Streaming message */}
              {showStreamingMessage && streamingContent && (
                <div>
                  <StreamingMessage 
                    content={streamingContent} 
                    isComplete={!isStreaming}
                  />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed message input at bottom */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 md:px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput onSendMessage={sendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}