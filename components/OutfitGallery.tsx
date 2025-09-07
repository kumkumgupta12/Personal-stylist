
import React from 'react';
import type { OutfitResult } from '../types';
import { PersonIcon, ShirtIcon, PantsIcon, DownloadIcon } from './icons';

interface OutfitGalleryProps {
  results: OutfitResult[];
  modelImageBase64?: string;
  modelImageMimeType?: string;
}

const SkeletonCard: React.FC<{ result: OutfitResult; modelImageBase64?: string }> = ({ result, modelImageBase64 }) => {
    return (
        <div className="w-full bg-white p-3 rounded-xl shadow-sm border border-gray-200 animate-pulse">
            <div className="w-full h-64 bg-gray-200 rounded-lg mb-3"></div>
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    {modelImageBase64 && <div className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0"></div>}
                    <div className="w-4 h-4 text-gray-400">+</div>
                    <div className="w-10 h-10 rounded-lg bg-gray-300 flex-shrink-0"></div>
                    <div className="w-4 h-4 text-gray-400">+</div>
                    <div className="w-10 h-10 rounded-lg bg-gray-300 flex-shrink-0"></div>
                </div>
            </div>
             <p className="text-xs text-center text-gray-500 mt-2">
                {result.status === 'generating' ? 'Generating...' : 'Pending...'}
            </p>
        </div>
    );
};

const ResultCard: React.FC<{ result: OutfitResult; modelImageBase64?: string; }> = ({ result, modelImageBase64 }) => {
  const handleDownload = (base64Image: string, topName: string, bottomName: string) => {
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${base64Image}`;
    // Sanitize names for filename
    const sanitizedTop = topName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const sanitizedBottom = bottomName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    link.download = `outfit-${sanitizedTop}-${sanitizedBottom}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
    
  return (
    <div className="w-full bg-white p-3 rounded-xl shadow-sm border border-gray-200 transition-all duration-300">
      <div className="w-full aspect-square rounded-lg mb-3 overflow-hidden relative group">
        {result.status === 'success' && result.imageUrl ? (
          <>
            <img src={`data:image/png;base64,${result.imageUrl}`} alt="Generated outfit" className="w-full h-full object-cover" />
            <button
              onClick={() => handleDownload(result.imageUrl!, result.top.name, result.bottom.name)}
              className="absolute top-2 right-2 bg-indigo-600 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="Download image"
              title="Download image"
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="w-full h-full bg-red-100 flex flex-col items-center justify-center text-center p-2">
            <p className="text-sm font-semibold text-red-700">Generation Failed</p>
            <p className="text-xs text-red-600 mt-1">{result.error}</p>
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
          {modelImageBase64 && <PersonIcon className="w-6 h-6 text-gray-400" title="Model" />}
          <img src={`data:${result.top.mimeType};base64,${result.top.base64}`} alt={result.top.name} className="w-10 h-10 object-cover rounded-md border" />
          <img src={`data:${result.bottom.mimeType};base64,${result.bottom.base64}`} alt={result.bottom.name} className="w-10 h-10 object-cover rounded-md border" />
      </div>
    </div>
  );
};

export const OutfitGallery: React.FC<OutfitGalleryProps> = ({ results, modelImageBase64 }) => {
  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="w-16 h-16 text-gray-300 mb-4">
            <ShirtIcon className="w-8 h-8 inline-block" /><PantsIcon className="w-8 h-8 inline-block" />
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
          return <SkeletonCard key={result.id} result={result} modelImageBase64={modelImageBase64}/>;
        }
        return <ResultCard key={result.id} result={result} modelImageBase64={modelImageBase64} />;
      })}
    </div>
  );
};