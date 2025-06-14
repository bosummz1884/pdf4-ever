import React, { useState, useRef } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import "pdfjs-dist/web/pdf_viewer.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import {
  X,
  Palette,
  Type,
  Square,
  Circle,
  Minus,
  PenTool,
  Highlighter,
  Eraser,
  Download,
} from "lucide-react";

interface AdvancedAnnotationToolProps {
  onClose: () => void;
  onAnnotationApply: (annotation: AnnotationType) => void;
  canvas?: HTMLCanvasElement;
}

interface AnnotationType {
  type: "text" | "highlight" | "rectangle" | "circle" | "line" | "freehand";
  text?: string;
  color: string;
  strokeWidth: number;
  fontSize?: number;
  position?: { x: number; y: number };
  dimensions?: { width: number; height: number };
}

const AdvancedAnnotationTool: React.FC<AdvancedAnnotationToolProps> = ({
  onClose,
  onAnnotationApply,
  canvas,
}) => {
  const [selectedTool, setSelectedTool] =
    useState<AnnotationType["type"]>("text");
  const [color, setColor] = useState("#ff0000");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [fontSize, setFontSize] = useState(16);
  const [text, setText] = useState("");
  const [isDrawing, setIsDrawing] = useState(false);
  const drawingCanvasRef = useRef<HTMLCanvasElement>(null);

  const handleToolChange = (tool: AnnotationType["type"]) => {
    setSelectedTool(tool);
    if (tool === "text") {
      setText("Sample Text");
    }
  };

  const handleApplyAnnotation = () => {
    const annotation: AnnotationType = {
      type: selectedTool,
      color,
      strokeWidth,
      fontSize: selectedTool === "text" ? fontSize : undefined,
      text: selectedTool === "text" ? text : undefined,
      position: { x: 100, y: 100 }, // Default position
    };

    onAnnotationApply(annotation);
  };

  const clearCanvas = () => {
    const canvas = drawingCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx?.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (selectedTool !== "freehand") return;
    setIsDrawing(true);

    const canvas = drawingCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = strokeWidth;
    ctx.lineCap = "round";
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || selectedTool !== "freehand") return;

    const canvas = drawingCanvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      data-oid="u.i4a24"
    >
      <Card
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
        data-oid="fa13rfu"
      >
        <CardHeader data-oid="ru1j9k.">
          <div className="flex justify-between items-center" data-oid="vn16k8q">
            <CardTitle data-oid="dzg-6jm">
              Advanced PDF Annotation Tools
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-oid="y7y29xw"
            >
              <X className="w-4 h-4" data-oid="6do1lg5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6" data-oid="1pwu:ig">
          {/* Tool Selection */}
          <div className="space-y-3" data-oid="9xps_8q">
            <Label className="text-sm font-medium" data-oid="-n1bolq">
              Annotation Tools
            </Label>
            <div className="grid grid-cols-3 gap-2" data-oid="pvdtl6-">
              <Button
                variant={selectedTool === "text" ? "default" : "outline"}
                onClick={() => handleToolChange("text")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid=".96hi0i"
              >
                <Type className="w-5 h-5" data-oid="zr6:35v" />
                <span className="text-xs" data-oid="38gm7uj">
                  Text
                </span>
              </Button>
              <Button
                variant={selectedTool === "highlight" ? "default" : "outline"}
                onClick={() => handleToolChange("highlight")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="5zw8ufl"
              >
                <Highlighter className="w-5 h-5" data-oid="-jt130x" />
                <span className="text-xs" data-oid="jvhykxa">
                  Highlight
                </span>
              </Button>
              <Button
                variant={selectedTool === "rectangle" ? "default" : "outline"}
                onClick={() => handleToolChange("rectangle")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="5izv804"
              >
                <Square className="w-5 h-5" data-oid="mg0v2sr" />
                <span className="text-xs" data-oid="0s4dcp9">
                  Rectangle
                </span>
              </Button>
              <Button
                variant={selectedTool === "circle" ? "default" : "outline"}
                onClick={() => handleToolChange("circle")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="57n4orc"
              >
                <Circle className="w-5 h-5" data-oid="di.gcs1" />
                <span className="text-xs" data-oid="94a0qyb">
                  Circle
                </span>
              </Button>
              <Button
                variant={selectedTool === "line" ? "default" : "outline"}
                onClick={() => handleToolChange("line")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="12nhkc3"
              >
                <Minus className="w-5 h-5" data-oid="1xfic7-" />
                <span className="text-xs" data-oid="90iicou">
                  Line
                </span>
              </Button>
              <Button
                variant={selectedTool === "freehand" ? "default" : "outline"}
                onClick={() => handleToolChange("freehand")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="8mg7h4z"
              >
                <PenTool className="w-5 h-5" data-oid="m3r_bci" />
                <span className="text-xs" data-oid=".bzh8nv">
                  Freehand
                </span>
              </Button>
            </div>
          </div>

          <Separator data-oid="3ysikso" />

          {/* Properties */}
          <div className="grid grid-cols-2 gap-4" data-oid="guubfp6">
            <div className="space-y-3" data-oid="fn1ti.p">
              <div data-oid="c8dl05h">
                <Label htmlFor="color-picker" data-oid="6kaxkgg">
                  Color
                </Label>
                <div
                  className="flex items-center gap-2 mt-1"
                  data-oid="1us417:"
                >
                  <input
                    id="color-picker"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-8 rounded border border-border cursor-pointer"
                    title="Pick annotation color"
                    data-oid="mm0mfvb"
                  />

                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#ff0000"
                    className="flex-1"
                    data-oid="ecjpz8k"
                  />
                </div>
              </div>

              <div data-oid="we9byv6">
                <Label htmlFor="stroke-width" data-oid="-r593yd">
                  Stroke Width
                </Label>
                <Select
                  value={strokeWidth.toString()}
                  onValueChange={(v) => setStrokeWidth(parseInt(v))}
                  data-oid="wak0ibh"
                >
                  <SelectTrigger data-oid="3n1p__i">
                    <SelectValue data-oid=".y13kbx" />
                  </SelectTrigger>
                  <SelectContent data-oid="vs9jco9">
                    <SelectItem value="1" data-oid="p-:u0m.">
                      1px
                    </SelectItem>
                    <SelectItem value="2" data-oid="3be59p:">
                      2px
                    </SelectItem>
                    <SelectItem value="3" data-oid="18w7w_v">
                      3px
                    </SelectItem>
                    <SelectItem value="4" data-oid="kt1q2yv">
                      4px
                    </SelectItem>
                    <SelectItem value="5" data-oid="8h.nkc:">
                      5px
                    </SelectItem>
                    <SelectItem value="8" data-oid="ei5.jm5">
                      8px
                    </SelectItem>
                    <SelectItem value="10" data-oid="_1uutuj">
                      10px
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedTool === "text" && (
                <>
                  <div data-oid="8lfvfi7">
                    <Label htmlFor="font-size" data-oid="mu:q5l.">
                      Font Size
                    </Label>
                    <Select
                      value={fontSize.toString()}
                      onValueChange={(v) => setFontSize(parseInt(v))}
                      data-oid="0962-.l"
                    >
                      <SelectTrigger data-oid="6osa3:x">
                        <SelectValue data-oid="c6inn0e" />
                      </SelectTrigger>
                      <SelectContent data-oid="mx0z4ih">
                        <SelectItem value="10" data-oid="wb64oyd">
                          10px
                        </SelectItem>
                        <SelectItem value="12" data-oid="s:ley8s">
                          12px
                        </SelectItem>
                        <SelectItem value="14" data-oid="af9ex8v">
                          14px
                        </SelectItem>
                        <SelectItem value="16" data-oid="n60vgor">
                          16px
                        </SelectItem>
                        <SelectItem value="18" data-oid="25e7h3:">
                          18px
                        </SelectItem>
                        <SelectItem value="20" data-oid="14dvwpn">
                          20px
                        </SelectItem>
                        <SelectItem value="24" data-oid="itb22nd">
                          24px
                        </SelectItem>
                        <SelectItem value="32" data-oid="k5o7_p1">
                          32px
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div data-oid="m:r-1cp">
                    <Label htmlFor="text-input" data-oid="dput83r">
                      Text Content
                    </Label>
                    <Input
                      id="text-input"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter text to add"
                      data-oid="c-46g6n"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3" data-oid="u3h-zlp">
              <Label data-oid="52rv4sf">Preview Canvas</Label>
              <div
                className="border border-border rounded bg-white"
                data-oid="r8xvg-z"
              >
                <canvas
                  ref={drawingCanvasRef}
                  width={300}
                  height={200}
                  className="w-full cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseLeave={stopDrawing}
                  data-oid="w3a-i.n"
                />
              </div>
              <div className="flex gap-2" data-oid="xh4mman">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCanvas}
                  data-oid="va4dz_m"
                >
                  <Eraser className="w-4 h-4 mr-1" data-oid="kloao1t" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <Separator data-oid="rs3pvse" />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end" data-oid="gexn:7e">
            <Button variant="outline" onClick={onClose} data-oid="vo:tmm6">
              Cancel
            </Button>
            <Button
              onClick={handleApplyAnnotation}
              className="bg-gradient-to-r from-primary via-secondary to-accent text-white"
              data-oid="twsj083"
            >
              <Download className="w-4 h-4 mr-2" data-oid="zgj1nos" />
              Apply Annotation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnnotationTool;
