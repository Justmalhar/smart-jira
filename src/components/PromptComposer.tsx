'use client';

import React, { useState } from 'react';
import TextareaAutosize from 'react-textarea-autosize';

interface PromptComposerProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptComposer: React.FC<PromptComposerProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading) {
      onSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-4 mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
          
          <div className="flex-1">
            <TextareaAutosize
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Describe your project idea and let AI break it down into tasks..."
              className="w-full resize-none border-0 text-lg placeholder-gray-500 focus:ring-0 focus:outline-none"
              minRows={3}
              maxRows={10}
              disabled={isLoading}
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">
                  {prompt.length > 0 && `${prompt.length} characters`}
                </span>
                {prompt.length > 0 && (
                  <span className="text-xs text-gray-400">
                    Press Ctrl+Enter to generate
                  </span>
                )}
              </div>
              
              <button
                type="submit"
                disabled={!prompt.trim() || isLoading}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
                  !prompt.trim() || isLoading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Generating...</span>
                  </div>
                ) : (
                  'Generate Tasks'
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
      
      {prompt.length === 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-600 mb-2">
            <strong>💡 Try these examples:</strong>
          </p>
          <div className="space-y-1">
            <button
              onClick={() => setPrompt('Build a todo app with React and Node.js that allows users to create, edit, and delete tasks')}
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              "Build a todo app with React and Node.js..."
            </button>
            <button
              onClick={() => setPrompt('Create an e-commerce website with user authentication, product catalog, shopping cart, and payment integration')}
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              "Create an e-commerce website with user authentication..."
            </button>
            <button
              onClick={() => setPrompt('Develop a mobile app for tracking fitness goals with workout plans, progress tracking, and social features')}
              className="block text-sm text-blue-600 hover:text-blue-800 hover:underline"
            >
              "Develop a mobile app for tracking fitness goals..."
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PromptComposer;