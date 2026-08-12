import React, { useState } from 'react';
import { SafeImage } from '../../shared/components/ui/SafeImage';

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, alt }) => {
  const [activeImage, setActiveImage] = useState<string>(images[0] || '');

  return (
    <div className="space-y-4">
      {/* Main Preview */}
      <div className="bg-slate-100 rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-center relative overflow-hidden group min-h-80">
        <SafeImage
          src={activeImage}
          alt={alt}
          className="w-full h-80 sm:h-96 object-contain rounded-2xl group-hover:scale-105 transition-transform duration-300 bg-slate-100"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex items-center space-x-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setActiveImage(img)}
              className={`w-20 h-20 rounded-2xl p-1 bg-white border-2 transition-all cursor-pointer overflow-hidden shrink-0 ${
                activeImage === img ? 'border-blue-600 shadow-md ring-2 ring-blue-600/20' : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <SafeImage src={img} alt={`${alt} thumbnail ${idx}`} className="w-full h-full object-cover rounded-xl" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
