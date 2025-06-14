import React from "react";
import { Button } from "./ui/button";
import { Download, PenTool, Eraser } from "lucide-react";

interface ExportControlsProps {
  onExport: () => Promise<void>;
  onToggleSignature: () => void;
  onClearAnnotations: () => void;
}

const ExportControls: React.FC<ExportControlsProps> = ({
  onExport,
  onToggleSignature,
  onClearAnnotations,
}) => {
  return (
    <div
      className="flex items-center gap-2 mb-4 p-2 bg-muted/50 rounded-lg border border-border"
      data-oid="69iqpup"
    >
      <Button
        onClick={onExport}
        className="bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
        data-oid="n6gcjrn"
      >
        <Download className="w-4 h-4 mr-2" data-oid="3-i:_jn" />
        Export PDF
      </Button>

      <Button
        onClick={onToggleSignature}
        variant="outline"
        size="sm"
        data-oid="grs3exs"
      >
        <PenTool className="w-4 h-4 mr-2" data-oid="rawhc8z" />
        Signature
      </Button>

      <Button
        onClick={onClearAnnotations}
        variant="outline"
        size="sm"
        data-oid="a-asgas"
      >
        <Eraser className="w-4 h-4 mr-2" data-oid="8u0x-e4" />
        Clear
      </Button>
    </div>
  );
};

export default ExportControls;
