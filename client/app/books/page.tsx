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
  const [selectedPdf, setSelectedPdf] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      <div className="container mx-auto px-4 py-8">
        {/* header + selector — keep this small and sticky under the nav so it remains visible */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm pb-4 mb-4 border-b border-glass-border">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Browse Books
          </h1>
          
          <select
            className="w-full max-w-md px-4 py-2 bg-secondary/50 border border-glass-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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

          {/* show current selection clearly so users know what is chosen */}
          {selectedPdf ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Selected: {availablePdfs.find(p => p.url === selectedPdf)?.name}
            </p>
          ) : null}
        </div>

        {/* spacer to reserve space for the sticky header so it doesn't overlap the viewer */}
        <div className="h-8"></div>

        {/* viewer — outside of the sticky so the header doesn't get pushed around */}
        <div className="w-full">
          {selectedPdf ? (
            <iframe
              src={selectedPdf}
              className="w-full h-[60vh] md:h-[700px] border border-glass-border rounded-lg shadow-lg"
              title="PDF Viewer"
            />
          ) : (
            <div className="w-full h-[60vh] md:h-[700px] border border-glass-border rounded-lg flex items-center justify-center bg-secondary/50">
              <p className="text-gray-400 text-lg">Select a book from the dropdown bar to start reading!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}