'use client';

import { useState } from 'react';
import { ChevronDown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModelSelectorProps {
  selectedModel: string;
  onModelChange: (model: string) => void;
}

const GEMINI_MODELS = [
  {
    id: 'gemini-2.0-flash-lite-001',
    name: 'Gemini 2.0 Flash Lite',
    description: 'Lightweight and fast, less likely to be overloaded ✅',
    icon: '🌟',
  },
  {
    id: 'gemini-2.0-flash-exp',
    name: 'Gemini 2.0 Flash Experimental',
    description: 'Experimental version, may be overloaded',
    icon: '🧪',
  },
  {
    id: 'gemini-2.0-flash',
    name: 'Gemini 2.0 Flash',
    description: 'Latest fast model, may be overloaded during peak times',
    icon: '⚡',
  },
  {
    id: 'gemini-2.0-flash-001',
    name: 'Gemini 2.0 Flash 001',
    description: 'Stable numbered version of 2.0 Flash',
    icon: '🔢',
  },
  {
    id: 'gemini-2.5-flash',
    name: 'Gemini 2.5 Flash',
    description: 'Stable version with 1M token support',
    icon: '💎',
  },
  {
    id: 'gemini-2.5-pro',
    name: 'Gemini 2.5 Pro',
    description: 'Most capable, higher quality responses',
    icon: '🚀',
  },
];

export function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const currentModel = GEMINI_MODELS.find(model => model.id === selectedModel) || GEMINI_MODELS[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 border border-gray-200 dark:border-gray-700"
      >
        <Sparkles className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {currentModel.icon} {currentModel.name}
        </span>
        <ChevronDown className={cn(
          "h-4 w-4 text-gray-500 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 dark:text-gray-400 px-3 py-2 uppercase tracking-wide">
              Choose Gemini Model
            </div>
            {GEMINI_MODELS.map((model) => (
              <button
                key={model.id}
                onClick={() => {
                  onModelChange(model.id);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left px-3 py-3 rounded-lg transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700",
                  selectedModel === model.id && "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                )}
              >
                <div className="flex items-start gap-3">
                  <span className="text-lg">{model.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white text-sm">
                        {model.name}
                      </span>
                      {selectedModel === model.id && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {model.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}