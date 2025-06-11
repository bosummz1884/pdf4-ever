import { AdvancedPDFEditor } from "@/components/AdvancedPDFEditor";

export default function Home() {
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
        <AdvancedPDFEditor className="h-full" />
      </div>
    </div>
  );
}
