// Make sure the file exists at the specified path, or update the path if necessary.
import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.min.js?url';

// Set the static worker URL for Cloudflare Pages compatibility
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;
import React, { useState } from 'react';
import ComprehensivePDFEditor from "../components/ComprehensivePDFEditor";

function Home() {
  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Minimal Header */}
      <header className="border-b bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between shrink-0">
        <div className="flex items-center space-x-3">
          <img 
            src="/assets/70x70logo.png" 
            alt="PDF4EVER Logo" 
            className="h-8 w-8"
          />
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent">
            PDF4EVER
          </span>
        </div>
      </header>

      {/* Full-height PDF Editor */}
      <div className="flex-1 overflow-hidden">
        <ComprehensivePDFEditor className="h-full" />
      </div>
    </div>
  );
}

export default Home;
