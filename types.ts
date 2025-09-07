
export type OutfitType = 'TOP_BOTTOM' | 'FULL_BODY';

export interface ModelImage {
  base64: string;
  mimeType: string;
}

export interface ClothingItem {
  id: string;
  name: string;
  base64: string;
  mimeType: string;
}

export type AccessoryItem = ClothingItem;

export interface OutfitResult {
  id: string;
  top?: ClothingItem;
  bottom?: ClothingItem;
  dress?: ClothingItem;
  status: 'pending' | 'generating' | 'success' | 'error';
  imageUrl?: string;
  error?: string;
}

export interface AccessoryResult {
    id: string;
    baseOutfitUrl: string;
    accessories: AccessoryItem[];
    status: 'pending' | 'generating' | 'success' | 'error';
    imageUrl?: string;
    error?: string;
}
