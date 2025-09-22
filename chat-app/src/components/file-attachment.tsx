'use client';

import { useState, useRef, useEffect } from 'react';
import { Plus, Image, FileText, File, FileSpreadsheet, X } from 'lucide-react';
import { Icon } from './ui/icon';
import { Typography, Caption } from './ui/typography';
import { cn } from '@/lib/utils';

interface FileAttachmentProps {
  onFileSelect: (file: File, type: string, processedData?: string) => void;
  disabled?: boolean;
}

export function FileAttachment({ onFileSelect, disabled = false }: FileAttachmentProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentFileType, setCurrentFileType] = useState<string>('');

  const fileTypes = [
    {
      id: 'image',
      label: 'Image',
      icon: Image,
      accept: 'image/*',
      description: 'JPG, PNG, GIF, WebP',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      id: 'pdf',
      label: 'PDF',
      icon: FileText,
      accept: '.pdf',
      description: 'PDF documents',
      color: 'text-red-600 dark:text-red-400'
    },
    {
      id: 'excel',
      label: 'Spreadsheet',
      icon: FileSpreadsheet,
      accept: '.xlsx,.xls,.csv',
      description: 'Excel, CSV files',
      color: 'text-blue-600 dark:text-blue-400'
    },
    {
      id: 'document',
      label: 'Documents',
      icon: File,
      accept: '.doc,.docx,.txt,.rtf',
      description: 'Word, Text files',
      color: 'text-purple-600 dark:text-purple-400'
    }
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleFileTypeClick = (fileType: typeof fileTypes[0]) => {
    setCurrentFileType(fileType.id);
    if (fileInputRef.current) {
      fileInputRef.current.accept = fileType.accept;
      fileInputRef.current.click();
    }
    setIsOpen(false);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      try {
        if (currentFileType === 'image') {
          // Process image files to base64
          const processedData = await processImageFile(file);
          onFileSelect(file, currentFileType, processedData);
        } else {
          // For other file types, just send the file info for now
          onFileSelect(file, currentFileType);
        }
      } catch (error) {
        console.error('Error processing file:', error);
        onFileSelect(file, currentFileType);
      }
      
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const processImageFile = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('FileAttachment: Processed image, data URL length:', result?.length || 0);
        console.log('FileAttachment: Data URL starts with:', result?.substring(0, 50));
        resolve(result);
      };
      reader.onerror = () => {
        console.error('FileAttachment: Error reading file');
        reject(new Error('Failed to read file'));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Main button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className={cn(
          "p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all duration-200 flex-shrink-0",
          isOpen && "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300",
          disabled && "opacity-50 cursor-not-allowed"
        )}
        title="Attach file"
      >
        <Icon icon={Plus} size="md" color="muted" className={cn(
          "transition-transform duration-200",
          isOpen && "rotate-45"
        )} />
      </button>

      {/* File preview */}
      {selectedFile && (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3 shadow-lg min-w-[200px]">
          <div className="flex items-center gap-2">
            <div className="flex-1 min-w-0">
              <Typography size="sm" weight="medium" className="truncate">
                {selectedFile.name}
              </Typography>
              <Caption>
                {(selectedFile.size / 1024).toFixed(1)} KB
              </Caption>
            </div>
            <button
              onClick={removeFile}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <Icon icon={X} size="sm" color="muted" />
            </button>
          </div>
        </div>
      )}

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg py-2 min-w-[200px] z-50">
          <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
            <Typography size="sm" weight="medium" color="primary">
              Choose file type
            </Typography>
          </div>
          
          {fileTypes.map((fileType) => (
            <button
              key={fileType.id}
              onClick={() => handleFileTypeClick(fileType)}
              className="w-full flex items-center gap-3 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
            >
              <div className={cn("p-1.5 rounded-lg bg-opacity-10", fileType.color.replace('text-', 'bg-'))}>
                <Icon icon={fileType.icon} size="sm" className={fileType.color} />
              </div>
              <div className="flex-1">
                <Typography size="sm" weight="medium" color="primary">
                  {fileType.label}
                </Typography>
                <Caption>
                  {fileType.description}
                </Caption>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        className="hidden"
        accept=""
      />
    </div>
  );
}