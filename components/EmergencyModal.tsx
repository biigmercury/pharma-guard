import React, { useState } from 'react';
import { Phone, X } from 'lucide-react';

export function EmergencyModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleDial = (e: React.MouseEvent<HTMLAnchorElement>, number: string) => {
    // If on desktop (no touch support), simulate action
    if (typeof window !== 'undefined' && !('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
      e.preventDefault();
      setToastMessage(`Dialing ${number}...`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="border border-white/40 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-semibold active:scale-95 duration-200 transition-colors"
      >
        Emergency Help
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Bold Red Header */}
            <div className="bg-[var(--color-error)] text-white p-5 flex justify-between items-center">
              <h2 className="text-xl font-bold uppercase tracking-wider">Local Emergency Contacts</h2>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white active:scale-90 p-1 bg-white/10 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            {/* Modal Background White */}
            <div className="p-5 flex flex-col gap-4 bg-white">
              {/* Primary Action */}
              <a 
                href="tel:112"
                onClick={(e) => handleDial(e, '112')}
                className="bg-[var(--color-error)] text-white p-5 rounded-xl font-bold text-center text-lg flex items-center justify-center gap-3 active:scale-95 transition-transform shadow-lg"
              >
                <Phone className="w-6 h-6" />
                Call National Emergency (112)
              </a>

              <div className="h-px bg-gray-200 w-full my-2"></div>

              {/* Local Options */}
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-[-8px]">Local Options</h3>
              
              <a 
                href="tel:08027545798"
                onClick={(e) => handleDial(e, '08027545798')}
                className="bg-gray-50 border-2 border-gray-100 text-gray-800 p-4 rounded-xl font-bold flex items-center justify-between active:scale-95 transition-transform"
              >
                <span className="leading-tight">University Health Service (UI)</span>
                <div className="bg-gray-200 p-2 rounded-full text-gray-700">
                  <Phone className="w-5 h-5" />
                </div>
              </a>

              <a 
                href="tel:08000432584"
                onClick={(e) => handleDial(e, '08000432584')}
                className="bg-gray-50 border-2 border-gray-100 text-gray-800 p-4 rounded-xl font-bold flex items-center justify-between active:scale-95 transition-transform"
              >
                <span className="leading-tight">Telemedicine Support</span>
                <div className="bg-gray-200 p-2 rounded-full text-gray-700">
                  <Phone className="w-5 h-5" />
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mock Interaction Toast */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full font-bold shadow-2xl z-[110] animate-in slide-in-from-bottom-5">
          {toastMessage}
        </div>
      )}
    </>
  );
}
