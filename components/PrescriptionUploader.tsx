import React, { useState, useRef } from 'react';
import { UploadCloud, FileImage, Loader2 } from 'lucide-react';

interface Props {
  onAnalyze: (base64: string, imageSrc: string) => void;
  isAnalyzing: boolean;
  currentImage: string | null;
}

export function PrescriptionUploader({ onAnalyze, isAnalyzing, currentImage }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Image = result.split(',')[1];
        onAnalyze(base64Image, result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      <div 
        onClick={() => !isAnalyzing && fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${isAnalyzing ? 'opacity-50 cursor-not-allowed border-gray-300' : 'border-[var(--color-outline-variant)] hover:border-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)]'}`}
      >
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={isAnalyzing}
        />
        
        {currentImage ? (
          <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden">
            <img src={currentImage} alt="Prescription" className={`w-full h-full object-cover transition-all ${isAnalyzing ? 'opacity-70' : ''}`} />
            {isAnalyzing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="w-10 h-10 text-white animate-spin" />
                  <span className="text-white font-bold">AI is Analyzing...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-[var(--color-outline)]">
            <UploadCloud className="w-12 h-12 mb-2" />
            <p className="font-semibold text-center text-lg">Tap to upload prescription</p>
            <p className="text-sm text-center">PNG, JPG up to 10MB</p>
          </div>
        )}
      </div>
      
      {currentImage && (
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={isAnalyzing}
          className="w-full bg-[var(--color-primary)] text-[var(--color-on-primary)] py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 active:scale-95 disabled:opacity-50 transition-all shadow-md"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <FileImage className="w-5 h-5" />
              Upload Different Image
            </>
          )}
        </button>
      )}
    </div>
  );
}
