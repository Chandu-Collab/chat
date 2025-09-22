import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from './types';

const apiKey = process.env.GOOGLE_API_KEY || '';
console.log('AI Service: API key configured?', apiKey ? 'Yes' : 'No');
console.log('AI Service: API key length:', apiKey.length);

const genAI = new GoogleGenerativeAI(apiKey);

export class AIService {
  static async generateResponse(
    messages: Message[], 
    modelName: string = 'gemini-1.5-flash', 
    fileData?: { processedData: string; type: string; name: string; size: number }
  ): Promise<ReadableStream<string>> {
    try {
      console.log('AIService: Starting generation with', messages.length, 'messages using model:', modelName);
      
      // Create model instance with the specified model
      const model = genAI.getGenerativeModel({ model: modelName });
      
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
      console.log('AIService: Has file data:', !!fileData);

      // For first message, start fresh. For subsequent messages, include history
      let chat;
      if (messages.length === 1) {
        // First message - no history needed
        chat = model.startChat();
      } else {
        // Convert previous messages to Gemini format (excluding the last user message)
        const conversationHistory = messages.slice(0, -1).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));
        
        console.log('AIService: Using conversation history:', conversationHistory.length, 'messages');
        chat = model.startChat({
          history: conversationHistory,
        });
      }

      // Prepare message parts
      const messageParts: any[] = [{ text: lastUserMessage.content }];
      
      // Add image data if available
      if (fileData && fileData.type.startsWith('image/')) {
        let base64Data = fileData.processedData;
        
        // Remove data URL prefix if present
        if (base64Data.includes(',')) {
          base64Data = base64Data.split(',')[1];
        }
        
        messageParts.push({
          inlineData: {
            data: base64Data,
            mimeType: fileData.type
          }
        });
        console.log('AIService: Added image data to message, MIME type:', fileData.type);
        console.log('AIService: Base64 data length:', base64Data?.length || 0);
        console.log('AIService: Message parts count:', messageParts.length);
      }

      // Generate streaming response
      console.log('AIService: Sending message parts:', JSON.stringify(messageParts.map(part => ({
        ...part,
        inlineData: part.inlineData ? { ...part.inlineData, data: '[BASE64_DATA]' } : undefined
      })), null, 2));
      
      const result = await chat.sendMessageStream(messageParts);

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
      
      // Handle quota exceeded errors with specific messaging
      if (error instanceof Error && error.message.includes('quota')) {
        throw new Error('API quota exceeded. Please wait a few minutes and try again, or switch to a different model.');
      }
      
      // Handle model not found errors
      if (error instanceof Error && error.message.includes('not found')) {
        throw new Error(`Model "${modelName}" is not available. Please select a different model.`);
      }
      
      if (error instanceof Error) {
        throw new Error(`AI Service failed: ${error.message}`);
      }
      throw new Error('Failed to generate AI response');
    }
  }

  static async generateNonStreamingResponse(messages: Message[], modelName: string = 'gemini-1.5-flash'): Promise<string> {
    try {
      console.log('AIService: Generating non-streaming response using model:', modelName);
      
      // Create model instance with the specified model
      const model = genAI.getGenerativeModel({ model: modelName });
      
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
        chat = model.startChat();
      } else {
        const conversationHistory = messages.slice(0, -1).map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }));
        
        chat = model.startChat({
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