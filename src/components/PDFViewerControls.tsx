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
      data-oid="tov4rzy"
    >
      <div className="flex items-center gap-2" data-oid="mpvlzcy">
        <Button
          onClick={onPrev}
          disabled={currentPage <= 1}
          variant="outline"
          size="sm"
          data-oid="-6f.rxr"
        >
          <ChevronLeft className="w-4 h-4" data-oid="uhqxq-9" />
        </Button>

        <span
          className="text-sm font-medium text-foreground min-w-[80px] text-center"
          data-oid="8qe4.ia"
        >
          {currentPage} / {totalPages}
        </span>

        <Button
          onClick={onNext}
          disabled={currentPage >= totalPages}
          variant="outline"
          size="sm"
          data-oid="bcu:f82"
        >
          <ChevronRight className="w-4 h-4" data-oid="ibvlgtj" />
        </Button>
      </div>

      <div className="flex items-center gap-2" data-oid="bp_1lnu">
        <Button
          onClick={onZoomOut}
          disabled={zoomLevel <= 0.5}
          variant="outline"
          size="sm"
          data-oid="rteo2l9"
        >
          <ZoomOut className="w-4 h-4" data-oid="jclf2w2" />
        </Button>

        <span
          className="text-sm font-medium text-foreground min-w-[60px] text-center"
          data-oid="p8v1m34"
        >
          {Math.round(zoomLevel * 100)}%
        </span>

        <Button
          onClick={onZoomIn}
          disabled={zoomLevel >= 3}
          variant="outline"
          size="sm"
          data-oid="vsr2okd"
        >
          <ZoomIn className="w-4 h-4" data-oid="3-vdou-" />
        </Button>
      </div>
    </div>
  );
};

export default PDFViewerControls;
