'use client';

import { useState } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// Set worker source for react-pdf v10 using CDN
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PdfCoverProps {
  pdfPath: string;
  width?: number;
  height?: number;
  className?: string;
}

export default function PdfCover({ pdfPath, width = 100, height = 130, className = '' }: PdfCoverProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={className}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        overflow: 'hidden',
        borderRadius: '4px',
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}
    >
      {isLoading && !hasError && (
        <div style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.05)'
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: '2px solid rgba(255, 255, 255, 0.1)',
            borderTopColor: 'var(--accent-yellow)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }} />
        </div>
      )}

      {!hasError && (
        <Document
          file={pdfPath}
          loading={null}
          onLoadSuccess={() => setIsLoading(false)}
          onLoadError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
        >
          <Page
            pageNumber={1}
            width={width}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        </Document>
      )}

      <style jsx global>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
