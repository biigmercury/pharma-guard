"use client";

import React, { useState } from 'react';
import { PrescriptionUploader } from '@/components/PrescriptionUploader';
import { ResultsCard } from '@/components/ResultsCard';
import { SafetyAlert } from '@/components/SafetyAlert';
import { EmergencyModal } from '@/components/EmergencyModal';
import { FileText, UserCheck, Bot } from 'lucide-react';

export default function Home() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<{
    medication_name: string;
    usage_instructions: string;
    safety_flag: string;
    is_valid: boolean;
  } | null>(null);

  const handleAnalyze = async (base64: string, fullImageSrc: string) => {
    setImageSrc(fullImageSrc);
    setIsAnalyzing(true);
    setResults(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        alert("Error: " + (data.error || "Failed to analyze the image."));
        return;
      }
      
      setResults(data);
    } catch (error) {
      console.error(error);
      alert('Failed to analyze the image.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fc] flex items-center justify-center p-4 md:p-8 font-sans">
      {/* Background subtle grid pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      <div className="bg-white rounded-[1.25rem] shadow-[0_8px_40px_rgb(0,0,0,0.06)] w-full max-w-5xl overflow-hidden flex flex-col border border-gray-100 relative z-10">
        
        {/* Header */}
        <header className="bg-[#1e6edb] text-white px-6 md:px-8 py-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white text-[#1e6edb] p-1 rounded-md shadow-sm">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2v20" />
                <path d="M2 12h20" />
                <path d="M12 2a5 5 0 0 1 5 5v2.5a2.5 2.5 0 0 1-5 0V7a2 2 0 0 0-4 0v5.5a5 5 0 0 0 10 0V11" strokeWidth="1.5" />
              </svg>
            </div>
            <div className="text-xl font-bold leading-tight tracking-tight">PharmaGuard<br/>Ibadan</div>
          </div>
          <EmergencyModal />
        </header>

        {/* Content */}
        <div className="p-6 md:p-10 flex flex-col gap-8 md:gap-10">
          <div>
            <h1 className="text-3xl md:text-[2.5rem] font-extrabold text-gray-900 mb-2 tracking-tight">Prescription Analysis</h1>
            <p className="text-lg text-gray-500 font-medium">AI-verified clinical results for your uploaded documentation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="md:col-span-2 flex flex-col gap-6">
              <PrescriptionUploader 
                onAnalyze={handleAnalyze} 
                isAnalyzing={isAnalyzing} 
                currentImage={imageSrc} 
              />

              {results && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <ResultsCard 
                    medicationName={results.medication_name}
                    usageInstructions={results.usage_instructions}
                    isValid={results.is_valid}
                  />
                  {results.safety_flag && (
                    <SafetyAlert safetyFlag={results.safety_flag} />
                  )}
                </div>
              )}
            </div>
            
            <div className="md:col-span-1 flex flex-col gap-6 pt-2">
              <h3 className="text-xl font-bold text-gray-900">How it works</h3>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="bg-[#f0f3f9] p-3 rounded-2xl shadow-sm">
                    <FileText className="w-6 h-6 text-[#4a5568]" />
                  </div>
                  <span className="font-semibold text-[#2d3748] text-sm md:text-base">1. Upload Prescription</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#f0f3f9] p-3 rounded-2xl shadow-sm">
                    <Bot className="w-6 h-6 text-[#4a5568]" />
                  </div>
                  <span className="font-semibold text-[#2d3748] text-sm md:text-base">2. AI Scan & Analysis</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="bg-[#f0f3f9] p-3 rounded-2xl shadow-sm">
                    <UserCheck className="w-6 h-6 text-[#4a5568]" />
                  </div>
                  <span className="font-semibold text-[#2d3748] text-sm md:text-base">3. Pharmacist Review</span>
                </div>
              </div>
            </div>
          </div>

          {/* Red Footer Banner */}
          <div className="bg-[#c21818] text-white text-center py-4 rounded-xl font-bold text-xs md:text-sm tracking-wider uppercase mt-4 shadow-sm">
            AI-generated insight. Consult a licensed pharmacist before use.
          </div>
        </div>
      </div>
    </div>
  );
}
