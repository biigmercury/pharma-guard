import React from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

interface Props {
  medicationName: string;
  usageInstructions: string;
  isValid: boolean;
}

export function ResultsCard({ medicationName, usageInstructions, isValid }: Props) {
  return (
    <div className="bg-white rounded-xl border border-[var(--color-outline-variant)] p-6 shadow-sm flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <h2 className="text-xl font-bold text-[var(--color-on-surface)]">Digital Record</h2>
        <div className={`px-3 py-1 rounded-full flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider ${isValid ? 'bg-[var(--color-secondary-container)] text-[var(--color-on-secondary-container)]' : 'bg-[var(--color-error-container)] text-[var(--color-on-error-container)]'}`}>
          {isValid ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
          {isValid ? 'Verified' : 'Unverified'}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="p-4 bg-[var(--color-surface-container-low)] rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">Medication Name</p>
          <p className="text-lg font-bold text-[var(--color-on-surface)]">{medicationName}</p>
        </div>
        
        <div className="p-4 bg-[var(--color-surface-container-low)] rounded-lg border border-gray-200">
          <p className="text-xs font-semibold text-[var(--color-on-surface-variant)] uppercase tracking-wider mb-1">Usage Instructions</p>
          <p className="text-md font-medium text-[var(--color-on-surface)] leading-relaxed">{usageInstructions}</p>
        </div>
      </div>
      
    </div>
  );
}
