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
    <Dialog open={isOpen} onOpenChange={setIsOpen} data-oid="8k.l39h">
      <DialogTrigger asChild data-oid="2u9spa.">
        <Button variant="outline" className="w-full" data-oid="jjslp-i">
          <Pen className="h-4 w-4 mr-2" data-oid="438hcel" />
          Create Signature
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl" data-oid="5ddomrq">
        <DialogHeader data-oid="r37wmou">
          <DialogTitle data-oid=":y67t8j">Create Your Signature</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
          data-oid="p.vq6ps"
        >
          <TabsList className="grid w-full grid-cols-3" data-oid="st1.glg">
            <TabsTrigger
              value="draw"
              className="flex items-center gap-2"
              data-oid="1147x-u"
            >
              <Pen className="h-4 w-4" data-oid="ekoe1me" />
              Draw
            </TabsTrigger>
            <TabsTrigger
              value="type"
              className="flex items-center gap-2"
              data-oid="9my.1l_"
            >
              <Type className="h-4 w-4" data-oid="rmhxwla" />
              Type
            </TabsTrigger>
            <TabsTrigger
              value="upload"
              className="flex items-center gap-2"
              data-oid="teikf:t"
            >
              <Upload className="h-4 w-4" data-oid="qu4hckw" />
              Upload
            </TabsTrigger>
          </TabsList>

          <TabsContent value="draw" className="space-y-4" data-oid="myfur.s">
            <Card data-oid="jndlfb8">
              <CardHeader data-oid="a5hc850">
                <CardTitle className="text-lg" data-oid="9zak8ti">
                  Draw Your Signature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="gox_s89">
                <div className="space-y-2" data-oid="a-0wwdi">
                  <Label data-oid="1mz_q8v">Pen Settings</Label>
                  <div className="grid grid-cols-2 gap-4" data-oid="7wnjz5i">
                    <div className="space-y-2" data-oid="agohbfp">
                      <Label className="text-sm" data-oid="vsnub_-">
                        Stroke Width: {strokeWidth}px
                      </Label>
                      <Slider
                        value={[strokeWidth]}
                        onValueChange={(value) => setStrokeWidth(value[0])}
                        min={1}
                        max={10}
                        step={1}
                        data-oid="je-mgd2"
                      />
                    </div>
                    <div className="space-y-2" data-oid="g_iwtgg">
                      <Label className="text-sm" data-oid="8qbyo1e">
                        Color
                      </Label>
                      <Input
                        type="color"
                        value={signatureColor}
                        onChange={(e) => setSignatureColor(e.target.value)}
                        data-oid="eorqzw7"
                      />
                    </div>
                  </div>
                </div>

                <div
                  className="border rounded-lg p-4 bg-gray-50"
                  data-oid="sd3zmco"
                >
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-300 bg-white cursor-crosshair mx-auto block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    data-oid="x:odwfu"
                  />

                  <p
                    className="text-sm text-gray-600 text-center mt-2"
                    data-oid="axvt6e5"
                  >
                    Click and drag to sign
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="type" className="space-y-4" data-oid="-z3.0en">
            <Card data-oid="r8951j9">
              <CardHeader data-oid="278bmxb">
                <CardTitle className="text-lg" data-oid=":fyx_0v">
                  Type Your Signature
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="69.8t27">
                <div className="space-y-2" data-oid="p:s0zg1">
                  <Label data-oid="7qo9ey3">Signature Text</Label>
                  <Input
                    value={signatureText}
                    onChange={(e) => setSignatureText(e.target.value)}
                    placeholder="Enter your name..."
                    className="text-lg"
                    data-oid="1j9n4x:"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4" data-oid=":78ed14">
                  <div className="space-y-2" data-oid="_a3rauv">
                    <Label data-oid="lz5pgq-">Font</Label>
                    <Select
                      value={fontFamily}
                      onValueChange={setFontFamily}
                      data-oid="gdpygcp"
                    >
                      <SelectTrigger data-oid="v_14.6_">
                        <SelectValue data-oid="c.z9r_j" />
                      </SelectTrigger>
                      <SelectContent data-oid="4d85z09">
                        {fonts.map((font) => (
                          <SelectItem
                            key={font.value}
                            value={font.value}
                            data-oid="r0bvwu_"
                          >
                            <span
                              style={{ fontFamily: font.value }}
                              data-oid="l.i8:ws"
                            >
                              {font.label}
                            </span>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2" data-oid="880mn4g">
                    <Label data-oid="2.sj9yv">Color</Label>
                    <Input
                      type="color"
                      value={signatureColor}
                      onChange={(e) => setSignatureColor(e.target.value)}
                      data-oid="_4k9m86"
                    />
                  </div>
                </div>

                <div className="space-y-2" data-oid="yw4v1:f">
                  <Label data-oid="qugkveh">Font Size: {fontSize}px</Label>
                  <Slider
                    value={[fontSize]}
                    onValueChange={(value) => setFontSize(value[0])}
                    min={16}
                    max={64}
                    step={2}
                    data-oid="5je9zl_"
                  />
                </div>

                <div
                  className="border rounded-lg p-4 bg-gray-50"
                  data-oid="_8cvj:s"
                >
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-300 bg-white mx-auto block"
                    data-oid="9div79o"
                  />

                  <p
                    className="text-sm text-gray-600 text-center mt-2"
                    data-oid="ofb:8iu"
                  >
                    Preview of your typed signature
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="upload" className="space-y-4" data-oid=".:iewic">
            <Card data-oid="_00juk-">
              <CardHeader data-oid="_feytm3">
                <CardTitle className="text-lg" data-oid="fvdj.k9">
                  Upload Signature Image
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4" data-oid="zd:v7vg">
                <div className="space-y-2" data-oid="kefqe.f">
                  <Label data-oid="2ow7ew.">Select Image File</Label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    data-oid="y:mryzd"
                  />

                  <p className="text-xs text-gray-500" data-oid="tcytdux">
                    Supports JPG, PNG, GIF. Recommended: transparent PNG
                  </p>
                </div>

                <div
                  className="border rounded-lg p-4 bg-gray-50"
                  data-oid="2b.2d7t"
                >
                  <canvas
                    ref={canvasRef}
                    className="border border-gray-300 bg-white mx-auto block"
                    data-oid="6webfft"
                  />

                  <p
                    className="text-sm text-gray-600 text-center mt-2"
                    data-oid="2gep9b3"
                  >
                    Upload an image to preview
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-4" data-oid="w8g:3p2">
          <Button variant="outline" onClick={clearCanvas} data-oid="g:aqd08">
            <RotateCcw className="h-4 w-4 mr-2" data-oid="ie79t:u" />
            Clear
          </Button>

          <div className="flex gap-2" data-oid="jypujmy">
            <Button variant="outline" onClick={handleCancel} data-oid="kk61y-1">
              <X className="h-4 w-4 mr-2" data-oid="hkd1e13" />
              Cancel
            </Button>
            <Button onClick={saveSignature} data-oid="9:v1n2j">
              <Check className="h-4 w-4 mr-2" data-oid="zd9kjd3" />
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
    <div className="space-y-2" data-oid="1swmz1y">
      <canvas
        ref={canvasRef}
        className="border border-gray-300 bg-white cursor-crosshair"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        data-oid="gbhx1tz"
      />

      <Button variant="outline" size="sm" onClick={clear} data-oid="o7r5jk:">
        <Trash2 className="h-3 w-3 mr-1" data-oid="qd7ebas" />
        Clear
      </Button>
    </div>
  );
}
