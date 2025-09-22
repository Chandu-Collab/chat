import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from './types';

const apiKey = process.env.GOOGLE_API_KEY || '';
console.log('AI Service: API key configured?', apiKey ? 'Yes' : 'No');
console.log('AI Service: API key length:', apiKey.length);

const genAI = new GoogleGenerativeAI(apiKey);

export class AIService {
  private static model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  static async generateResponse(messages: Message[]): Promise<ReadableStream<string>> {
    try {
      console.log('AIService: Starting generation with', messages.length, 'messages');
      
      // Check if API key is available
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error('Google API key is not configured');
      }
      
      // Get the last user message
      const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
      
      if (!lastUserMessage) {
        throw new Error('No user message found');
      }

      console.log('AIService: Sending message:', lastUserMessage.content);

      // For first message, start fresh. For subsequent messages, include history
      let chat;
      if (messages.length === 1) {
        // First message - no history needed
        chat = this.model.startChat();
      } else {
        // Convert previous messages to Gemini format (excluding the last user message)
        const conversationHistory = messages.slice(0, -1).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));
        
        console.log('AIService: Using conversation history:', conversationHistory.length, 'messages');
        chat = this.model.startChat({
          history: conversationHistory,
        });
      }

      // Generate streaming response
      const result = await chat.sendMessageStream(lastUserMessage.content);

      // Create a readable stream
      return new ReadableStream({
        async start(controller) {
          try {
            for await (const chunk of result.stream) {
              const chunkText = chunk.text();
              if (chunkText) {
                controller.enqueue(chunkText);
              }
            }
            controller.close();
          } catch (error) {
            console.error('AIService: Streaming error:', error);
            controller.error(error);
          }
        }
      });
    } catch (error) {
      console.error('AI Service Error:', error);
      if (error instanceof Error) {
        throw new Error(`AI Service failed: ${error.message}`);
      }
      throw new Error('Failed to generate AI response');
    }
  }

  static async generateNonStreamingResponse(messages: Message[]): Promise<string> {
    try {
      console.log('AIService: Generating non-streaming response');
      
      // Check if API key is available
      if (!process.env.GOOGLE_API_KEY) {
        throw new Error('Google API key is not configured');
      }

      // Get the last user message
      const lastUserMessage = messages.filter(m => m.sender === 'user').pop();
      
      if (!lastUserMessage) {
        throw new Error('No user message found');
      }

      // For first message, start fresh. For subsequent messages, include history
      let chat;
      if (messages.length === 1) {
        chat = this.model.startChat();
      } else {
        const conversationHistory = messages.slice(0, -1).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));
        
        chat = this.model.startChat({
          history: conversationHistory,
        });
      }

      // Generate response
      const result = await chat.sendMessage(lastUserMessage.content);
      return result.response.text();
    } catch (error) {
      console.error('AI Service Error (non-streaming):', error);
      if (error instanceof Error) {
        throw new Error(`AI Service failed: ${error.message}`);
      }
      throw new Error('Failed to generate AI response');
    }
  }
}