import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  safetyFlag: string;
}

export function SafetyAlert({ safetyFlag }: Props) {
  return (
    <div className="bg-[var(--color-error-container)] border-2 border-[var(--color-error)] rounded-xl p-5 shadow-md relative overflow-hidden">
      <div className="flex items-start gap-4 relative z-10">
        <div className="bg-[var(--color-error)] text-[var(--color-on-error)] p-2 rounded-lg shrink-0 mt-1">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-[var(--color-error)] mb-1 uppercase tracking-wider">Critical Warning</h3>
          <p className="text-base font-bold text-[var(--color-error)] leading-relaxed">{safetyFlag}</p>
        </div>
      </div>
    </div>
  );
}
