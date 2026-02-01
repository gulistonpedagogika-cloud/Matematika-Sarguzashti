
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#e0f2fe]">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] overflow-hidden border-[12px] border-white ring-1 ring-gray-100">
        <header className="bg-[#FFD93D] p-6 text-center shadow-inner relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-4 -left-4 w-12 h-12 bg-white/20 rounded-full"></div>
          <div className="absolute top-10 -right-4 w-16 h-16 bg-white/20 rounded-full"></div>
          
          <h1 className="text-3xl font-black text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.1)] flex items-center justify-center gap-3 relative z-10">
            <i className="fas fa-brain"></i>
            <span className="tracking-tight uppercase">GDPI</span>
          </h1>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
      <footer className="mt-8 flex flex-col items-center gap-1 opacity-60">
        <div className="text-blue-900 font-black tracking-widest text-xs">QUVNOQ MATEMATIKA</div>
        <div className="text-[10px] text-blue-500 font-medium italic">Gemini AI bilan birgalikda yeching!</div>
      </footer>
    </div>
  );
};
