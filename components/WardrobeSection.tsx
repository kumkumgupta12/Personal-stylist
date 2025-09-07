
import React from 'react';
import { ImageUploader } from './ImageUploader';
import type { ClothingItem } from '../types';
import { TrashIcon } from './icons';

interface WardrobeSectionProps {
  title: string;
  items: ClothingItem[];
  onAddItem: (base64: string, mimeType: string, name: string) => void;
  onRemoveItem: (id: string) => void;
  icon: React.ReactNode;
  uploaderIcon: React.ReactNode;
}

export const WardrobeSection: React.FC<WardrobeSectionProps> = ({ title, items, onAddItem, onRemoveItem, icon, uploaderIcon }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
      <div className="flex items-center mb-4">
        <div className="text-indigo-600 mr-2">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <ImageUploader onImageUpload={onAddItem} title={`Add a ${title.slice(0, -1)}`} icon={uploaderIcon} />
      {items.length > 0 && (
        <div className="mt-4">
          <div className="flex overflow-x-auto space-x-3 pb-2">
            {items.map((item) => (
              <div key={item.id} className="relative flex-shrink-0 w-24 h-24 group">
                <img
                  src={`data:${item.mimeType};base64,${item.base64}`}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-lg shadow-md border border-gray-200"
                />
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  aria-label={`Remove ${item.name}`}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
