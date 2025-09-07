
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

export interface OutfitResult {
  id: string;
  top: ClothingItem;
  bottom: ClothingItem;
  status: 'pending' | 'generating' | 'success' | 'error';
  imageUrl?: string;
  error?: string;
}
