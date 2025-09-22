import pool from './database';
import { Chat, Message, CreateChatRequest, CreateMessageRequest, ChatWithMessages } from './types';
import { v4 as uuidv4 } from 'uuid';

export class DatabaseService {
  // Chat operations
  static async createChat(data: CreateChatRequest): Promise<Chat> {
    const id = uuidv4();
    const query = `
      INSERT INTO chats (id, user_id, title)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const result = await pool.query(query, [id, data.user_id, data.title]);
    return result.rows[0];
  }

  static async getChatsByUserId(userId: string): Promise<Chat[]> {
    const query = `
      SELECT * FROM chats 
      WHERE user_id = $1 
      ORDER BY updated_at DESC
    `;
    const result = await pool.query(query, [userId]);
    return result.rows;
  }

  static async getChatById(chatId: string): Promise<Chat | null> {
    const query = 'SELECT * FROM chats WHERE id = $1';
    const result = await pool.query(query, [chatId]);
    return result.rows[0] || null;
  }

  static async updateChatTitle(chatId: string, title: string): Promise<Chat | null> {
    const query = `
      UPDATE chats SET title = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 
      RETURNING *
    `;
    const result = await pool.query(query, [title, chatId]);
    return result.rows[0] || null;
  }

  static async deleteChat(chatId: string): Promise<boolean> {
    const query = 'DELETE FROM chats WHERE id = $1';
    const result = await pool.query(query, [chatId]);
    return result.rowCount !== null && result.rowCount > 0;
  }

  // Message operations
  static async createMessage(data: CreateMessageRequest): Promise<Message> {
    const id = uuidv4();
    const query = `
      INSERT INTO messages (id, chat_id, content, sender)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const result = await pool.query(query, [id, data.chat_id, data.content, data.sender]);
    
    // Update the chat's updated_at timestamp
    await pool.query(
      'UPDATE chats SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
      [data.chat_id]
    );
    
    return result.rows[0];
  }

  static async getMessagesByChatId(chatId: string): Promise<Message[]> {
    const query = `
      SELECT * FROM messages 
      WHERE chat_id = $1 
      ORDER BY created_at ASC
    `;
    const result = await pool.query(query, [chatId]);
    return result.rows;
  }

  static async getChatWithMessages(chatId: string): Promise<ChatWithMessages | null> {
    const chat = await this.getChatById(chatId);
    if (!chat) return null;

    const messages = await this.getMessagesByChatId(chatId);
    return { ...chat, messages };
  }

  // Generate chat title from first message
  static async generateChatTitle(content: string): Promise<string> {
    // Simple title generation - take first 50 characters
    const title = content.length > 50 ? content.substring(0, 50) + '...' : content;
    return title;
  }
}