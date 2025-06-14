import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import "pdfjs-dist/web/pdf_viewer.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Palette,
  Type,
  Undo,
  Redo,
} from "lucide-react";

interface TextBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  alignment: "left" | "center" | "right";
  pageIndex: number;
}

interface FontOptions {
  size: number;
  color: string;
  family: string;
  bold: boolean;
  italic: boolean;
}

interface InteractiveTextEditorProps {
  file: File;
  isTextMode: boolean;
  setIsTextMode: (mode: boolean) => void;
  isEraserMode: boolean;
  setIsEraserMode: (mode: boolean) => void;
  eraserSize: number;
  fontOptions: FontOptions;
}

const InteractiveTextEditor = forwardRef<any, InteractiveTextEditorProps>(
  (
    {
      file,
      isTextMode,
      setIsTextMode,
      isEraserMode,
      setIsEraserMode,
      eraserSize,
      fontOptions,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [pdfDocument, setPdfDocument] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [numPages, setNumPages] = useState(0);
    const [textBoxes, setTextBoxes] = useState<TextBox[]>([]);
    const [selectedTextBox, setSelectedTextBox] = useState<string | null>(null);
    const [scale, setScale] = useState(1.0);
    const [isErasing, setIsErasing] = useState(false);
    const [editHistory, setEditHistory] = useState<
      Array<{ textBoxes: TextBox[]; action: string }>
    >([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [viewport, setViewport] = useState<any>(null);
    const [dragData, setDragData] = useState<{
      isDragging: boolean;
      startX: number;
      startY: number;
      textBoxId: string | null;
      initialX: number;
      initialY: number;
    }>({
      isDragging: false,
      startX: 0,
      startY: 0,
      textBoxId: null,
      initialX: 0,
      initialY: 0,
    });

    useImperativeHandle(ref, () => ({
      insertText: (text: string) => {
        setIsTextMode(true);
      },
      enableTextMode: () => {
        setIsTextMode(true);
      },
      disableTextMode: () => {
        setIsTextMode(false);
      },
      exportPDF: async () => {
        console.log("Exporting PDF with text boxes:", textBoxes);
      },
      resetToOriginal: () => {
        setTextBoxes([]);
        setSelectedTextBox(null);
      },
      enableHighlight: () => {
        console.log("Highlight mode enabled");
      },
      undo: () => {
        console.log("Undo");
      },
      redo: () => {
        console.log("Redo");
      },
    }));

    useEffect(() => {
      loadPDF();
    }, [file]);

    useEffect(() => {
      if (pdfDocument) {
        renderPage(currentPage);
      }
    }, [pdfDocument, currentPage, scale]);

    const loadPDF = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        setPdfDocument(pdf);
        setNumPages(pdf.numPages);
        console.log("PDF loaded successfully:", file.name);
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    const renderPage = async (pageNum: number) => {
      if (!pdfDocument || !canvasRef.current) return;

      try {
        const page = await pdfDocument.getPage(pageNum);
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        if (!context) return;

        const currentViewport = page.getViewport({ scale });
        setViewport(currentViewport);
        canvas.height = currentViewport.height;
        canvas.width = currentViewport.width;

        console.log("Rendering page:", pageNum);
        console.log(
          "Viewport size:",
          currentViewport.width,
          currentViewport.height,
        );

        const renderContext = {
          canvasContext: context,
          viewport: currentViewport,
        };

        await page.render(renderContext).promise;
      } catch (error) {
        console.error("Error rendering page:", error);
      }
    };

    const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
      if (!viewport) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      if (isEraserMode) {
        handleErase(x, y);
        return;
      }

      if (isTextMode) {
        // Create new text box when in text mode

        const newTextBox: TextBox = {
          id: `textbox-${Date.now()}`,
          x,
          y,
          width: 200,
          height: 40,
          text: "",
          fontSize: fontOptions.size,
          fontFamily: fontOptions.family,
          color: fontOptions.color,
          bold: fontOptions.bold,
          italic: fontOptions.italic,
          underline: false,
          alignment: "left",
          pageIndex: currentPage - 1,
        };

        // Save to history before adding new text box
        saveToHistory([...textBoxes], "add_textbox");

        setTextBoxes((prev) => [...prev, newTextBox]);
        setSelectedTextBox(newTextBox.id);
        setIsTextMode(false); // Exit text mode after creating text box
        return;
      }

      // If not in any special mode, just deselect current text box
      setSelectedTextBox(null);
    };

    const handleErase = (x: number, y: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      const radius = eraserSize / 2;

      // Create a solid white circle to replace erased content
      context.save();
      context.fillStyle = "#FFFFFF"; // Always white, regardless of theme
      context.beginPath();
      context.arc(x, y, radius, 0, 2 * Math.PI);
      context.fill();
      context.restore();

      // Remove any text boxes that intersect with the erased area
      const eraserX = x - radius;
      const eraserY = y - radius;

      const filteredTextBoxes = textBoxes.filter((textBox) => {
        const textBoxRight = textBox.x + textBox.width;
        const textBoxBottom = textBox.y + textBox.height;
        const erasedRight = eraserX + eraserSize;
        const erasedBottom = eraserY + eraserSize;

        // Check if text box intersects with erased area
        const intersects = !(
          textBox.x > erasedRight ||
          textBoxRight < eraserX ||
          textBox.y > erasedBottom ||
          textBoxBottom < eraserY
        );

        return !intersects;
      });

      // Save to history before erasing
      if (filteredTextBoxes.length !== textBoxes.length) {
        saveToHistory(textBoxes, "erase");
        setTextBoxes(filteredTextBoxes);
      }
    };

    const handleCanvasMouseDown = (
      event: React.MouseEvent<HTMLCanvasElement>,
    ) => {
      if (isEraserMode) {
        setIsErasing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        handleErase(x, y);
      }
    };

    const handleCanvasMouseMove = (
      event: React.MouseEvent<HTMLCanvasElement>,
    ) => {
      if (isEraserMode && isErasing) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        handleErase(x, y);
      }
    };

    const handleCanvasMouseUp = () => {
      if (isEraserMode) {
        setIsErasing(false);
      }
    };

    const handleMouseDown = (event: React.MouseEvent, textBoxId: string) => {
      event.preventDefault();
      event.stopPropagation();

      const textBox = textBoxes.find((tb) => tb.id === textBoxId);
      if (!textBox) return;

      setSelectedTextBox(textBoxId);
      setDragData({
        isDragging: true,
        startX: event.clientX,
        startY: event.clientY,
        textBoxId,
        initialX: textBox.x,
        initialY: textBox.y,
      });
    };

    const handleMouseMove = (event: React.MouseEvent) => {
      if (!dragData.isDragging || !dragData.textBoxId) return;

      const deltaX = event.clientX - dragData.startX;
      const deltaY = event.clientY - dragData.startY;

      setTextBoxes((prev) =>
        prev.map((tb) =>
          tb.id === dragData.textBoxId
            ? {
                ...tb,
                x: dragData.initialX + deltaX,
                y: dragData.initialY + deltaY,
              }
            : tb,
        ),
      );
    };

    const handleMouseUp = () => {
      setDragData({
        isDragging: false,
        startX: 0,
        startY: 0,
        textBoxId: null,
        initialX: 0,
        initialY: 0,
      });
    };

    const nextPage = () => {
      if (currentPage < numPages) {
        setCurrentPage(currentPage + 1);
      }
    };

    const previousPage = () => {
      if (currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    };

    const deleteTextBox = (textBoxId: string) => {
      // Save to history before removing
      saveToHistory(textBoxes, "remove_textbox");
      setTextBoxes((prev) => prev.filter((tb) => tb.id !== textBoxId));
      setSelectedTextBox(null);
    };

    const updateTextBoxProperty = (
      textBoxId: string,
      property: keyof TextBox,
      value: any,
    ) => {
      // Save to history before updating
      saveToHistory(textBoxes, `update_${property}`);

      setTextBoxes((prev) =>
        prev.map((tb) =>
          tb.id === textBoxId ? { ...tb, [property]: value } : tb,
        ),
      );
    };

    const saveToHistory = (currentTextBoxes: TextBox[], action: string) => {
      const newHistory = editHistory.slice(0, historyIndex + 1);
      newHistory.push({ textBoxes: [...currentTextBoxes], action });

      // Limit history to 50 items
      if (newHistory.length > 50) {
        newHistory.shift();
      }

      setEditHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    };

    const undo = () => {
      if (historyIndex > 0) {
        const previousState = editHistory[historyIndex - 1];
        setTextBoxes([...previousState.textBoxes]);
        setHistoryIndex(historyIndex - 1);
        setSelectedTextBox(null);
      }
    };

    const redo = () => {
      if (historyIndex < editHistory.length - 1) {
        const nextState = editHistory[historyIndex + 1];
        setTextBoxes([...nextState.textBoxes]);
        setHistoryIndex(historyIndex + 1);
        setSelectedTextBox(null);
      }
    };

    const FontFormattingToolbar = ({ textBox }: { textBox: TextBox }) => (
      <div
        className="absolute -top-12 left-0 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-2 flex items-center gap-1"
        style={{ zIndex: 9999 }}
        data-oid="vdkmkfy"
      >
        {/* Font Size */}
        <Select
          value={textBox.fontSize.toString()}
          onValueChange={(value) =>
            updateTextBoxProperty(textBox.id, "fontSize", parseInt(value))
          }
          data-oid="hhac6c2"
        >
          <SelectTrigger className="w-16 h-8" data-oid="2ckom-:">
            <SelectValue data-oid="ctk7qi:" />
          </SelectTrigger>
          <SelectContent className="z-[10000]" data-oid="y1f:cor">
            <SelectItem value="8" data-oid="z6m5r36">
              8
            </SelectItem>
            <SelectItem value="10" data-oid="fr9s7y_">
              10
            </SelectItem>
            <SelectItem value="12" data-oid="34x4.v.">
              12
            </SelectItem>
            <SelectItem value="14" data-oid="hxotd6k">
              14
            </SelectItem>
            <SelectItem value="16" data-oid="j02mfph">
              16
            </SelectItem>
            <SelectItem value="18" data-oid=".:auj0z">
              18
            </SelectItem>
            <SelectItem value="20" data-oid="fem_ks0">
              20
            </SelectItem>
            <SelectItem value="24" data-oid="v785w1f">
              24
            </SelectItem>
            <SelectItem value="28" data-oid="_-50z:j">
              28
            </SelectItem>
            <SelectItem value="32" data-oid="zfkr.0j">
              32
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Font Family */}
        <Select
          value={textBox.fontFamily}
          onValueChange={(value) =>
            updateTextBoxProperty(textBox.id, "fontFamily", value)
          }
          data-oid="eixz9g0"
        >
          <SelectTrigger className="w-24 h-8" data-oid="r-8--p8">
            <SelectValue data-oid="qrzzcnh" />
          </SelectTrigger>
          <SelectContent className="z-[10000]" data-oid="49b_lfi">
            <SelectItem value="Arial" data-oid="2e3rawb">
              Arial
            </SelectItem>
            <SelectItem value="Helvetica" data-oid="x79bqeo">
              Helvetica
            </SelectItem>
            <SelectItem value="Times New Roman" data-oid="mwbztn2">
              Times
            </SelectItem>
            <SelectItem value="Courier New" data-oid="v9--wx5">
              Courier
            </SelectItem>
            <SelectItem value="Georgia" data-oid="xbcji-y">
              Georgia
            </SelectItem>
            <SelectItem value="Verdana" data-oid="jedt2hn">
              Verdana
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Bold */}
        <Button
          variant={textBox.bold ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() =>
            updateTextBoxProperty(textBox.id, "bold", !textBox.bold)
          }
          data-oid="s.7wzb0"
        >
          <Bold className="h-4 w-4" data-oid="6c426bm" />
        </Button>

        {/* Italic */}
        <Button
          variant={textBox.italic ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() =>
            updateTextBoxProperty(textBox.id, "italic", !textBox.italic)
          }
          data-oid="h7biz8z"
        >
          <Italic className="h-4 w-4" data-oid="4d0dsyb" />
        </Button>

        {/* Underline */}
        <Button
          variant={textBox.underline ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() =>
            updateTextBoxProperty(textBox.id, "underline", !textBox.underline)
          }
          data-oid="9mal:2:"
        >
          <Underline className="h-4 w-4" data-oid="xm-qrvj" />
        </Button>

        {/* Text Color */}
        <input
          type="color"
          value={textBox.color}
          onChange={(e) =>
            updateTextBoxProperty(textBox.id, "color", e.target.value)
          }
          className="w-8 h-8 border border-gray-300 rounded cursor-pointer"
          title="Text Color"
          data-oid="xj46bae"
        />

        {/* Alignment */}
        <div className="flex" data-oid="z2j4265">
          <Button
            variant={textBox.alignment === "left" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 rounded-r-none"
            onClick={() =>
              updateTextBoxProperty(textBox.id, "alignment", "left")
            }
            data-oid="i:-1.av"
          >
            <AlignLeft className="h-4 w-4" data-oid=":bv5d7r" />
          </Button>
          <Button
            variant={textBox.alignment === "center" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 rounded-none border-x-0"
            onClick={() =>
              updateTextBoxProperty(textBox.id, "alignment", "center")
            }
            data-oid="6x19o.x"
          >
            <AlignCenter className="h-4 w-4" data-oid="mcbjhnk" />
          </Button>
          <Button
            variant={textBox.alignment === "right" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 rounded-l-none"
            onClick={() =>
              updateTextBoxProperty(textBox.id, "alignment", "right")
            }
            data-oid="sn:fmno"
          >
            <AlignRight className="h-4 w-4" data-oid="93x60vy" />
          </Button>
        </div>
      </div>
    );

    return (
      <div
        ref={containerRef}
        className="relative w-full h-full bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        data-oid="kjhgdxe"
      >
        {/* Undo/Redo Controls */}
        <div
          className="absolute top-4 left-4 flex gap-2 z-50"
          data-oid="5hlp0j_"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg"
            data-oid="g6e_6fa"
          >
            <Undo className="w-4 h-4" data-oid=".4yzqop" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= editHistory.length - 1}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg"
            data-oid="-57es-e"
          >
            <Redo className="w-4 h-4" data-oid="jr_m5pq" />
          </Button>
        </div>

        {/* Text Mode Indicator */}
        {isTextMode && (
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
            data-oid="izt341l"
          >
            Click anywhere on the document to add text
          </div>
        )}

        {/* Eraser Mode Indicator */}
        {isEraserMode && (
          <div
            className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
            data-oid="g4ahv1j"
          >
            Eraser Mode Active - Click and drag to erase content
          </div>
        )}

        {/* PDF Canvas */}
        <div className="relative" data-oid="a_q2hsk">
          <canvas
            ref={canvasRef}
            className="block mx-auto shadow-lg"
            style={{
              maxWidth: "100%",
              height: "auto",
              cursor: isTextMode
                ? "crosshair"
                : isEraserMode
                  ? `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="none" stroke="red" stroke-width="2"/><circle cx="16" cy="16" r="1" fill="red"/></svg>') 16 16, crosshair`
                  : "default",
            }}
            onClick={handleCanvasClick}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            data-oid="motv5k4"
          />

          {/* Text Boxes Overlay */}
          {textBoxes
            .filter((textBox) => textBox.pageIndex === currentPage - 1)
            .map((textBox) => (
              <Resizable
                key={textBox.id}
                width={textBox.width}
                height={textBox.height}
                onResize={(e: any, { size }: any) => {
                  setTextBoxes((prev) =>
                    prev.map((tb) =>
                      tb.id === textBox.id
                        ? { ...tb, width: size.width, height: size.height }
                        : tb,
                    ),
                  );
                }}
                resizeHandles={
                  selectedTextBox === textBox.id
                    ? ["se", "sw", "ne", "nw", "n", "s", "e", "w"]
                    : []
                }
                data-oid="t9hxir0"
              >
                <div
                  className={`absolute border-2 ${
                    selectedTextBox === textBox.id
                      ? "border-blue-500 bg-blue-50/20 shadow-lg"
                      : "border-gray-300 bg-white/90 hover:border-gray-400"
                  } rounded transition-all`}
                  style={{
                    left: textBox.x,
                    top: textBox.y,
                    width: textBox.width,
                    height: textBox.height,
                    zIndex: selectedTextBox === textBox.id ? 1000 : 100,
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTextBox(textBox.id);
                    // Allow editing text by focusing on input when clicking text box
                    setTimeout(() => {
                      const input = document.querySelector(
                        `#text-input-${textBox.id}`,
                      ) as HTMLInputElement;
                      if (input) {
                        input.focus();
                      }
                    }, 0);
                  }}
                  data-oid="pd7mzrl"
                >
                  {/* Formatting Toolbar */}
                  {selectedTextBox === textBox.id && (
                    <FontFormattingToolbar
                      textBox={textBox}
                      data-oid="o12:hf_"
                    />
                  )}

                  {/* Draggable header bar */}
                  <div
                    className="absolute top-0 left-0 right-0 h-6 bg-blue-500/10 cursor-move border-b border-blue-200"
                    style={{
                      display:
                        selectedTextBox === textBox.id ? "block" : "none",
                    }}
                    onMouseDown={(e) => handleMouseDown(e, textBox.id)}
                    data-oid="4:jg5j1"
                  />

                  <textarea
                    className="w-full h-full border-none outline-none bg-transparent resize-none"
                    style={{
                      fontSize: `${textBox.fontSize}px`,
                      fontFamily: textBox.fontFamily,
                      color: textBox.color,
                      fontWeight: textBox.bold ? "bold" : "normal",
                      fontStyle: textBox.italic ? "italic" : "normal",
                      textDecoration: textBox.underline ? "underline" : "none",
                      textAlign: textBox.alignment,
                      pointerEvents: "auto",
                      padding:
                        selectedTextBox === textBox.id
                          ? "24px 8px 8px 8px"
                          : "8px",
                      lineHeight: "1.2",
                      wordWrap: "break-word",
                      overflow: "hidden",
                    }}
                    placeholder={textBox.text === "" ? "Type here..." : ""}
                    value={textBox.text}
                    onChange={(e) => {
                      e.stopPropagation();
                      const newText = e.target.value;
                      setTextBoxes((prev) =>
                        prev.map((tb) =>
                          tb.id === textBox.id ? { ...tb, text: newText } : tb,
                        ),
                      );

                      // Auto-resize height based on content
                      const lines = newText.split("\n").length;
                      const estimatedHeight = Math.max(
                        40,
                        lines * textBox.fontSize * 1.4 + 16,
                      );
                      if (estimatedHeight !== textBox.height) {
                        setTextBoxes((prev) =>
                          prev.map((tb) =>
                            tb.id === textBox.id
                              ? { ...tb, height: estimatedHeight }
                              : tb,
                          ),
                        );
                      }
                    }}
                    onFocus={(e) => {
                      e.stopPropagation();
                      setSelectedTextBox(textBox.id);
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      // Allow Ctrl+B for bold, Ctrl+I for italic, Ctrl+U for underline
                      if (e.ctrlKey || e.metaKey) {
                        switch (e.key.toLowerCase()) {
                          case "b":
                            e.preventDefault();
                            updateTextBoxProperty(
                              textBox.id,
                              "bold",
                              !textBox.bold,
                            );
                            break;
                          case "i":
                            e.preventDefault();
                            updateTextBoxProperty(
                              textBox.id,
                              "italic",
                              !textBox.italic,
                            );
                            break;
                          case "u":
                            e.preventDefault();
                            updateTextBoxProperty(
                              textBox.id,
                              "underline",
                              !textBox.underline,
                            );
                            break;
                        }
                      }
                      // Delete text box if empty and backspace is pressed
                      if (e.key === "Backspace" && textBox.text === "") {
                        deleteTextBox(textBox.id);
                      }
                    }}
                    onBlur={() => {
                      // Don't deselect immediately to allow formatting changes
                    }}
                    autoFocus={selectedTextBox === textBox.id}
                    data-oid="ojlr27p"
                  />

                  {selectedTextBox === textBox.id && (
                    <>
                      <button
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTextBox(textBox.id);
                        }}
                        data-oid="5mm87n."
                      >
                        ×
                      </button>
                      <div
                        className="absolute top-1 left-1 text-xs text-blue-600 font-medium pointer-events-none"
                        data-oid="680npx5"
                      >
                        {textBox.text === ""
                          ? "Type to add text"
                          : "Drag blue bar to move"}
                      </div>
                    </>
                  )}
                </div>
              </Resizable>
            ))}
        </div>

        {/* Navigation Controls */}
        <div
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 rounded-lg shadow-lg px-4 py-2 flex items-center space-x-4"
          data-oid="ayd1l2c"
        >
          <button
            onClick={previousPage}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            data-oid="zi50mjz"
          >
            Previous
          </button>

          <span
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            data-oid="e6vdx12"
          >
            Page {currentPage} of {numPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage >= numPages}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            data-oid="n-g_xb5"
          >
            Next
          </button>

          <div className="flex items-center space-x-2" data-oid="yb28a7c">
            <button
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              data-oid="7e9__df"
            >
              -
            </button>
            <span
              className="text-sm text-gray-600 dark:text-gray-400"
              data-oid="r-:.0c1"
            >
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              data-oid="pcfy66k"
            >
              +
            </button>
          </div>

          <button
            onClick={() => setIsTextMode(!isTextMode)}
            className={`px-3 py-1 rounded transition-colors ${
              isTextMode
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
            data-oid="tr10z:t"
          >
            {isTextMode ? "Exit Text Mode" : "Add Text"}
          </button>
        </div>
      </div>
    );
  },
);

InteractiveTextEditor.displayName = "InteractiveTextEditor";

export default InteractiveTextEditor;
