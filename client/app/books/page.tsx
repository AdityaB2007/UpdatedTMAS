'use client';

import { useState } from 'react';

const availablePdfs = [
  { id: 1, name: 'ACE AP Calculus AB', url: '/pdfs/ACE_AP_Calculus_AB.pdf' },
  { id: 2, name: 'ACE AP Calculus BC', url: '/pdfs/ACE_AP_Calculus_BC.pdf' },
  { id: 3, name: 'ACE AP Computer Science Principles', url: '/pdfs/ACE_AP_CSP.pdf' },
  { id: 4, name: 'ACE AP Physics 1', url: '/pdfs/ACE_AP_Physics_1.pdf' },
  { id: 5, name: 'ACE AP Physics C Mechanics', url: '/pdfs/ACE_AP_Physics_C_Mechanics.pdf' },
  { id: 6, name: 'ACE AP Statistics', url: '/pdfs/ACE_AP_Stats.pdf' },
  { id: 7, name: 'ACE The AMC 10 and 12', url: '/pdfs/ACE_The_AMC_10_and_12.pdf' },
];

export default function BooksPage() {
  const [selectedPdf, setSelectedPdf] = useState<string>('');

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-5xl mx-auto px-4 space-y-10">
        <header className="space-y-3 text-center">
          <h1 className="text-4xl font-bold text-slate-900">Explore Free Resources</h1>
          <p className="text-slate-600">
            Select one of our curated TMAS study guides to view it directly in your browser.
          </p>
        </header>

        <section className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label htmlFor="pdf-select" className="block text-sm font-medium text-slate-700">
                Choose a PDF
              </label>
              <select
                id="pdf-select"
                className="mt-2 w-full rounded border border-slate-300 bg-white px-4 py-2 text-sm text-slate-800 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                value={selectedPdf}
                onChange={(event) => setSelectedPdf(event.target.value)}
              >
                <option value="">Select a resource…</option>
                {availablePdfs.map((pdf) => (
                  <option key={pdf.id} value={pdf.url}>
                    {pdf.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-900">Resources in This Collection</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {availablePdfs.map((pdf) => (
                  <li key={`${pdf.id}-list`} className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-700">
                    {pdf.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Preview</h2>
            <div className="mt-4">
              {selectedPdf ? (
                <iframe
                  src={selectedPdf}
                  className="w-full h-[800px] border border-slate-300 rounded"
                  title="PDF Viewer"
                />
              ) : (
                <div className="flex h-[800px] w-full items-center justify-center rounded bg-slate-50 text-sm text-slate-500">
                  Select a resource to start reading.
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
