
import React, { useState, useCallback } from 'react';
import { generateOutfit } from './services/geminiService';
import { WardrobeSection } from './components/WardrobeSection';
import { ImageUploader } from './components/ImageUploader';
import { OutfitGallery } from './components/OutfitGallery';
// FIX: Import TrashIcon to resolve reference error.
import { PersonIcon, ShirtIcon, PantsIcon, SparklesIcon, UploadIcon, TrashIcon } from './components/icons';
import type { ModelImage, ClothingItem, OutfitResult } from './types';

const App: React.FC = () => {
  const [modelImage, setModelImage] = useState<ModelImage | null>(null);
  const [topItems, setTopItems] = useState<ClothingItem[]>([]);
  const [bottomItems, setBottomItems] = useState<ClothingItem[]>([]);
  const [outfitResults, setOutfitResults] = useState<OutfitResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>('');

  const handleModelUpload = useCallback((base64: string, mimeType: string) => {
    setModelImage({ base64, mimeType });
  }, []);

  const addTopItem = useCallback((base64: string, mimeType: string, name: string) => {
    setTopItems(prev => [...prev, { id: Date.now().toString(), name, base64, mimeType }]);
  }, []);

  const removeTopItem = useCallback((id: string) => {
    setTopItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const addBottomItem = useCallback((base64: string, mimeType: string, name: string) => {
    setBottomItems(prev => [...prev, { id: Date.now().toString(), name, base64, mimeType }]);
  }, []);

  const removeBottomItem = useCallback((id: string) => {
    setBottomItems(prev => prev.filter(item => item.id !== id));
  }, []);
  
  const canGenerate = modelImage && topItems.length > 0 && bottomItems.length > 0;

  const handleGenerateOutfits = async () => {
    if (!canGenerate) {
      alert('Please upload a model image, at least one top, and at least one bottom to generate outfits.');
      return;
    }

    const combinations: { top: ClothingItem; bottom: ClothingItem }[] = [];
    topItems.forEach(top => {
      bottomItems.forEach(bottom => {
        combinations.push({ top, bottom });
      });
    });

    const initialResults: OutfitResult[] = combinations.map((combo, index) => ({
      id: `${combo.top.id}-${combo.bottom.id}-${index}`,
      top: combo.top,
      bottom: combo.bottom,
      status: 'pending',
    }));

    setOutfitResults(initialResults);
    setIsLoading(true);

    for (let i = 0; i < combinations.length; i++) {
      const combo = combinations[i];
      const resultId = `${combo.top.id}-${combo.bottom.id}-${i}`;
      
      setProgressMessage(`Generating outfit ${i + 1} of ${combinations.length}...`);

      setOutfitResults(prev => prev.map(r => r.id === resultId ? { ...r, status: 'generating' } : r));

      try {
        const generatedImageBase64 = await generateOutfit(modelImage, combo.top, combo.bottom);
        setOutfitResults(prev => prev.map(r => r.id === resultId ? { ...r, status: 'success', imageUrl: generatedImageBase64 } : r));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        console.error(`Failed to generate outfit for combination ${i+1}:`, error);
        setOutfitResults(prev => prev.map(r => r.id === resultId ? { ...r, status: 'error', error: errorMessage } : r));
      }
    }

    setIsLoading(false);
    setProgressMessage('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <SparklesIcon className="w-8 h-8 text-indigo-600 mr-2"/>
            AI Virtual Try-On
          </h1>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          
          {/* Left Column: Inputs */}
          <div className="xl:col-span-2 flex flex-col gap-6">
            {/* Model Section */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center mb-4">
                <PersonIcon className="w-6 h-6 text-indigo-600 mr-2"/>
                <h3 className="text-lg font-semibold text-gray-800">1. Upload Model</h3>
              </div>
              {modelImage ? (
                <div className="relative group">
                   <img src={`data:${modelImage.mimeType};base64,${modelImage.base64}`} alt="Model" className="w-full rounded-lg object-contain max-h-96" />
                   <button onClick={() => setModelImage(null)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">
                     <TrashIcon className="w-5 h-5"/>
                   </button>
                </div>
              ) : (
                <ImageUploader onImageUpload={handleModelUpload} title="Select Model Image" icon={<UploadIcon className="w-8 h-8"/>} />
              )}
            </div>

            {/* Wardrobe Sections */}
            <WardrobeSection
              title="2. Tops"
              items={topItems}
              onAddItem={addTopItem}
              onRemoveItem={removeTopItem}
              icon={<ShirtIcon className="w-6 h-6"/>}
              uploaderIcon={<ShirtIcon className="w-8 h-8"/>}
            />
            <WardrobeSection
              title="3. Bottoms"
              items={bottomItems}
              onAddItem={addBottomItem}
              onRemoveItem={removeBottomItem}
              icon={<PantsIcon className="w-6 h-6"/>}
              uploaderIcon={<PantsIcon className="w-8 h-8"/>}
            />
          </div>

          {/* Right Column: Generation & Results */}
          <div className="xl:col-span-3">
            <div className="sticky top-20">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">4. Generate Outfits</h3>
                    <p className="text-sm text-gray-600 mb-4">Once you've added a model and clothing, click the button below to see the magic happen!</p>
                    <button
                        onClick={handleGenerateOutfits}
                        disabled={!canGenerate || isLoading}
                        className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {progressMessage || 'Generating...'}
                            </>
                        ) : (
                          <>
                            <SparklesIcon className="w-5 h-5 mr-2"/>
                            Generate
                          </>
                        )}
                    </button>
                </div>
                <div className="max-h-[calc(100vh-18rem)] overflow-y-auto pr-2">
                    <OutfitGallery results={outfitResults} modelImageBase64={modelImage?.base64} modelImageMimeType={modelImage?.mimeType} />
                </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
