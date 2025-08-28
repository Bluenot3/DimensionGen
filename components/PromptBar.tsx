
import React, { useState } from 'react';

interface PromptBarProps {
  onSubmit: (prompt: string) => void;
  isLoading: boolean;
}

const PromptBar: React.FC<PromptBarProps> = ({ onSubmit, isLoading }) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onSubmit(prompt);
      setPrompt('');
    }
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
      <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
        <div className="relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Enter a prompt to generate code (e.g., 'a python function for fibonacci')"
            disabled={isLoading}
            className="w-full p-4 pl-6 pr-28 rounded-full bg-gray-900/80 border-2 border-cyan-400/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all shadow-lg"
          />
          <button 
            type="submit"
            disabled={isLoading}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold transition-colors"
          >
            {isLoading ? '...' : 'Generate'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PromptBar;
