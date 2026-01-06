
import React from 'react';
import { UploadIcon } from './Icons';

interface ImageUploaderProps {
  id: string;
  label: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, onFileChange, previewUrl }) => {
  return (
    <div className="bg-gray-900 p-4 border-2 border-dashed border-gray-700 rounded-lg text-center transition-all duration-300 hover:border-cyan-400">
      <label htmlFor={id} className="cursor-pointer">
        <div className="w-full h-48 sm:h-64 flex flex-col items-center justify-center">
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-md" />
          ) : (
            <>
              <UploadIcon className="w-12 h-12 text-gray-500 mb-2" />
              <span className="block font-semibold text-cyan-400">{label}</span>
              <span className="block text-xs text-gray-400 mt-1">Click to upload an image</span>
            </>
          )}
        </div>
        <input id={id} type="file" accept="image/*" className="hidden" onChange={onFileChange} />
      </label>
    </div>
  );
};
