import React, { useState, useRef, useCallback, useEffect } from "react";
import { Rnd } from "react-rnd";
import { nanoid } from "nanoid";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Badge } from "./ui/badge";
import {
  Bold,
  Italic,
  Underline,
  Trash2,
  Plus,
  Type,
  Palette,
} from "lucide-react";

export interface TextBox {
  id: string;
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
  value: string;
  font: string;
  size: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: "left" | "center" | "right";
  rotation: number;
}

interface TextBoxManagerProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentPage: number;
  zoom: number;
  onTextBoxesChange?: (textBoxes: TextBox[]) => void;
  onExport?: (pdfBytes: Uint8Array) => void;
  showControls?: boolean;
  originalPdfData?: Uint8Array;
}

export default function TextBoxManager({
  canvasRef,
  currentPage,
  zoom = 1,
  onTextBoxesChange,
  onExport,
  showControls = true,
  originalPdfData,
}: TextBoxManagerProps) {
  const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Text properties
  const [selectedFont, setSelectedFont] = useState("Helvetica");
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontWeight, setFontWeight] = useState<"normal" | "bold">("normal");
  const [fontStyle, setFontStyle] = useState<"normal" | "italic">("normal");
  const [textAlign, setTextAlign] = useState<"left" | "center" | "right">(
    "left",
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (isAddMode && e.target === e.currentTarget) {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = (e.clientX - rect.left) / zoom;
        const y = (e.clientY - rect.top) / zoom;

        const newBox: TextBox = {
          id: nanoid(),
          page: currentPage,
          x,
          y,
          width: 200,
          height: 50,
          value: "Edit me",
          font: selectedFont,
          size: fontSize,
          color: fontColor,
          bold: fontWeight === "bold",
          italic: fontStyle === "italic",
          underline: false,
          alignment: textAlign,
          rotation: 0,
        };

        const updatedBoxes = [...textBoxes, newBox];
        setTextBoxes(updatedBoxes);
        onTextBoxesChange?.(updatedBoxes);
        setIsAddMode(false);
        setSelectedId(newBox.id);
      }
    },
    [
      isAddMode,
      canvasRef,
      zoom,
      currentPage,
      selectedFont,
      fontSize,
      fontColor,
      fontWeight,
      fontStyle,
      textAlign,
      textBoxes,
      onTextBoxesChange,
    ],
  );

  const updateTextBox = useCallback(
    (id: string, updates: Partial<TextBox>) => {
      const updatedBoxes = textBoxes.map((box) =>
        box.id === id ? { ...box, ...updates } : box,
      );
      setTextBoxes(updatedBoxes);
      onTextBoxesChange?.(updatedBoxes);
    },
    [textBoxes, onTextBoxesChange],
  );

  const deleteTextBox = useCallback(
    (id: string) => {
      const updatedBoxes = textBoxes.filter((box) => box.id !== id);
      setTextBoxes(updatedBoxes);
      onTextBoxesChange?.(updatedBoxes);
      if (selectedId === id) setSelectedId(null);
    },
    [textBoxes, selectedId, onTextBoxesChange],
  );

  const toggleStyle = useCallback(
    (id: string, style: "bold" | "italic" | "underline") => {
      updateTextBox(id, {
        [style]: !textBoxes.find((box) => box.id === id)?.[style],
      });
    },
    [textBoxes, updateTextBox],
  );

  const currentPageTextBoxes = textBoxes.filter(
    (box) => box.page === currentPage,
  );
  const selectedBox = textBoxes.find((box) => box.id === selectedId);

  const exportWithTextBoxes = async () => {
    if (!originalPdfData || !onExport) return;

    try {
      const { PDFDocument, StandardFonts, rgb } = await import("pdf-lib");
      const pdfDoc = await PDFDocument.load(originalPdfData);
      const pages = pdfDoc.getPages();

      for (const textBox of textBoxes) {
        const page = pages[textBox.page - 1];
        if (!page) continue;

        const { height: pageHeight } = page.getSize();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

        // Convert hex color to RGB
        const hex = textBox.color.replace("#", "");
        const r = parseInt(hex.substr(0, 2), 16) / 255;
        const g = parseInt(hex.substr(2, 2), 16) / 255;
        const b = parseInt(hex.substr(4, 2), 16) / 255;

        page.drawText(textBox.value, {
          x: textBox.x,
          y: pageHeight - textBox.y - textBox.height,
          size: textBox.size,
          font,
          color: rgb(r, g, b),
        });
      }

      const pdfBytes = await pdfDoc.save();
      onExport(pdfBytes);
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  return (
    <>
      {showControls && (
        <div
          className="flex flex-wrap items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg border mb-2"
          data-oid="d0qpwc0"
        >
          <Button
            size="sm"
            variant={isAddMode ? "default" : "outline"}
            onClick={() => setIsAddMode(!isAddMode)}
            data-oid="-7go.fc"
          >
            <Plus className="h-4 w-4 mr-1" data-oid="dzgkrwt" />
            {isAddMode ? "Cancel" : "Add Text"}
          </Button>

          <div className="flex items-center gap-2" data-oid="p:o-i-4">
            <Select
              value={selectedFont}
              onValueChange={setSelectedFont}
              data-oid="iuboemw"
            >
              <SelectTrigger className="w-32" data-oid="cfanzz7">
                <SelectValue data-oid="9dwfca0" />
              </SelectTrigger>
              <SelectContent data-oid="z1k00g-">
                <SelectItem value="Helvetica" data-oid="o34y3er">
                  Helvetica
                </SelectItem>
                <SelectItem value="Times-Roman" data-oid="2yhnh3u">
                  Times
                </SelectItem>
                <SelectItem value="Courier" data-oid="_f4fl7r">
                  Courier
                </SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="number"
              value={fontSize}
              onChange={(e) => setFontSize(Number(e.target.value))}
              className="w-16"
              min={8}
              max={72}
              data-oid="pgi5ea8"
            />

            <input
              type="color"
              value={fontColor}
              onChange={(e) => setFontColor(e.target.value)}
              className="w-8 h-8 rounded border cursor-pointer"
              data-oid="a4tm_8-"
            />
          </div>

          {selectedBox && (
            <div
              className="flex items-center gap-1 ml-4 p-1 bg-blue-50 dark:bg-blue-900 rounded"
              data-oid="bfpu:zp"
            >
              <Button
                size="sm"
                variant={selectedBox.bold ? "default" : "outline"}
                onClick={() => toggleStyle(selectedBox.id, "bold")}
                data-oid="plf4nhr"
              >
                <Bold className="h-3 w-3" data-oid="-kq__1s" />
              </Button>
              <Button
                size="sm"
                variant={selectedBox.italic ? "default" : "outline"}
                onClick={() => toggleStyle(selectedBox.id, "italic")}
                data-oid="h_ihsk3"
              >
                <Italic className="h-3 w-3" data-oid="ysncdti" />
              </Button>
              <Button
                size="sm"
                variant={selectedBox.underline ? "default" : "outline"}
                onClick={() => toggleStyle(selectedBox.id, "underline")}
                data-oid="bjchnt-"
              >
                <Underline className="h-3 w-3" data-oid="b5_qm9." />
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => deleteTextBox(selectedBox.id)}
                data-oid="03tekdy"
              >
                <Trash2 className="h-3 w-3" data-oid="-rso1zb" />
              </Button>
            </div>
          )}

          {textBoxes.length > 0 && onExport && (
            <Button
              size="sm"
              onClick={exportWithTextBoxes}
              className="ml-4"
              data-oid="kigk-cq"
            >
              Export PDF
            </Button>
          )}

          <Badge variant="secondary" data-oid="n5.-d:n">
            {currentPageTextBoxes.length} text box(es)
          </Badge>
        </div>
      )}

      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: canvasRef.current?.width || "100%",
          height: canvasRef.current?.height || "100%",
          cursor: isAddMode ? "crosshair" : "default",
          zIndex: 10,
        }}
        onClick={handleCanvasClick}
        data-oid="hr0m0.y"
      >
        {currentPageTextBoxes.map((box) => (
          <Rnd
            key={box.id}
            size={{
              width: box.width * zoom,
              height: box.height * zoom,
            }}
            position={{
              x: box.x * zoom,
              y: box.y * zoom,
            }}
            bounds="parent"
            onDragStop={(_, d) =>
              updateTextBox(box.id, {
                x: d.x / zoom,
                y: d.y / zoom,
              })
            }
            onResizeStop={(_, __, ref, ____, pos) =>
              updateTextBox(box.id, {
                width: parseInt(ref.style.width, 10) / zoom,
                height: parseInt(ref.style.height, 10) / zoom,
                x: pos.x / zoom,
                y: pos.y / zoom,
              })
            }
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              setSelectedId(box.id);
            }}
            data-oid="81cstoy"
          >
            <div
              className={`group relative ${selectedId === box.id ? "ring-2 ring-blue-500" : ""}`}
              data-oid="--z559a"
            >
              {/* Hover Controls */}
              <div
                className="absolute -top-8 left-0 hidden group-hover:flex gap-1 bg-white dark:bg-gray-800 border rounded p-1 shadow-lg z-20"
                data-oid="2p1jlcb"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStyle(box.id, "bold");
                  }}
                  className={`px-2 py-1 text-xs font-bold rounded ${box.bold ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                  title="Bold"
                  data-oid="n7ain:0"
                >
                  B
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStyle(box.id, "italic");
                  }}
                  className={`px-2 py-1 text-xs italic rounded ${box.italic ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                  title="Italic"
                  data-oid=".3x-_1i"
                >
                  I
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStyle(box.id, "underline");
                  }}
                  className={`px-2 py-1 text-xs underline rounded ${box.underline ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"}`}
                  title="Underline"
                  data-oid="l0bcsb5"
                >
                  U
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTextBox(box.id);
                  }}
                  className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
                  title="Delete"
                  data-oid="xug91e0"
                >
                  ×
                </button>
              </div>

              <div
                contentEditable
                suppressContentEditableWarning
                style={{
                  width: "100%",
                  height: "100%",
                  fontFamily: box.font,
                  fontSize: box.size * zoom,
                  color: box.color,
                  fontWeight: box.bold ? "bold" : "normal",
                  fontStyle: box.italic ? "italic" : "normal",
                  textDecoration: box.underline ? "underline" : "none",
                  textAlign: box.alignment,
                  background:
                    selectedId === box.id
                      ? "rgba(59, 130, 246, 0.1)"
                      : "rgba(255,255,255,0.8)",
                  padding: "4px",
                  outline:
                    selectedId === box.id
                      ? "2px solid #3b82f6"
                      : "1px solid rgba(0,0,0,0.2)",
                  borderRadius: "3px",
                  overflow: "hidden",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                  boxSizing: "border-box",
                  cursor: "text",
                  minHeight: "20px",
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedId(box.id);
                  e.currentTarget.focus();
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onBlur={(e) =>
                  updateTextBox(box.id, { value: e.currentTarget.innerText })
                }
                onKeyDown={(e) => {
                  e.stopPropagation();
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.currentTarget.blur();
                  }
                }}
                data-oid=":yr79mj"
              >
                {box.value}
              </div>
            </div>
          </Rnd>
        ))}
      </div>
    </>
  );
}

// Export type already declared in interface
