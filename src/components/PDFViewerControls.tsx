import React from "react";
import { Button } from "./ui/button";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import "pdfjs-dist/web/pdf_viewer.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

interface PDFViewerControlsProps {
  currentPage: number;
  totalPages: number;
  zoomLevel: number;
  onPrev: () => void;
  onNext: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
}

const PDFViewerControls: React.FC<PDFViewerControlsProps> = ({
  currentPage,
  totalPages,
  zoomLevel,
  onPrev,
  onNext,
  onZoomIn,
  onZoomOut,
}) => {
  return (
    <div
      className="flex items-center justify-between gap-4 mb-4 p-2 bg-muted/50 rounded-lg border border-border"
      data-oid="d2j4u_h"
    >
      <div className="flex items-center gap-2" data-oid="7h_vgi8">
        <Button
          onClick={onPrev}
          disabled={currentPage <= 1}
          variant="outline"
          size="sm"
          data-oid="6u_5yf:"
        >
          <ChevronLeft className="w-4 h-4" data-oid="2b55629" />
        </Button>

        <span
          className="text-sm font-medium text-foreground min-w-[80px] text-center"
          data-oid="brlwen6"
        >
          {currentPage} / {totalPages}
        </span>

        <Button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          variant="outline"
          size="sm"
          data-oid="yfwa3:5"
        >
          <ChevronRight className="w-4 h-4" data-oid="fwn.2si" />
        </Button>
      </div>

      <div className="flex items-center gap-2" data-oid="sa.a855">
        <Button
          onClick={onZoomOut}
          disabled={zoomLevel <= 0.5}
          variant="outline"
          size="sm"
          data-oid="5m-u:_4"
        >
          <ZoomOut className="w-4 h-4" data-oid="7uter0_" />
        </Button>

        <span
          className="text-sm font-medium text-foreground min-w-[60px] text-center"
          data-oid="l4_pjbi"
        >
          {Math.round(zoomLevel * 100)}%
        </span>

        <Button
          onClick={onZoomIn}
          disabled={zoomLevel >= 3}
          variant="outline"
          size="sm"
          data-oid="51t2pe5"
        >
          <ZoomIn className="w-4 h-4" data-oid="nx8i9u." />
        </Button>
      </div>
    </div>
  );
};

export default PDFViewerControls;
