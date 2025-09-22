import { NextRequest, NextResponse } from 'next/server';
import { DatabaseService } from '@/lib/database-service';
import { AIService } from '@/lib/ai-service';

export async function POST(request: NextRequest) {
  try {
    const { message, chatId, model = 'gemini-1.5-flash', userId = '00000000-0000-0000-0000-000000000001', fileData } = await request.json();

    if (!message || !chatId) {
      return NextResponse.json(
        { error: 'Message and chatId are required' },
        { status: 400 }
      );
    }

    console.log('Chat API: Received message with file data:', !!fileData);
    if (fileData) {
      console.log('Chat API: File type:', fileData.type, 'Name:', fileData.name);
    }

    // Verify chat exists and belongs to user
    const chat = await DatabaseService.getChatById(chatId);
    if (!chat) {
      return NextResponse.json(
        { error: 'Chat not found' },
        { status: 404 }
      );
    }

    // Save user message to database
    const userMessage = await DatabaseService.createMessage({
      chat_id: chatId,
      content: message,
      sender: 'user'
    });

    // Get all messages for context
    const messages = await DatabaseService.getMessagesByChatId(chatId);

    // Generate AI response
    const aiResponseStream = await AIService.generateResponse(messages, model, fileData);

    // Create a new stream that saves the complete response to the database
    let completeResponse = '';
    const encoder = new TextEncoder();

    const transformedStream = new ReadableStream({
      async start(controller) {
        const reader = aiResponseStream.getReader();
        
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) break;
            
            completeResponse += value;
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: value })}\n\n`));
          }
          
          // Save the complete AI response to the database
          await DatabaseService.createMessage({
            chat_id: chatId,
            content: completeResponse,
            sender: 'ai'
          });

          // Update chat title if it's the first exchange
          if (messages.length === 1) { // Only user message exists
            const title = await DatabaseService.generateChatTitle(message);
            await DatabaseService.updateChatTitle(chatId, title);
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        } finally {
          reader.releaseLock();
        }
      }
    });

    return new Response(transformedStream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}