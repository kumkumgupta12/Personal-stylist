
import React, { useState, useCallback, useMemo } from 'react';
import { generateClothedModel, addAccessories } from './services/geminiService';
import { WardrobeSection } from './components/WardrobeSection';
import { ImageUploader } from './components/ImageUploader';
import { OutfitGallery } from './components/OutfitGallery';
import { PersonIcon, ShirtIcon, PantsIcon, SparklesIcon, UploadIcon, TrashIcon, DressIcon, ArrowLeftIcon, ShoesIcon, SunglassesIcon, HatIcon, NecklaceIcon } from './components/icons';
import type { ModelImage, ClothingItem, OutfitResult, OutfitType, AccessoryItem, AccessoryResult } from './types';


const App: React.FC = () => {
  // General State
  const [phase, setPhase] = useState<'OUTFIT' | 'ACCESSORY'>('OUTFIT');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progressMessage, setProgressMessage] = useState<string>('');

  // Phase 1: Outfit Generation State
  const [modelImage, setModelImage] = useState<ModelImage | null>(null);
  const [outfitType, setOutfitType] = useState<OutfitType>('TOP_BOTTOM');
  const [topItems, setTopItems] = useState<ClothingItem[]>([]);
  const [bottomItems, setBottomItems] = useState<ClothingItem[]>([]);
  const [dressItems, setDressItems] = useState<ClothingItem[]>([]);
  const [outfitResults, setOutfitResults] = useState<OutfitResult[]>([]);

  // Phase 2: Accessory Styling State
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitResult | null>(null);
  const [shoesItems, setShoesItems] = useState<AccessoryItem[]>([]);
  const [sunglassesItems, setSunglassesItems] = useState<AccessoryItem[]>([]);
  const [hatItems, setHatItems] = useState<AccessoryItem[]>([]);
  const [necklaceItems, setNecklaceItems] = useState<AccessoryItem[]>([]);
  const [accessoryResults, setAccessoryResults] = useState<OutfitResult[]>([]);


  // Generic item add/remove handlers
  const addItem = (setter: React.Dispatch<React.SetStateAction<ClothingItem[]>>) => 
    useCallback((base64: string, mimeType: string, name: string) => {
      setter(prev => [...prev, { id: Date.now().toString(), name, base64, mimeType }]);
    }, [setter]);

  const removeItem = (setter: React.Dispatch<React.SetStateAction<ClothingItem[]>>) =>
    useCallback((id: string) => {
      setter(prev => prev.filter(item => item.id !== id));
    }, [setter]);

  const handleModelUpload = useCallback((base64: string, mimeType: string) => setModelImage({ base64, mimeType }), []);
  
  // Outfit item handlers
  const addTopItem = addItem(setTopItems);
  const removeTopItem = removeItem(setTopItems);
  const addBottomItem = addItem(setBottomItems);
  const removeBottomItem = removeItem(setBottomItems);
  const addDressItem = addItem(setDressItems);
  const removeDressItem = removeItem(setDressItems);
  
  // Accessory item handlers
  const addShoesItem = addItem(setShoesItems);
  const removeShoesItem = removeItem(setShoesItems);
  const addSunglassesItem = addItem(setSunglassesItems);
  const removeSunglassesItem = removeItem(setSunglassesItems);
  const addHatItem = addItem(setHatItems);
  const removeHatItem = removeItem(setHatItems);
  const addNecklaceItem = addItem(setNecklaceItems);
  const removeNecklaceItem = removeItem(setNecklaceItems);

  const canGenerateOutfits = useMemo(() => {
    if (!modelImage) return false;
    if (outfitType === 'TOP_BOTTOM') return topItems.length > 0 && bottomItems.length > 0;
    if (outfitType === 'FULL_BODY') return dressItems.length > 0;
    return false;
  }, [modelImage, outfitType, topItems, bottomItems, dressItems]);

  const handleGenerateOutfits = async () => {
    if (!canGenerateOutfits || !modelImage) {
      alert('Please upload a model image and the required clothing items.');
      return;
    }

    let combinations: ( { top: ClothingItem; bottom: ClothingItem } | { dress: ClothingItem } )[] = [];
    if (outfitType === 'TOP_BOTTOM') {
      topItems.forEach(top => bottomItems.forEach(bottom => combinations.push({ top, bottom })));
    } else {
      dressItems.forEach(dress => combinations.push({ dress }));
    }

    const initialResults: OutfitResult[] = combinations.map((combo, index) => ({
      id: `outfit-${Date.now()}-${index}`,
      ...combo,
      status: 'pending',
    }));

    setOutfitResults(initialResults);
    setIsLoading(true);

    for (let i = 0; i < initialResults.length; i++) {
      const result = initialResults[i];
      setProgressMessage(`Generating outfit ${i + 1} of ${combinations.length}...`);
      setOutfitResults(prev => prev.map(r => r.id === result.id ? { ...r, status: 'generating' } : r));

      try {
        const generatedImageBase64 = await generateClothedModel(modelImage, { top: result.top, bottom: result.bottom, dress: result.dress });
        setOutfitResults(prev => prev.map(r => r.id === result.id ? { ...r, status: 'success', imageUrl: generatedImageBase64 } : r));
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
        setOutfitResults(prev => prev.map(r => r.id === result.id ? { ...r, status: 'error', error: errorMessage } : r));
      }
    }

    setIsLoading(false);
    setProgressMessage('');
  };

  const handleSelectOutfitForStyling = (outfit: OutfitResult) => {
    if (!outfit.imageUrl) return;
    setSelectedOutfit(outfit);
    setPhase('ACCESSORY');
    setAccessoryResults([]); // Clear previous accessory results
  };

  const handleGenerateAccessoryStyles = async () => {
      if (!selectedOutfit?.imageUrl) return;

      const allAccessories = [ ...shoesItems, ...sunglassesItems, ...hatItems, ...necklaceItems ];
      if (allAccessories.length === 0) {
        alert("Please add at least one accessory to generate styles.");
        return;
      }

      // For simplicity, we'll generate one combination with all uploaded accessories.
      // A more complex implementation could create all permutations.
      const combinations = [allAccessories];
       
      const baseImageForStyling: ModelImage = { base64: selectedOutfit.imageUrl, mimeType: 'image/png' };

      const initialResults: OutfitResult[] = combinations.map((combo, index) => ({
          id: `acc-${Date.now()}-${index}`,
          status: 'pending',
          // we can store accessory info here if needed
      }));

      setAccessoryResults(initialResults);
      setIsLoading(true);

      for (let i = 0; i < combinations.length; i++) {
        const combo = combinations[i];
        if (combo.length === 0) continue;

        const resultId = initialResults[i].id;
        setProgressMessage(`Styling with accessories (${i + 1}/${combinations.length})...`);
        setAccessoryResults(prev => prev.map(r => r.id === resultId ? { ...r, status: 'generating' } : r));
        try {
            const generatedImageBase64 = await addAccessories(baseImageForStyling, combo);
            setAccessoryResults(prev => prev.map(r => r.id === resultId ? { ...r, status: 'success', imageUrl: generatedImageBase64 } : r));
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
            setAccessoryResults(prev => prev.map(r => r.id === resultId ? { ...r, status: 'error', error: errorMessage } : r));
        }
      }

      setIsLoading(false);
      setProgressMessage('');
  };
  
  const renderOutfitPhase = () => (
    <>
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

        {/* Outfit Type Section */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">2. Choose Outfit Type</h3>
          <div className="grid grid-cols-2 gap-3">
            {(['TOP_BOTTOM', 'FULL_BODY'] as OutfitType[]).map(type => (
              <label key={type} className={`flex items-center justify-center p-3 border-2 rounded-lg cursor-pointer transition-colors ${outfitType === type ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                <input type="radio" name="outfitType" value={type} checked={outfitType === type} onChange={() => setOutfitType(type)} className="sr-only"/>
                {type === 'TOP_BOTTOM' ? <><ShirtIcon className="w-6 h-6 mr-2"/><PantsIcon className="w-6 h-6 mr-2"/></> : <DressIcon className="w-6 h-6 mr-2"/>}
                <span className="font-medium">{type === 'TOP_BOTTOM' ? 'Top & Bottom' : 'Full Body'}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Wardrobe Sections */}
        {outfitType === 'TOP_BOTTOM' ? (
          <>
            <WardrobeSection title="3. Tops" items={topItems} onAddItem={addTopItem} onRemoveItem={removeTopItem} icon={<ShirtIcon className="w-6 h-6"/>} uploaderIcon={<ShirtIcon className="w-8 h-8"/>}/>
            <WardrobeSection title="4. Bottoms" items={bottomItems} onAddItem={addBottomItem} onRemoveItem={removeBottomItem} icon={<PantsIcon className="w-6 h-6"/>} uploaderIcon={<PantsIcon className="w-8 h-8"/>}/>
          </>
        ) : (
          <WardrobeSection title="3. Full Body Outfits" items={dressItems} onAddItem={addDressItem} onRemoveItem={removeDressItem} icon={<DressIcon className="w-6 h-6"/>} uploaderIcon={<DressIcon className="w-8 h-8"/>}/>
        )}
      </div>

      {/* Right Column: Generation & Results */}
      <div className="xl:col-span-3">
        <div className="sticky top-20">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Generate Outfits</h3>
                <p className="text-sm text-gray-600 mb-4">Once you've added a model and clothing, click the button below to see the magic happen!</p>
                <button onClick={handleGenerateOutfits} disabled={!canGenerateOutfits || isLoading} className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                    {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{progressMessage || 'Generating...'}</>) : (<><SparklesIcon className="w-5 h-5 mr-2"/>Generate</>)}
                </button>
            </div>
            <div className="max-h-[calc(100vh-22rem)] overflow-y-auto pr-2">
                <OutfitGallery results={outfitResults} modelImageBase64={modelImage?.base64} onStyleWithAccessories={handleSelectOutfitForStyling} />
            </div>
        </div>
      </div>
    </>
  );

  const renderAccessoryPhase = () => (
    <>
      {/* Left Column: Accessory Inputs */}
      <div className="xl:col-span-2 flex flex-col gap-6">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
           <button onClick={() => setPhase('OUTFIT')} className="flex items-center text-sm font-semibold text-indigo-600 hover:text-indigo-800 mb-4">
              <ArrowLeftIcon className="w-5 h-5 mr-1"/>
              Back to Outfits
           </button>
           <h3 className="text-lg font-semibold text-gray-800 mb-2">Styling Base</h3>
           <img src={`data:image/png;base64,${selectedOutfit?.imageUrl}`} alt="Selected outfit" className="w-full rounded-lg object-contain max-h-96" />
        </div>
        <WardrobeSection title="Shoes" items={shoesItems} onAddItem={addShoesItem} onRemoveItem={removeShoesItem} icon={<ShoesIcon className="w-6 h-6"/>} uploaderIcon={<ShoesIcon className="w-8 h-8"/>}/>
        <WardrobeSection title="Sunglasses" items={sunglassesItems} onAddItem={addSunglassesItem} onRemoveItem={removeSunglassesItem} icon={<SunglassesIcon className="w-6 h-6"/>} uploaderIcon={<SunglassesIcon className="w-8 h-8"/>}/>
        <WardrobeSection title="Hats" items={hatItems} onAddItem={addHatItem} onRemoveItem={removeHatItem} icon={<HatIcon className="w-6 h-6"/>} uploaderIcon={<HatIcon className="w-8 h-8"/>}/>
        <WardrobeSection title="Necklaces" items={necklaceItems} onAddItem={addNecklaceItem} onRemoveItem={removeNecklaceItem} icon={<NecklaceIcon className="w-6 h-6"/>} uploaderIcon={<NecklaceIcon className="w-8 h-8"/>}/>
      </div>
      
      {/* Right Column: Accessory Generation & Results */}
      <div className="xl:col-span-3">
        <div className="sticky top-20">
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Generate Accessory Styles</h3>
                <p className="text-sm text-gray-600 mb-4">Add some accessories and click the button to generate new styles!</p>
                <button onClick={handleGenerateAccessoryStyles} disabled={isLoading} className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200">
                     {isLoading ? (<><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>{progressMessage || 'Generating...'}</>) : (<><SparklesIcon className="w-5 h-5 mr-2"/>Generate Styles</>)}
                </button>
            </div>
            <div className="max-h-[calc(100vh-18rem)] overflow-y-auto pr-2">
                {/* Re-using OutfitGallery for accessory results. A dedicated component might be better in the future. */}
                <OutfitGallery results={accessoryResults} modelImageBase64={selectedOutfit?.imageUrl} onStyleWithAccessories={() => {}} showStyleButton={false} />
            </div>
        </div>
      </div>
    </>
  );

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
          {phase === 'OUTFIT' ? renderOutfitPhase() : renderAccessoryPhase()}
        </div>
      </main>
    </div>
  );
};

export default App;
