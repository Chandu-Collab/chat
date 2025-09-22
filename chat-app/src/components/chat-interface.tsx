'use client';

import { useState, useEffect, useRef } from 'react';
import { Message, ChatWithMessages } from '@/lib/types';
import { MessageBubble } from './message-bubble';
import { StreamingMessage } from './streaming-message';
import { MessageInput } from './message-input';
import { Loader2, MessageSquare } from 'lucide-react';

interface ChatInterfaceProps {
  chatId?: string;
  onChatCreated?: (chatId: string) => void;
}

export function ChatInterface({ chatId, onChatCreated }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
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

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/chats/${chatId}`);
      if (response.ok) {
        const chatData: ChatWithMessages = await response.json();
        console.log('Loaded chat data:', chatData);
        setMessages(chatData.messages);
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
    setStreamingContent('');
    setError(null);

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
              setIsStreaming(false);
              // Reload messages to get the final saved message
              setTimeout(() => loadChatMessages(), 100);
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
      setError('Failed to send message');
      setIsStreaming(false);
      // Remove the temporary user message on error
      setMessages(prev => prev.filter(msg => msg.id !== userMessage.id));
    }
  };

  if (!chatId && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col">
        {/* Welcome screen */}
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md mx-auto px-4">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to ChatBot
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start a conversation by typing a message below. Your chat will be saved automatically.
            </p>
          </div>
        </div>

        {/* Message input */}
        <MessageInput onSendMessage={sendMessage} disabled={isStreaming} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-500">Loading messages...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-500 dark:text-red-400">{error}</p>
              <button
                onClick={loadChatMessages}
                className="mt-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="mb-4 p-2 bg-gray-100 dark:bg-gray-800 rounded">
                <p className="text-sm">Debug: {messages.length} messages loaded</p>
                {messages.length > 0 && (
                  <p className="text-xs">Last message: {messages[messages.length - 1]?.content?.substring(0, 50)}</p>
                )}
              </div>
              <div className="space-y-6">
                {messages.map((message) => {
                  console.log('Rendering message:', message);
                  return (
                    <MessageBubble key={message.id} message={message} />
                  );
                })}
                
                {/* Streaming message */}
                {isStreaming && streamingContent && (
                  <StreamingMessage 
                    content={streamingContent} 
                    isComplete={false}
                  />
                )}
              </div>
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Message input */}
      <MessageInput onSendMessage={sendMessage} disabled={isStreaming} />
    </div>
  );
}