import React, { useState } from "react";
import ComprehensivePDFEditor from "../components/ComprehensivePDFEditor";

function Home() {
  return (
    <div className="h-screen bg-background flex flex-col" data-oid="-7hkfzw">
      {/* Minimal Header */}
      <header
        className="border-b bg-white dark:bg-gray-900 px-4 py-3 flex items-center justify-between shrink-0"
        data-oid="biiyqr7"
      >
        <div
          className="flex items-center space-x-3 h-[104px] w-[160px]"
          data-oid="u9t_0sr"
        >
          <img
            src="/assets/70x70logo.png"
            alt="PDF4EVER Logo"
            className="h-[89px] w-[85px]"
            data-oid="yes-cs9"
          />
        </div>
      </header>

      {/* Full-height PDF Editor */}
      <div
        className="flex-1 bg-[#00000000] bg-cover bg-center bg-no-repeat rounded-none overflow-visible opacity-[100%]"
        data-oid="51wli9."
      >
        <ComprehensivePDFEditor className="h-full" data-oid="aigq0:r" />
      </div>
    </div>
  );
}

export default Home;
