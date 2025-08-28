
import React from 'react';
import CloseIcon from './icons/CloseIcon';
import { ShapeType } from '../App';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isAutoMode: boolean;
  setIsAutoMode: (isAuto: boolean) => void;
  shape: ShapeType;
  setShape: (shape: ShapeType) => void;
  animationSpeed: number;
  setAnimationSpeed: (speed: number) => void;
  zoomEnabled: boolean;
  setZoomEnabled: (enabled: boolean) => void;
}

const ShapeButton: React.FC<{
  shapeName: ShapeType;
  currentShape: ShapeType;
  setShape: (shape: ShapeType) => void;
  label?: string;
}> = ({ shapeName, currentShape, setShape, label }) => (
  <button
    onClick={() => setShape(shapeName)}
    className={`p-3 rounded-md font-semibold transition-colors text-center ${
      currentShape === shapeName
        ? 'bg-cyan-500 text-black'
        : 'bg-gray-700/60 hover:bg-gray-600/80'
    }`}
  >
    {label || shapeName}
  </button>
);


const SettingsPanel: React.FC<SettingsPanelProps> = ({ 
    isOpen, 
    onClose, 
    isAutoMode, 
    setIsAutoMode,
    shape,
    setShape,
    animationSpeed,
    setAnimationSpeed,
    zoomEnabled,
    setZoomEnabled,
}) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 flex items-center justify-center"
        onClick={onClose}
    >
      <div 
        className="bg-gray-900/80 border border-cyan-400/30 rounded-lg shadow-2xl shadow-cyan-500/10 w-full max-w-md p-6 m-4 text-white space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-cyan-300">Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700 transition-colors">
            <CloseIcon />
          </button>
        </div>
        
        <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-md">
          <div>
            <label htmlFor="auto-mode-toggle" className="font-semibold text-lg">
              Auto Code Generation
            </label>
            <p className="text-sm text-gray-400">Continuously generate code with Gemini.</p>
          </div>
          <label htmlFor="auto-mode-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                id="auto-mode-toggle" 
                className="sr-only"
                checked={isAutoMode}
                onChange={() => setIsAutoMode(!isAutoMode)}
              />
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${isAutoMode ? 'translate-x-6 bg-cyan-300' : ''}`}></div>
            </div>
          </label>
        </div>

        <div className="space-y-3">
            <h3 className="font-semibold text-lg">3D Object</h3>
            <div className="grid grid-cols-3 gap-3">
                <ShapeButton shapeName="Z" currentShape={shape} setShape={setShape} />
                <ShapeButton shapeName="TorusKnot" currentShape={shape} setShape={setShape} label="Knot" />
                <ShapeButton shapeName="Sphere" currentShape={shape} setShape={setShape} />
            </div>
        </div>

        <div className="space-y-3">
            <h3 className="font-semibold text-lg">Animation</h3>
            <div className="bg-gray-800/50 p-4 rounded-md">
                <label htmlFor="animation-speed" className="block mb-2 text-sm text-gray-400">Rotation Speed: <span className="font-bold text-cyan-300">{(animationSpeed * 100).toFixed(0)}</span></label>
                <input
                    id="animation-speed"
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={animationSpeed}
                    onChange={(e) => setAnimationSpeed(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
            </div>
        </div>

        <div className="flex items-center justify-between bg-gray-800/50 p-4 rounded-md">
          <div>
            <label htmlFor="zoom-toggle" className="font-semibold text-lg">
              Enable Zoom
            </label>
            <p className="text-sm text-gray-400">Allow zooming with mouse wheel.</p>
          </div>
          <label htmlFor="zoom-toggle" className="flex items-center cursor-pointer">
            <div className="relative">
              <input 
                type="checkbox" 
                id="zoom-toggle" 
                className="sr-only"
                checked={zoomEnabled}
                onChange={() => setZoomEnabled(!zoomEnabled)}
              />
              <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
              <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform ${zoomEnabled ? 'translate-x-6 bg-cyan-300' : ''}`}></div>
            </div>
          </label>
        </div>

      </div>
    </div>
  );
};

export default SettingsPanel;
