'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, ChatWithMessages } from '@/lib/types';
import { MessageBubble } from './message-bubble';
import { StreamingMessage } from './streaming-message';
import { MessageInput } from './message-input';
import { Loader2, MessageSquare, Settings } from 'lucide-react';

interface ChatInterfaceProps {
  chatId?: string;
  onChatCreated?: (chatId: string) => void;
  selectedModel?: string;
}

export function ChatInterface({ chatId, onChatCreated, selectedModel = 'gemini-1.5-flash' }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showStreamingMessage, setShowStreamingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingHideStreaming, setPendingHideStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingContent]);

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

    setError(null);

    try {
      const response = await fetch(`/api/chats/${chatId}`);
      if (response.ok) {
        const chatData: ChatWithMessages = await response.json();
        console.log('Loaded chat data:', chatData);
        const previousCount = messages.length;
        setMessages(chatData.messages);
        
        // If we were waiting to hide streaming message and we got new messages
        if (pendingHideStreaming && chatData.messages.length > previousCount) {
          console.log('New messages loaded, hiding streaming message now');
          setTimeout(() => {
            setShowStreamingMessage(false);
            setStreamingContent('');
            setPendingHideStreaming(false);
          }, 200);
        }
      } else {
        throw new Error('Failed to load chat messages');
      }
    } catch (error) {
      console.error('Error loading chat:', error);
      setError('Failed to load chat messages');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async (message: string) => {
    console.log('sendMessage called with:', message, 'currentChatId:', chatId);
    
    let currentChatId = chatId;
    
    // Create new chat if we don't have one
    if (!currentChatId) {
      console.log('Creating new chat...');
      try {
        const response = await fetch('/api/chat/new', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
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
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          chatId: currentChatId,
          model: selectedModel,
        }),
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
              await loadChatMessages();
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
        if (error.message.includes('quota')) {
          setError('API quota exceeded. Please wait a few minutes or try switching to Gemini Flash model.');
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
      <div className="flex-1 flex flex-col bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 px-4 md:px-6">
        {/* Welcome screen */}
        <div className="flex-1 flex items-center justify-center animate-fade-in">
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative mb-8">
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                <MessageSquare className="h-10 w-10 text-white" />
              </div>
              <div className="absolute inset-0 w-20 h-20 mx-auto bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            </div>
            
            <h1 className="text-4xl font-light text-gray-900 dark:text-white mb-3 tracking-tight">
              Hello! I'm your AI Assistant
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
              I'm here to help you with questions, creative tasks, analysis, and more. 
              What would you like to explore today?
            </p>
            
            {/* Quick starter prompts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <button 
                onClick={() => sendMessage("Help me write a creative story")}
                className="p-4 text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  ✨ Creative Writing
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Help me write a creative story
                </div>
              </button>
              
              <button 
                onClick={() => sendMessage("Explain a complex topic in simple terms")}
                className="p-4 text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  🧠 Learning
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Explain a complex topic simply
                </div>
              </button>
              
              <button 
                onClick={() => sendMessage("Help me solve a coding problem")}
                className="p-4 text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  💻 Coding Help
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Help me solve a coding problem
                </div>
              </button>
              
              <button 
                onClick={() => sendMessage("Plan my day and set priorities")}
                className="p-4 text-left bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700 transition-all hover:scale-105"
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  📋 Planning
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Plan my day and set priorities
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Message input */}
        <div className="pb-6">
          <div className="max-w-4xl mx-auto">
            <MessageInput onSendMessage={sendMessage} disabled={isStreaming} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 px-4 md:px-6">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto py-8">
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
            <div className="space-y-8 animate-fade-in">
              {messages.map((message, index) => (
                <div key={message.id} className="animate-slide-in" style={{animationDelay: `${index * 0.1}s`}}>
                  <MessageBubble message={message} />
                </div>
              ))}
              
              {/* Streaming message */}
              {showStreamingMessage && streamingContent && (
                <div className="animate-fade-in">
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

      {/* Message input */}
      <div className="bg-white dark:bg-gray-900 py-4">
        <div className="max-w-4xl mx-auto">
          <MessageInput onSendMessage={sendMessage} disabled={isStreaming} />
        </div>
      </div>
    </div>
  );
}