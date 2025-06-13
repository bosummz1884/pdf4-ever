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
      data-oid="y:r3twq"
    >
      <Card
        className="w-full max-w-4xl max-h-[90vh] overflow-hidden"
        data-oid="c.383_y"
      >
        <CardHeader data-oid="vbz57wp">
          <div className="flex justify-between items-center" data-oid="f4v791q">
            <CardTitle data-oid="4yv49jw">
              Advanced PDF Annotation Tools
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-oid="27yqvy:"
            >
              <X className="w-4 h-4" data-oid="ckmd:nk" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6" data-oid="ucp3.to">
          {/* Tool Selection */}
          <div className="space-y-3" data-oid="t-kfcz7">
            <Label className="text-sm font-medium" data-oid=":uy3yuk">
              Annotation Tools
            </Label>
            <div className="grid grid-cols-3 gap-2" data-oid="1k1dab4">
              <Button
                variant={selectedTool === "text" ? "default" : "outline"}
                onClick={() => handleToolChange("text")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="2n4ppxw"
              >
                <Type className="w-5 h-5" data-oid="v_c7okf" />
                <span className="text-xs" data-oid="q_jqjug">
                  Text
                </span>
              </Button>
              <Button
                variant={selectedTool === "highlight" ? "default" : "outline"}
                onClick={() => handleToolChange("highlight")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="ahock9m"
              >
                <Highlighter className="w-5 h-5" data-oid="xdds.i9" />
                <span className="text-xs" data-oid="y-d8dcx">
                  Highlight
                </span>
              </Button>
              <Button
                variant={selectedTool === "rectangle" ? "default" : "outline"}
                onClick={() => handleToolChange("rectangle")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="yylbsph"
              >
                <Square className="w-5 h-5" data-oid="-9yj2ir" />
                <span className="text-xs" data-oid="e..49ou">
                  Rectangle
                </span>
              </Button>
              <Button
                variant={selectedTool === "circle" ? "default" : "outline"}
                onClick={() => handleToolChange("circle")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="1cgqa6p"
              >
                <Circle className="w-5 h-5" data-oid="30149xd" />
                <span className="text-xs" data-oid="1btbbk3">
                  Circle
                </span>
              </Button>
              <Button
                variant={selectedTool === "line" ? "default" : "outline"}
                onClick={() => handleToolChange("line")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="3n.mkij"
              >
                <Minus className="w-5 h-5" data-oid="1uhja_8" />
                <span className="text-xs" data-oid="x5l2to4">
                  Line
                </span>
              </Button>
              <Button
                variant={selectedTool === "freehand" ? "default" : "outline"}
                onClick={() => handleToolChange("freehand")}
                className="flex flex-col items-center gap-1 h-16"
                data-oid="nop55x_"
              >
                <PenTool className="w-5 h-5" data-oid="kx-sitq" />
                <span className="text-xs" data-oid="gygbu94">
                  Freehand
                </span>
              </Button>
            </div>
          </div>

          <Separator data-oid="bt-ts1f" />

          {/* Properties */}
          <div className="grid grid-cols-2 gap-4" data-oid="daz._30">
            <div className="space-y-3" data-oid="ssjvp5.">
              <div data-oid="nfk5dmk">
                <Label htmlFor="color-picker" data-oid="pxd:y-e">
                  Color
                </Label>
                <div
                  className="flex items-center gap-2 mt-1"
                  data-oid="w4640uz"
                >
                  <input
                    id="color-picker"
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-8 rounded border border-border cursor-pointer"
                    title="Pick annotation color"
                    data-oid="era3ufd"
                  />

                  <Input
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="#ff0000"
                    className="flex-1"
                    data-oid="aj_tfg0"
                  />
                </div>
              </div>

              <div data-oid="-2tlg23">
                <Label htmlFor="stroke-width" data-oid=".x099on">
                  Stroke Width
                </Label>
                <Select
                  value={strokeWidth.toString()}
                  onValueChange={(v) => setStrokeWidth(parseInt(v))}
                  data-oid="n-8hq.f"
                >
                  <SelectTrigger data-oid="d54lumo">
                    <SelectValue data-oid="za2dh48" />
                  </SelectTrigger>
                  <SelectContent data-oid="6wrphod">
                    <SelectItem value="1" data-oid="045l4-9">
                      1px
                    </SelectItem>
                    <SelectItem value="2" data-oid=":qauy1y">
                      2px
                    </SelectItem>
                    <SelectItem value="3" data-oid="z7789wl">
                      3px
                    </SelectItem>
                    <SelectItem value="4" data-oid="usip0-_">
                      4px
                    </SelectItem>
                    <SelectItem value="5" data-oid="_m4gezx">
                      5px
                    </SelectItem>
                    <SelectItem value="8" data-oid="a1b.x-g">
                      8px
                    </SelectItem>
                    <SelectItem value="10" data-oid="xgf1r0i">
                      10px
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {selectedTool === "text" && (
                <>
                  <div data-oid="futt8hn">
                    <Label htmlFor="font-size" data-oid="mc91.m3">
                      Font Size
                    </Label>
                    <Select
                      value={fontSize.toString()}
                      onValueChange={(v) => setFontSize(parseInt(v))}
                      data-oid="gx:htbi"
                    >
                      <SelectTrigger data-oid="mvaw8bh">
                        <SelectValue data-oid="ov7nqtc" />
                      </SelectTrigger>
                      <SelectContent data-oid="dovnw43">
                        <SelectItem value="10" data-oid="pd_.nn.">
                          10px
                        </SelectItem>
                        <SelectItem value="12" data-oid="dazklq0">
                          12px
                        </SelectItem>
                        <SelectItem value="14" data-oid="af38oda">
                          14px
                        </SelectItem>
                        <SelectItem value="16" data-oid="n4-mjfn">
                          16px
                        </SelectItem>
                        <SelectItem value="18" data-oid="qklylen">
                          18px
                        </SelectItem>
                        <SelectItem value="20" data-oid="g5b916:">
                          20px
                        </SelectItem>
                        <SelectItem value="24" data-oid="fsyq2k3">
                          24px
                        </SelectItem>
                        <SelectItem value="32" data-oid="kwi_d3n">
                          32px
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div data-oid="7kceq7s">
                    <Label htmlFor="text-input" data-oid="84-x45e">
                      Text Content
                    </Label>
                    <Input
                      id="text-input"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Enter text to add"
                      data-oid="q6:5k-e"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="space-y-3" data-oid="ei::fgt">
              <Label data-oid="u454bq2">Preview Canvas</Label>
              <div
                className="border border-border rounded bg-white"
                data-oid="9zz40v3"
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
                  data-oid="djty9:9"
                />
              </div>
              <div className="flex gap-2" data-oid="7bu21fu">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearCanvas}
                  data-oid="arjpz:u"
                >
                  <Eraser className="w-4 h-4 mr-1" data-oid="8yi943-" />
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <Separator data-oid="n1u64_3" />

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end" data-oid="hljpjyv">
            <Button variant="outline" onClick={onClose} data-oid="l56spu.">
              Cancel
            </Button>
            <Button
              onClick={handleApplyAnnotation}
              className="bg-gradient-to-r from-primary via-secondary to-accent text-white"
              data-oid="4si4mjw"
            >
              <Download className="w-4 h-4 mr-2" data-oid="lb06anq" />
              Apply Annotation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdvancedAnnotationTool;
