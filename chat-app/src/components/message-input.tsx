'use client';

import { useState, useRef } from 'react';
import { Send, Loader2, Mic } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FileAttachment } from './file-attachment';

interface MessageInputProps {
  onSendMessage: (message: string, attachedFile?: File, fileType?: string, processedData?: string) => void;
  disabled?: boolean;
}

export function MessageInput({ onSendMessage, disabled = false }: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [fileType, setFileType] = useState<string>('');
  const [processedData, setProcessedData] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const getFileContext = (file: File, type: string): string => {
    const contexts = {
      image: "Please analyze the image I've uploaded and describe what you see in detail.",
      pdf: "Please read and analyze the PDF document I've uploaded and provide a summary of its contents.",
      excel: "Please analyze the spreadsheet data I've uploaded and provide insights.",
      document: "Please read and analyze the document I've uploaded and summarize the key points."
    };
    return contexts[type as keyof typeof contexts] || "Please analyze the uploaded file.";
  };

  const handleFileSelect = (file: File, type: string, data?: string) => {
    setAttachedFile(file);
    setFileType(type);
    setProcessedData(data || '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if ((message.trim() || attachedFile) && !disabled) {
      // Send message with file data if available
      onSendMessage(
        message.trim() || (attachedFile ? getFileContext(attachedFile, fileType) : ''),
        attachedFile || undefined,
        fileType || undefined,
        processedData || undefined
      );
      
      setMessage('');
      setAttachedFile(null);
      setFileType('');
      setProcessedData('');
      
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      const maxHeight = 200; // Maximum height in pixels
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        {/* Helper text on top */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex-1">
            {attachedFile && (
              <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">
                📎 {attachedFile.name} ({fileType}) - {(attachedFile.size / 1024).toFixed(1)} KB
              </div>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">↵</kbd> to send, <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">Shift</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 rounded text-xs">↵</kbd> for new line</span>
            {message.length > 0 && (
              <span className="text-blue-500 dark:text-blue-400 font-medium ml-4">
                {message.length} characters
              </span>
            )}
          </div>
        </div>

        <div className="flex items-end gap-3 bg-white dark:bg-gray-800 p-4">
          {/* File attachment dropdown */}
          <FileAttachment 
            onFileSelect={handleFileSelect} 
            disabled={disabled}
          />

          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                adjustTextareaHeight();
              }}
              onKeyDown={handleKeyDown}
              placeholder={disabled ? "AI is thinking..." : "Message AI Assistant..."}
              disabled={disabled}
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none transition-colors text-base leading-relaxed",
                disabled && "opacity-50 cursor-not-allowed"
              )}
              style={{
                minHeight: '24px',
                maxHeight: '200px',
                overflowY: 'auto',
              }}
            />
          </div>

          {/* Voice input button */}
          <button
            type="button"
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 flex-shrink-0"
            title="Voice input"
          >
            <Mic className="h-5 w-5" />
          </button>

          {/* Send button */}
          <button
            type="submit"
            disabled={(!message.trim() && !attachedFile) || disabled}
            className={cn(
              "p-3 rounded-2xl transition-all duration-200 transform flex-shrink-0",
              (message.trim() || attachedFile) && !disabled
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl hover:scale-105"
                : "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed"
            )}
          >
            {disabled ? (
              <div className="relative">
                <Loader2 className="h-5 w-5 animate-spin" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
              </div>
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}