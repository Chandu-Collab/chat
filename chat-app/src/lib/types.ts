export interface User {
  id: string;
  email?: string;
  name?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Chat {
  id: string;
  user_id: string;
  title?: string;
  created_at: Date;
  updated_at: Date;
}

export interface Message {
  id: string;
  chat_id: string;
  content: string;
  sender: 'user' | 'ai';
  created_at: Date;
  updated_at: Date;
}

export interface ChatWithMessages extends Chat {
  messages: Message[];
}

export interface CreateChatRequest {
  user_id: string;
  title?: string;
}

export interface CreateMessageRequest {
  chat_id: string;
  content: string;
  sender: 'user' | 'ai';
}