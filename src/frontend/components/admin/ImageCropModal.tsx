"use client";

import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { X, Check } from 'lucide-react';

interface ImageCropModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  onCropComplete: (croppedBlob: Blob) => void;
}

export default function ImageCropModal({ isOpen, onClose, imageSrc, onCropComplete }: ImageCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const imgRef = useRef<HTMLImageElement>(null);

  if (!isOpen) return null;

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    
    // Initial crop: center it and cover 90% of the image
    const initialCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        undefined, // No fixed aspect ratio as requested
        width,
        height
      ),
      width,
      height
    );
    setCrop(initialCrop);
  }

  async function getCroppedImg() {
    const activeCrop = completedCrop || crop;
    if (!activeCrop || !imgRef.current) return;

    const canvas = document.createElement('canvas');
    const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
    const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
    
    canvas.width = activeCrop.width * scaleX;
    canvas.height = activeCrop.height * scaleY;
    
    const ctx = canvas.getContext('2d');

    if (!ctx) return;

    ctx.drawImage(
      imgRef.current,
      activeCrop.x * scaleX,
      activeCrop.y * scaleY,
      activeCrop.width * scaleX,
      activeCrop.height * scaleY,
      0,
      0,
      canvas.width,
      canvas.height
    );

    canvas.toBlob((blob) => {
      if (blob) {
        onCropComplete(blob);
      }
    }, 'image/png', 1);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-white rounded-[2rem] w-full max-w-4xl max-h-[95vh] flex flex-col overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="text-xl font-bold text-[#1D2939]">Crop Hero Image</h3>
            <p className="text-sm text-gray-500">Adjust the selection freely to match your vision.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-8 flex items-center justify-center bg-neutral-900/5">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            className="max-h-full"
          >
            <img 
              ref={imgRef}
              src={imageSrc} 
              onLoad={onImageLoad}
              alt="Crop me" 
              className="max-w-full max-h-[60vh] object-contain shadow-lg"
            />
          </ReactCrop>
        </div>

        {/* Footer */}
        <div className="p-6 border-t bg-gray-50/50 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={getCroppedImg}
            className="px-8 py-3 bg-[#FD853A] text-white rounded-xl font-bold hover:bg-[#e67a2e] transition-all flex items-center gap-2 shadow-lg shadow-orange-500/20"
          >
            <Check size={18} />
            Apply Crop & Upload
          </button>
        </div>
      </div>
    </div>
  );
}
