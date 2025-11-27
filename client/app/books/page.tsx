'use client';

import { useState } from 'react';

const availablePdfs = [
  { id: 1, name: 'ACE AP Biology', url: '/pdfs/ACE_AP_Biology.pdf' },
  { id: 2, name: 'ACE AP Calculus AB', url: '/pdfs/ACE_AP_Calculus_AB.pdf' },
  { id: 3, name: 'ACE AP Calculus BC', url: '/pdfs/ACE_AP_Calculus_BC.pdf' },
  { id: 4, name: 'ACE AP Chemistry', url: '/pdfs/ACE_AP_Chemistry.pdf' },
  { id: 5, name: 'ACE AP Computer Science Principles', url: '/pdfs/ACE_AP_CSP.pdf' },
  { id: 6, name: 'ACE AP Physics 1', url: '/pdfs/ACE_AP_Physics_1.pdf' },
  { id: 7, name: 'ACE AP Physics C Mechanics', url: '/pdfs/ACE_AP_Physics_C_Mechanics.pdf' },
  { id: 8, name: 'ACE AP Statistics', url: '/pdfs/ACE_AP_Stats.pdf' },
  { id: 9, name: 'ACE The AMC 10 and 12', url: '/pdfs/ACE_The_AMC_10_and_12.pdf' },
  { id: 10, name: 'AMC 10/12 Key Fundamentals and Strategies', url: '/pdfs/AMC_10_12_Key_Fundamentals_and_Strategies.pdf' },
];

export default function BooksPage() {
  const [selectedPdf, setSelectedPdf] = useState<string>('');

  return (
    <div className="min-h-screen bg-primary pt-28 md:pt-40 pb-24">
      <div className="max-w-7xl mx-auto px-4 space-y-8">
        {/* keep the heading + selector always visible below the fixed navbar */}
        <div className="sticky top-20 z-20 bg-primary/60 backdrop-blur-sm -mx-4 md:mx-0 px-4 py-6 md:rounded-lg md:bg-transparent md:backdrop-blur-0">
          <h1 className="text-4xl font-bold text-white text-center">Browse Books</h1>

          <div className="space-y-6 mt-6 md:mt-8">
          <select
            className="w-full bg-secondary border border-glass-border px-4 py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all cursor-pointer"
            value={selectedPdf}
            onChange={(e) => setSelectedPdf(e.target.value)}
          >
            <option value="">Select a book...</option>
            {availablePdfs.map((pdf) => (
              <option key={pdf.id} value={pdf.url}>
                {pdf.name}
              </option>
            ))}
          </select>

          {selectedPdf ? (
            <iframe
              src={selectedPdf}
              className="w-full h-[70vh] md:h-[700px] border border-glass-border rounded-lg"
              title="PDF Viewer"
            />
          ) : (
            <div className="w-full h-[60vh] md:h-[700px] border border-glass-border rounded-lg flex items-center justify-center bg-secondary/50">
              <p className="text-gray-400 text-lg">Select a book from the dropdown to start reading</p>
            </div>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}
