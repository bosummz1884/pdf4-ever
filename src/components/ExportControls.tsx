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
      data-oid="pt6ghh4"
    >
      <Button
        onClick={onExport}
        className="bg-gradient-to-r from-primary via-secondary to-accent text-white hover:shadow-lg hover:shadow-primary/25 transition-all duration-300"
        data-oid="y-rh:a."
      >
        <Download className="w-4 h-4 mr-2" data-oid="5.h9vdc" />
        Export PDF
      </Button>

      <Button
        onClick={onToggleSignature}
        variant="outline"
        size="sm"
        data-oid=".gundyz"
      >
        <PenTool className="w-4 h-4 mr-2" data-oid="jk59vk2" />
        Signature
      </Button>

      <Button
        onClick={onClearAnnotations}
        variant="outline"
        size="sm"
        data-oid="-q_irfy"
      >
        <Eraser className="w-4 h-4 mr-2" data-oid="kyhf6t1" />
        Clear
      </Button>
    </div>
  );
};

export default ExportControls;
