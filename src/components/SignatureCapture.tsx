import { useState, useRef, useEffect } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import "pdfjs-dist/web/pdf_viewer.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import {
  Pen,
  Type,
  Upload,
  Trash2,
  RotateCcw,
  Check,
  X,
  Download,
} from "lucide-react";

interface SignatureCaptureProps {
  onSignatureComplete: (signatureData: string) => void;
  onCancel?: () => void;
}

export function SignatureCapture({
  onSignatureComplete,
  onCancel,
}: SignatureCaptureProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("draw");
  const [isDrawing, setIsDrawing] = useState(false);
  const [signatureText, setSignatureText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [fontFamily, setFontFamily] = useState("cursive");
  const [strokeWidth, setStrokeWidth] = useState(3);
  const [signatureColor, setSignatureColor] = useState("#000080");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fonts = [
    { value: "cursive", label: "Cursive" },
    { value: "serif", label: "Serif" },
    { value: "sans-serif", label: "Sans Serif" },
    { value: "monospace", label: "Monospace" },
    { value: "'Dancing Script', cursive", label: "Dancing Script" },
    { value: "'Pacifico', cursive", label: "Pacifico" },
    { value: "'Great Vibes', cursive", label: "Great Vibes" },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 200;

    // Clear canvas with white background
    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#e5e7eb";
      context.setLineDash([5, 5]);
      context.strokeRect(0, 0, canvas.width, canvas.height);
      context.setLineDash([]);
    }
  }, [isOpen]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(event);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.lineWidth = strokeWidth;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = signatureColor;

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (context) {
      context.beginPath();
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#e5e7eb";
    context.setLineDash([5, 5]);
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.setLineDash([]);
  };

  const generateTextSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !signatureText.trim()) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    // Clear canvas
    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Draw text signature
    context.font = `${fontSize}px ${fontFamily}`;
    context.fillStyle = signatureColor;
    context.textAlign = "center";
    context.textBaseline = "middle";

    // Calculate text position
    const x = canvas.width / 2;
    const y = canvas.height / 2;

    context.fillText(signatureText, x, y);

    // Add border
    context.strokeStyle = "#e5e7eb";
    context.lineWidth = 1;
    context.setLineDash([5, 5]);
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.setLineDash([]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        // Clear canvas
        context.fillStyle = "white";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate scaling to fit image in canvas
        const scale = Math.min(
          canvas.width / img.width,
          canvas.height / img.height,
        );

        const scaledWidth = img.width * scale;
        const scaledHeight = img.height * scale;
        const x = (canvas.width - scaledWidth) / 2;
        const y = (canvas.height - scaledHeight) / 2;

        context.drawImage(img, x, y, scaledWidth, scaledHeight);

        // Add border
        context.strokeStyle = "#e5e7eb";
        context.lineWidth = 1;
        context.setLineDash([5, 5]);
        context.strokeRect(0, 0, canvas.width, canvas.height);
        context.setLineDash([]);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Check if canvas is empty (just white background)
    const context = canvas.getContext("2d");
    if (!context) return;

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let hasContent = false;

    // Check if there are any non-white pixels (excluding the border)
    for (let i = 0; i < pixels.length; i += 4) {
      const r = pixels[i];
      const g = pixels[i + 1];
      const b = pixels[i + 2];

      // If pixel is not white or very light gray (border)
      if (r < 240 || g < 240 || b < 240) {
        hasContent = true;
        break;
      }
    }

    if (!hasContent) {
      alert("Please create a signature before saving.");
      return;
    }

    const signatureDataUrl = canvas.toDataURL("image/png");
    onSignatureComplete(signatureDataUrl);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
    onCancel?.();
  };

  // Update text signature when parameters change
  useEffect(() => {
    if (activeTab === "type" && signatureText.trim()) {
      generateTextSignature();
    }
  }, [signatureText, fontSize, fontFamily, signatureColor, activeTab]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen} data-oid="7q40pgc">
      <DialogTrigger asChild data-oid="8x8kaln">
        <Button variant="outline" className="w-full" data-oid="yjlbyhd">
          <Pen className="h-4 w-4 mr-2" data-oid=":84h-bu" />
          Create Signature
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl" data-oid="4o_gdv0">
        <DialogHeader data-oid="s5yr8mo">
          <DialogTitle data-oid="x6zy8-4">Create Your Signature</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
          data-oid="j3y1f9m"
        >
          <TabsList className="grid w-full grid-cols-3" data-oid="4.xfbfu">
            <TabsTrigger
              value="draw"
              className="flex items-center gap-2"
              data-oid="6dp_cus"
            >
              <Pen className="h-4 w-4" data-oid="z8ux1vd" />
              Draw
            </TabsTrigger>
            <TabsTrigger
              value="type"
              className="flex items-center gap-2"
              data-oid="9_2s15s"
            >
              <Type className="h-4 w-4" data-oid="m:unxt0" />
              Type
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="flex items-center gap-2"
              data-oid="w9igp74"
            >
              <Upload className="h-4 w-4" data-oid="zcv8fxo" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4" data-oid="8wbs26p">
            <Card data-oid="d.u64ot">
              <CardHeader data-oid="-t914lf">
                <CardTitle className="text-lg" data-oid="n-_b587">
                  Draw Your Signature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="d9mx8di">
                <div className="space-y-2" data-oid="5q:jgnw">
                  <Label data-oid=".ypfr_6">Pen Settings</Label>
                  <div className="grid grid-cols-2 gap-4" data-oid="13is:2f">
                    <div className="space-y-2" data-oid="nsdmv85">
                      <Label className="text-sm" data-oid="c8n:qw4">
                        Stroke Width: {strokeWidth}px
                      </Label>
                      <Slider
                        value={[strokeWidth]}
                        onValueChange={(value) => setStrokeWidth(value[0])}
                        min={1}
                        max={10}
                        step={1}
                        data-oid="jl.es71"
                      />
                    </div>
                    <div className="space-y-2" data-oid="resjx43">
                      <Label className="text-sm" data-oid="1b:hak.">
                        Color
                      </Label>
                      <Input
                        type="color"
                        value={signatureColor}
                        onChange={(e) => setSignatureColor(e.target.value)}
                        data-oid="f70q3w:"
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="border rounded-lg p-4 bg-gray-50"
                  data-oid="6n343bv"
                >
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-300 bg-white cursor-crosshair mx-auto block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    data-oid="wy9f.6w"
                  />

                  <p
                    className="text-sm text-gray-600 text-center mt-2"
                    data-oid="uv7qovb"
                  >
                    Click and drag to sign
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="type" className="space-y-4" data-oid="ay_l::p">
            <Card data-oid="srjgsw.">
              <CardHeader data-oid="7b7_geo">
                <CardTitle className="text-lg" data-oid="n10m35f">
                  Type Your Signature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="du8v.sh">
                <div className="space-y-2" data-oid="8fgm-07">
                  <Label data-oid="l18_a-3">Signature Text</Label>
                  <Input
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Enter your name..."
                    className="text-lg"
                    data-oid="dw:9qm2"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4" data-oid="fs-lv5z">
                  <div className="space-y-2" data-oid="7ppmj-e">
                    <Label data-oid="odr8:tg">Font</Label>
                    <Select
                      value={fontFamily}
                      onValueChange={setFontFamily}
                      data-oid="0y8wlku"
                    >
                      <SelectTrigger data-oid="vbxmart">
                        <SelectValue data-oid="62aswt:" />
                      </SelectTrigger>
                      <SelectContent data-oid="13.qb85">
                        {fonts.map((font) => (
                          <SelectItem
                            key={font.value}
                            value={font.value}
                            data-oid="38lc5bb"
                          >
                            <span
                              style={{ fontFamily: font.value }}
                              data-oid="ia.on51"
                            >
                              {font.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2" data-oid=":5m.yck">
                    <Label data-oid="s.._8:6">Color</Label>
                    <Input
                      type="color"
                      value={signatureColor}
                      onChange={(e) => setSignatureColor(e.target.value)}
                      data-oid="vnp-ynu"
                    />
                  </div>
                </div>

                <div className="space-y-2" data-oid="wqx:rr_">
                  <Label data-oid="j_9-855">Font Size: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={16}
                    max={64}
                    step={2}
                    data-oid="g3j7y.e"
                  />
                </div>

                <div
                  className="border rounded-lg p-4 bg-gray-50"
                  data-oid="9ays6gg"
                >
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-300 bg-white mx-auto block"
                    data-oid="awor3sc"
                  />

                  <p
                    className="text-sm text-gray-600 text-center mt-2"
                    data-oid="1po_d.h"
                  >
                    Preview of your typed signature
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4" data-oid="vi-qmsy">
            <Card data-oid="zcfe3:_">
              <CardHeader data-oid="kp9rxgd">
                <CardTitle className="text-lg" data-oid="t40c0c1">
                  Upload Signature Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="ykquq.x">
                <div className="space-y-2" data-oid="nwtpusd">
                  <Label data-oid="tpn_oa:">Select Image File</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    data-oid="y2glo0w"
                  />

                  <p className="text-xs text-gray-500" data-oid="wivjkl6">
                    Supports JPG, PNG, GIF. Recommended: transparent PNG
                  </p>
                </div>

                <div
                  className="border rounded-lg p-4 bg-gray-50"
                  data-oid="1jvanrx"
                >
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-300 bg-white mx-auto block"
                    data-oid="dix54yj"
                  />

                  <p
                    className="text-sm text-gray-600 text-center mt-2"
                    data-oid="exg-w2r"
                  >
                    Upload an image to preview
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4" data-oid="d040hql">
          <Button variant="outline" onClick={clearCanvas} data-oid="wa3.5:t">
            <RotateCcw className="h-4 w-4 mr-2" data-oid="rygb53h" />
            Clear
          </Button>

          <div className="flex gap-2" data-oid="4ofl9x-">
            <Button variant="outline" onClick={handleCancel} data-oid="38thdhm">
              <X className="h-4 w-4 mr-2" data-oid="rk470up" />
              Cancel
            </Button>
            <Button onClick={saveSignature} data-oid="yugz4-l">
              <Check className="h-4 w-4 mr-2" data-oid="awqpkb2" />
              Use Signature
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Standalone signature pad component for inline use
export function InlineSignaturePad({
  onSignatureChange,
  width = 300,
  height = 150,
}: {
  onSignatureChange: (dataUrl: string | null) => void;
  width?: number;
  height?: number;
}) {
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");
    if (context) {
      context.fillStyle = "white";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "#e5e7eb";
      context.setLineDash([5, 5]);
      context.strokeRect(0, 0, canvas.width, canvas.height);
      context.setLineDash([]);
    }
  }, [width, height]);

  const startDrawing = (event: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(event);
  };

  const draw = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    context.lineWidth = 2;
    context.lineCap = "round";
    context.lineJoin = "round";
    context.strokeStyle = "#000080";

    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (context) {
      context.beginPath();
      onSignatureChange(canvas.toDataURL("image/png"));
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.fillStyle = "white";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.strokeStyle = "#e5e7eb";
    context.setLineDash([5, 5]);
    context.strokeRect(0, 0, canvas.width, canvas.height);
    context.setLineDash([]);

    onSignatureChange(null);
  };

  return (
    <div className="space-y-2" data-oid="ptbuo5p">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        data-oid="0jptxag"
      />

      <Button variant="outline" size="sm" onClick={clear} data-oid=":ojdql3">
        <Trash2 className="h-3 w-3 mr-1" data-oid="p.3n81m" />
        Clear
      </Button>
    </div>
  );
}
