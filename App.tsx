
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Scene from './components/Scene';
import SettingsPanel from './components/SettingsPanel';
import PromptBar from './components/PromptBar';
import SettingsIcon from './components/icons/SettingsIcon';
import * as geminiService from './services/geminiService';

export type ShapeType = 'Z' | 'TorusKnot' | 'Sphere';

const App: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(true);
  const [currentCode, setCurrentCode] = useState<string>('// Welcome to Gemini 3D Code Visualizer...\n// Starting code generation...');
  const [isLoading, setIsLoading] = useState(false);
  
  const [shape, setShape] = useState<ShapeType>('Z');
  const [animationSpeed, setAnimationSpeed] = useState(0.15);
  const [zoomEnabled, setZoomEnabled] = useState(true);

  const stopStreamSignal = useRef({ stopped: false });

  const startStream = useCallback(() => {
    stopStreamSignal.current.stopped = false;
    
    const codeBuffer: string[] = [];
    let lastUpdateTime = 0;
    const UPDATE_INTERVAL = 100;

    const handleChunk = (chunk: string) => {
        codeBuffer.push(chunk);
        const now = Date.now();
        if (now - lastUpdateTime > UPDATE_INTERVAL) {
            setCurrentCode(prev => (prev + codeBuffer.join('')).slice(-4000));
            codeBuffer.length = 0;
            lastUpdateTime = now;
        }
    };

    geminiService.generateCodeStream(handleChunk, stopStreamSignal.current);
  }, []);
  
  useEffect(() => {
    if (isAutoMode) {
        setIsLoading(true);
        setCurrentCode("// Auto-code generation enabled...\n// Fetching code stream from Gemini...\n");
        startStream();
        setTimeout(() => setIsLoading(false), 1500);
    }
    return () => {
        stopStreamSignal.current.stopped = true;
    };
  }, [isAutoMode, startStream]);

  const handlePromptSubmit = async (prompt: string) => {
    if (!prompt) return;
    setIsLoading(true);
    setCurrentCode(`// Generating code for: ${prompt}`);
    const code = await geminiService.generateCodeFromPrompt(prompt);
    setCurrentCode(code);
    setIsLoading(false);
  };

  return (
    <div className="w-screen h-screen bg-black text-white relative overflow-hidden">
      <Scene 
        code={currentCode}
        shape={shape}
        animationSpeed={animationSpeed}
        zoomEnabled={zoomEnabled}
      />

      <button
        onClick={() => setIsSettingsOpen(true)}
        className="absolute top-4 right-4 p-3 bg-gray-800/50 rounded-full hover:bg-gray-700/70 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-400"
        aria-label="Open settings"
      >
        <SettingsIcon />
      </button>

      <SettingsPanel
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isAutoMode={isAutoMode}
        setIsAutoMode={setIsAutoMode}
        shape={shape}
        setShape={setShape}
        animationSpeed={animationSpeed}
        setAnimationSpeed={setAnimationSpeed}
        zoomEnabled={zoomEnabled}
        setZoomEnabled={setZoomEnabled}
      />

      {!isAutoMode && (
        <PromptBar onSubmit={handlePromptSubmit} isLoading={isLoading} />
      )}
    </div>
  );
};

export default App;
