import React, { useState } from "react";
import Landing from "./landing";
import ComprehensivePDFEditor from "../components/ComprehensivePDFEditor";

function Home() {
  return (
    <div className="h-screen bg-background flex flex-col" data-oid="rcr61:m">
      {/* Minimal Header */}
      <header
        className="border-b bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between shrink-0"
        data-oid="2d..qsm"
      >
        <div className="flex items-center space-x-3" data-oid="jrildmi">
          <img
            src="/assets/70x70logo.png"
            alt="PDF4EVER Logo"
            className="h-8 w-8"
            data-oid="iy30ots"
          />

          <span
            className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-500 bg-clip-text text-transparent"
            data-oid="l7r4o89"
          >
            PDF4EVER
          </span>
        </div>
      </header>

      {/* Full-height PDF Editor */}
      <div className="flex-1 overflow-hidden" data-oid="u:y_tnx">
        <ComprehensivePDFEditor className="h-full" data-oid="jpbhns." />
      </div>
    </div>
  );
}

export default Home;
