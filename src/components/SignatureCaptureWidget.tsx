import React, { useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import "pdfjs-dist/web/pdf_viewer.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
import { Button } from "./ui/button";
import { X, Check, RotateCcw } from "lucide-react";

interface SignatureCaptureWidgetProps {
  onSigned: (data: string) => void;
  onClose: () => void;
}

const SignatureCaptureWidget: React.FC<SignatureCaptureWidgetProps> = ({
  onSigned,
  onClose,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    ctx.beginPath();
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataURL = canvas.toDataURL();
    onSigned(dataURL);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      data-oid="q7.y-41"
    >
      <div
        className="bg-white dark:bg-card p-6 rounded-lg shadow-xl border border-border max-w-md w-full mx-4"
        data-oid="y33ru0e"
      >
        <div
          className="flex justify-between items-center mb-4"
          data-oid="rf98458"
        >
          <h3
            className="text-lg font-semibold text-foreground"
            data-oid="7sym_49"
          >
            Add Signature
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            data-oid="iuzeo.-"
          >
            <X className="w-4 h-4" data-oid="lx-310e" />
          </Button>
        </div>

        <div className="border border-border rounded mb-4" data-oid=":kd8wrq">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full h-48 bg-white rounded cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            data-oid="ra3pk7."
          />
        </div>

        <div className="flex gap-2 justify-end" data-oid="ogi6mv:">
          <Button
            onClick={clearSignature}
            variant="outline"
            size="sm"
            data-oid="7wkz:_1"
          >
            <RotateCcw className="w-4 h-4 mr-2" data-oid="g480au7" />
            Clear
          </Button>
          <Button onClick={saveSignature} size="sm" data-oid="aa:7lb6">
            <Check className="w-4 h-4 mr-2" data-oid="fs7d_an" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignatureCaptureWidget;
