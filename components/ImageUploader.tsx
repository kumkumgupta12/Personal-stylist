
import React, { useRef, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (base64: string, mimeType: string, name: string) => void;
  title: string;
  icon: React.ReactNode;
}

const fileToBase64 = (file: File): Promise<{ base64: string; mimeType: string; name: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        return reject(new Error('FileReader did not return a string.'));
      }
      const base64 = reader.result.split(',')[1];
      resolve({ base64, mimeType: file.type, name: file.name });
    };
    reader.onerror = (error) => reject(error);
  });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, title, icon }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      try {
        const { base64, mimeType, name } = await fileToBase64(files[0]);
        onImageUpload(base64, mimeType, name);
      } catch (error) {
        console.error("Error converting file to base64:", error);
        alert("Sorry, there was an issue uploading your image. Please try another one.");
      }
    }
     // Reset file input to allow uploading the same file again
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onImageUpload]);

  const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files[0] && files[0].type.startsWith('image/')) {
        try {
            const { base64, mimeType, name } = await fileToBase64(files[0]);
            onImageUpload(base64, mimeType, name);
        } catch (error) {
            console.error("Error converting file to base64:", error);
            alert("Sorry, there was an issue uploading your image. Please try another one.");
        }
    }
  }, [onImageUpload]);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onClick={handleClick}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className="relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors duration-200"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      <div className="text-indigo-500 mb-2">{icon}</div>
      <p className="text-sm font-medium text-gray-600">{title}</p>
      <p className="text-xs text-gray-500">or drag and drop</p>
    </div>
  );
};
