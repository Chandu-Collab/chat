import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

export async function GET(request: NextRequest) {
  try {
    console.log('Testing Google AI API...');
    
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 500 });
    }

    console.log('API key found, length:', apiKey.length);
    
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    console.log('Sending test message...');
    const result = await model.generateContent('Hello, can you respond with a simple "Hi there!"?');
    const response = result.response.text();
    
    console.log('AI Response received:', response);
    
    return NextResponse.json({ 
      success: true, 
      response: response,
      apiKeyLength: apiKey.length 
    });
  } catch (error) {
    console.error('AI Test Error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false 
    }, { status: 500 });
  }
}