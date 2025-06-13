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
        data-oid="gnwwv8c"
      >
        {/* Font Size */}
        <Select
          value={textBox.fontSize.toString()}
          onValueChange={(value) =>
            updateTextBoxProperty(textBox.id, "fontSize", parseInt(value))
          }
          data-oid="i.wa48n"
        >
          <SelectTrigger className="w-16 h-8" data-oid="hue33y3">
            <SelectValue data-oid="p-ts:ev" />
          </SelectTrigger>
          <SelectContent className="z-[10000]" data-oid="2vk1g:0">
            <SelectItem value="8" data-oid="x9c3f1q">
              8
            </SelectItem>
            <SelectItem value="10" data-oid="bt9o1hz">
              10
            </SelectItem>
            <SelectItem value="12" data-oid="4sztb6i">
              12
            </SelectItem>
            <SelectItem value="14" data-oid="oexs0n_">
              14
            </SelectItem>
            <SelectItem value="16" data-oid="0055u8l">
              16
            </SelectItem>
            <SelectItem value="18" data-oid="nwnhv0p">
              18
            </SelectItem>
            <SelectItem value="20" data-oid="eqs25ye">
              20
            </SelectItem>
            <SelectItem value="24" data-oid="6npuz3w">
              24
            </SelectItem>
            <SelectItem value="28" data-oid="i354:hb">
              28
            </SelectItem>
            <SelectItem value="32" data-oid="wb8a38m">
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
          data-oid="4aeo:0o"
        >
          <SelectTrigger className="w-24 h-8" data-oid=":ojwchb">
            <SelectValue data-oid="yeknzpx" />
          </SelectTrigger>
          <SelectContent className="z-[10000]" data-oid=":29l068">
            <SelectItem value="Arial" data-oid="y19o5it">
              Arial
            </SelectItem>
            <SelectItem value="Helvetica" data-oid="qqcea-y">
              Helvetica
            </SelectItem>
            <SelectItem value="Times New Roman" data-oid="1c0wk:7">
              Times
            </SelectItem>
            <SelectItem value="Courier New" data-oid="ejmeznk">
              Courier
            </SelectItem>
            <SelectItem value="Georgia" data-oid="i2i4f.z">
              Georgia
            </SelectItem>
            <SelectItem value="Verdana" data-oid=":uvcbld">
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
          data-oid=".g52:vo"
        >
          <Bold className="h-4 w-4" data-oid="iez6h.7" />
        </Button>

        {/* Italic */}
        <Button
          variant={textBox.italic ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() =>
            updateTextBoxProperty(textBox.id, "italic", !textBox.italic)
          }
          data-oid="bk01h94"
        >
          <Italic className="h-4 w-4" data-oid="1oyi4:o" />
        </Button>

        {/* Underline */}
        <Button
          variant={textBox.underline ? "default" : "outline"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={() =>
            updateTextBoxProperty(textBox.id, "underline", !textBox.underline)
          }
          data-oid="trv4:rg"
        >
          <Underline className="h-4 w-4" data-oid="stf7oa1" />
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
          data-oid="38hph-y"
        />

        {/* Alignment */}
        <div className="flex" data-oid="5fs5nlm">
          <Button
            variant={textBox.alignment === "left" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 rounded-r-none"
            onClick={() =>
              updateTextBoxProperty(textBox.id, "alignment", "left")
            }
            data-oid="78pzuyt"
          >
            <AlignLeft className="h-4 w-4" data-oid="z6-e7h0" />
          </Button>
          <Button
            variant={textBox.alignment === "center" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 rounded-none border-x-0"
            onClick={() =>
              updateTextBoxProperty(textBox.id, "alignment", "center")
            }
            data-oid="g8eulpk"
          >
            <AlignCenter className="h-4 w-4" data-oid="j8-dt1b" />
          </Button>
          <Button
            variant={textBox.alignment === "right" ? "default" : "outline"}
            size="sm"
            className="h-8 w-8 p-0 rounded-l-none"
            onClick={() =>
              updateTextBoxProperty(textBox.id, "alignment", "right")
            }
            data-oid="-69z3z8"
          >
            <AlignRight className="h-4 w-4" data-oid="mop-s_9" />
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
        data-oid="j5gys3o"
      >
        {/* Undo/Redo Controls */}
        <div
          className="absolute top-4 left-4 flex gap-2 z-50"
          data-oid="4f4cfz3"
        >
          <Button
            variant="outline"
            size="sm"
            onClick={undo}
            disabled={historyIndex <= 0}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg"
            data-oid="l03qwy4"
          >
            <Undo className="w-4 h-4" data-oid="xwj0.tv" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={redo}
            disabled={historyIndex >= editHistory.length - 1}
            className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 shadow-lg"
            data-oid="msn-h1j"
          >
            <Redo className="w-4 h-4" data-oid="3--rtdu" />
          </Button>
        </div>

        {/* Text Mode Indicator */}
        {isTextMode && (
          <div
            className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
            data-oid="nz0kkum"
          >
            Click anywhere on the document to add text
          </div>
        )}

        {/* Eraser Mode Indicator */}
        {isEraserMode && (
          <div
            className="absolute top-16 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg z-50"
            data-oid="82f_89j"
          >
            Eraser Mode Active - Click and drag to erase content
          </div>
        )}

        {/* PDF Canvas */}
        <div className="relative" data-oid="jk93l:o">
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
            data-oid="p6vtt:0"
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
                data-oid="lq84ugx"
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
                  data-oid="dmew4k2"
                >
                  {/* Formatting Toolbar */}
                  {selectedTextBox === textBox.id && (
                    <FontFormattingToolbar
                      textBox={textBox}
                      data-oid="khuksjo"
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
                    data-oid="phs1wss"
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
                    data-oid="a-bfw0-"
                  />

                  {selectedTextBox === textBox.id && (
                    <>
                      <button
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTextBox(textBox.id);
                        }}
                        data-oid="bc:micn"
                      >
                        ×
                      </button>
                      <div
                        className="absolute top-1 left-1 text-xs text-blue-600 font-medium pointer-events-none"
                        data-oid="1t_kg8o"
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
          data-oid="e3dw7gn"
        >
          <button
            onClick={previousPage}
            disabled={currentPage <= 1}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            data-oid="9cq4yzz"
          >
            Previous
          </button>

          <span
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
            data-oid="o:cy0zq"
          >
            Page {currentPage} of {numPages}
          </span>

          <button
            onClick={nextPage}
            disabled={currentPage >= numPages}
            className="px-3 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
            data-oid="m8yru76"
          >
            Next
          </button>

          <div className="flex items-center space-x-2" data-oid="raagink">
            <button
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              data-oid="kdflwhb"
            >
              -
            </button>
            <span
              className="text-sm text-gray-600 dark:text-gray-400"
              data-oid="fhr-h29"
            >
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
              className="px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
              data-oid="1tv0im4"
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
            data-oid="qy8i:q-"
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
