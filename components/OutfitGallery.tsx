import React from 'react';
import type { OutfitResult } from '../types';
import { PersonIcon, ShirtIcon, PantsIcon, DownloadIcon, SparklesIcon, DressIcon } from './icons';

interface OutfitGalleryProps {
  results: OutfitResult[];
  modelImageBase64?: string;
  onStyleWithAccessories: (result: OutfitResult) => void;
  showStyleButton?: boolean;
}

const SkeletonCard: React.FC = () => {
    return (
        <div className="w-full bg-white p-3 rounded-xl shadow-sm border border-gray-200 animate-pulse">
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-3"></div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>
                    <div className="w-4 h-4 text-gray-400">+</div>
                    <div className="w-10 h-10 rounded-lg bg-gray-300 flex-shrink-0"></div>
                </div>
            </div>
             <p className="text-xs text-center text-gray-500 mt-2">Generating...</p>
        </div>
    );
};

const ResultCard: React.FC<{ result: OutfitResult; modelImageBase64?: string; onStyle: (result: OutfitResult) => void; showStyleButton: boolean; }> = ({ result, modelImageBase64, onStyle, showStyleButton }) => {
  const handleDownload = (base64Image: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Image}`;
    const topName = result.top?.name || result.dress?.name || 'item';
    const bottomName = result.bottom?.name || 'combo';
    const sanitizedTop = topName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const sanitizedBottom = bottomName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `outfit-${sanitizedTop}-${sanitizedBottom}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="w-full bg-white p-3 rounded-xl shadow-sm border border-gray-200 transition-all duration-300 flex flex-col">
      <div className="w-full aspect-square rounded-lg mb-3 overflow-hidden relative group">
        {result.status === 'success' && result.imageUrl ? (
          <img src={`data:image/png;base64,${result.imageUrl}`} alt="Generated outfit" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-red-100 flex flex-col items-center justify-center text-center p-2">
            <p className="text-sm font-semibold text-red-700">Generation Failed</p>
            <p className="text-xs text-red-600 mt-1">{result.error}</p>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2 flex-grow">
          {modelImageBase64 && <PersonIcon className="w-6 h-6 text-gray-400" title="Model" />}
          {result.dress && <img src={`data:${result.dress.mimeType};base64,${result.dress.base64}`} alt={result.dress.name} className="w-10 h-10 object-cover rounded-md border" />}
          {result.top && <img src={`data:${result.top.mimeType};base64,${result.top.base64}`} alt={result.top.name} className="w-10 h-10 object-cover rounded-md border" />}
          {result.bottom && <img src={`data:${result.bottom.mimeType};base64,${result.bottom.base64}`} alt={result.bottom.name} className="w-10 h-10 object-cover rounded-md border" />}
      </div>
      {result.status === 'success' && result.imageUrl && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex flex-col sm:flex-row gap-2">
            <button
                onClick={() => handleDownload(result.imageUrl!)}
                className="flex-1 flex items-center justify-center bg-gray-100 text-gray-700 font-semibold py-2 px-3 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition-colors duration-200 text-sm"
                aria-label="Download image"
              >
                <DownloadIcon className="w-4 h-4 mr-2" />
                Download
              </button>
              {showStyleButton && (
                <button
                    onClick={() => onStyle(result)}
                    className="flex-1 flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200 text-sm"
                    aria-label="Style with Accessories"
                >
                    <SparklesIcon className="w-4 h-4 mr-2" />
                    Style
                </button>
              )}
        </div>
      )}
    </div>
  );
};

export const OutfitGallery: React.FC<OutfitGalleryProps> = ({ results, modelImageBase64, onStyleWithAccessories, showStyleButton = true }) => {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="w-16 h-16 text-gray-300 mb-4 flex items-center justify-center">
            <ShirtIcon className="w-8 h-8 inline-block" /><PantsIcon className="w-8 h-8 inline-block" />
            <span className="mx-2 text-xl">/</span>
            <DressIcon className="w-10 h-10 inline-block"/>
        </div>
        <h3 className="text-lg font-semibold text-gray-700">Your Outfit Gallery</h3>
        <p className="text-sm text-gray-500 mt-1">Generated outfits will appear here once you've added items and clicked "Generate".</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {results.map((result) => {
        if (result.status === 'pending' || result.status === 'generating') {
          return <SkeletonCard key={result.id} />;
        }
        return <ResultCard key={result.id} result={result} modelImageBase64={modelImageBase64} onStyle={onStyleWithAccessories} showStyleButton={showStyleButton} />;
      })}
    </div>
  );
};
