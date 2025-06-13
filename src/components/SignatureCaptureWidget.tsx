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
      data-oid="hdp-8r9"
    >
      <div
        className="bg-white dark:bg-card p-6 rounded-lg shadow-xl border border-border max-w-md w-full mx-4"
        data-oid="knbt5.b"
      >
        <div
          className="flex justify-between items-center mb-4"
          data-oid="y.mq46e"
        >
          <h3
            className="text-lg font-semibold text-foreground"
            data-oid="oqrhtcp"
          >
            Add Signature
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            data-oid="y0ebarz"
          >
            <X className="w-4 h-4" data-oid="fmca79j" />
          </Button>
        </div>

        <div className="border border-border rounded mb-4" data-oid=".pk9:gl">
          <canvas
            ref={canvasRef}
            width={400}
            height={200}
            className="w-full h-48 bg-white rounded cursor-crosshair"
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            data-oid="dwt7wq4"
          />
        </div>

        <div className="flex gap-2 justify-end" data-oid="g.y.xrg">
          <Button
            onClick={clearSignature}
            variant="outline"
            size="sm"
            data-oid="0dni9o3"
          >
            <RotateCcw className="w-4 h-4 mr-2" data-oid="9zmdk4a" />
            Clear
          </Button>
          <Button onClick={saveSignature} size="sm" data-oid="ts7c7cr">
            <Check className="w-4 h-4 mr-2" data-oid="_3xxv2v" />
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignatureCaptureWidget;
