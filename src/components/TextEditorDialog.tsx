import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import "pdfjs-dist/web/pdf_viewer.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Type,
  Palette,
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Save,
  X,
} from "lucide-react";

interface TextEditorDialogProps {
  isVisible: boolean;
  onClose: () => void;
  onTextAdd: (textData: any) => void;
  selectedFont?: string;
  selectedFontSize?: string;
  selectedColor?: string;
}

export default function TextEditorDialog({
  isVisible = false,
  onClose = () => {},
  onTextAdd = () => {},
  selectedFont = "Arial",
  selectedFontSize = "12",
  selectedColor = "#000000",
}: TextEditorDialogProps) {
  const [text, setText] = useState("");
  const [font, setFont] = useState(selectedFont);
  const [fontSize, setFontSize] = useState(selectedFontSize);
  const [color, setColor] = useState(selectedColor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [alignment, setAlignment] = useState("left");

  const handleAddText = () => {
    if (text.trim()) {
      const textData = {
        text: text.trim(),
        font: font,
        size: parseInt(fontSize),
        color: color,
        bold: isBold,
        italic: isItalic,
        alignment: alignment,
        x: 100, // Default position
        y: 100, // Default position
      };

      console.log("Adding text:", textData);
      onTextAdd(textData);

      // Reset form
      setText("");
      setFont(selectedFont);
      setFontSize(selectedFontSize);
      setColor(selectedColor);
      setIsBold(false);
      setIsItalic(false);
      setAlignment("left");

      onClose();
    }
  };

  const availableFonts = [
    "Arial",
    "Helvetica",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Verdana",
    "Comic Sans MS",
    "Impact",
  ];

  const fontSizes = [
    "8",
    "9",
    "10",
    "11",
    "12",
    "14",
    "16",
    "18",
    "20",
    "22",
    "24",
    "26",
    "28",
    "32",
    "36",
    "48",
    "72",
  ];

  if (!isVisible) return null;

  return (
    <Dialog open={isVisible} onOpenChange={onClose} data-oid="h5ye7le">
      <DialogContent className="sm:max-w-[600px]" data-oid="96etbts">
        <DialogHeader data-oid="xmar_op">
          <DialogTitle className="flex items-center gap-2" data-oid="ocu.i5p">
            <Type className="h-5 w-5" data-oid="1649mo9" />
            Add Text to PDF
          </DialogTitle>
          <DialogDescription data-oid="pwm-q:7">
            Enter your text and customize its appearance. The text will be added
            to the current page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4" data-oid="j0-qmgt">
          {/* Text Input */}
          <div className="grid gap-2" data-oid="5g7m873">
            <Label htmlFor="text-input" data-oid="w3olenl">
              Text Content
            </Label>
            <Textarea
              id="text-input"
              placeholder="Enter the text you want to add..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[80px]"
              data-oid="zrgrma1"
            />
          </div>

          {/* Font Settings Row */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            data-oid="c7vveww"
          >
            <div className="grid gap-2" data-oid="s28626b">
              <Label htmlFor="font-family" data-oid="moog5v2">
                Font Family
              </Label>
              <Select value={font} onValueChange={setFont} data-oid="ofimsm.">
                <SelectTrigger data-oid="oy9gwmb">
                  <SelectValue data-oid="qr9cn7l" />
                </SelectTrigger>
                <SelectContent data-oid="mg1wvxn">
                  {availableFonts.map((fontName) => (
                    <SelectItem
                      key={fontName}
                      value={fontName}
                      data-oid="mcm2buu"
                    >
                      {fontName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2" data-oid="-u41wy8">
              <Label htmlFor="font-size" data-oid="idbfspl">
                Font Size
              </Label>
              <Select
                value={fontSize}
                onValueChange={setFontSize}
                data-oid="5e73mjb"
              >
                <SelectTrigger data-oid="9i5gojo">
                  <SelectValue data-oid="b_y0goo" />
                </SelectTrigger>
                <SelectContent data-oid="ic0f-7k">
                  {fontSizes.map((size) => (
                    <SelectItem key={size} value={size} data-oid="9hxdq8t">
                      {size}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2" data-oid="totx289">
              <Label htmlFor="text-color" data-oid="qhqup8b">
                Text Color
              </Label>
              <div className="flex items-center gap-2" data-oid="oao3_oo">
                <Input
                  id="text-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                  data-oid="wj:81vo"
                />

                <Input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1"
                  placeholder="#000000"
                  data-oid="s46d6do"
                />
              </div>
            </div>
          </div>

          {/* Style Options */}
          <div className="grid gap-2" data-oid="7cimaos">
            <Label data-oid="0j2o2eu">Text Style</Label>
            <div className="flex items-center gap-2" data-oid=":ej00m4">
              <Button
                type="button"
                variant={isBold ? "default" : "outline"}
                size="sm"
                onClick={() => setIsBold(!isBold)}
                className="flex items-center gap-2"
                data-oid="8ql-5wn"
              >
                <Bold className="h-4 w-4" data-oid="1xvvox6" />
                Bold
              </Button>
              <Button
                type="button"
                variant={isItalic ? "default" : "outline"}
                size="sm"
                onClick={() => setIsItalic(!isItalic)}
                className="flex items-center gap-2"
                data-oid=".st_1ll"
              >
                <Italic className="h-4 w-4" data-oid="da7_-3x" />
                Italic
              </Button>
            </div>
          </div>

          {/* Alignment Options */}
          <div className="grid gap-2" data-oid="nlqct88">
            <Label data-oid="dil9rag">Text Alignment</Label>
            <div className="flex items-center gap-2" data-oid="izgtbgb">
              <Button
                type="button"
                variant={alignment === "left" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlignment("left")}
                data-oid="8.17v72"
              >
                <AlignLeft className="h-4 w-4" data-oid="ijuu:64" />
              </Button>
              <Button
                type="button"
                variant={alignment === "center" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlignment("center")}
                data-oid="we_fxak"
              >
                <AlignCenter className="h-4 w-4" data-oid="3cu9jh6" />
              </Button>
              <Button
                type="button"
                variant={alignment === "right" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlignment("right")}
                data-oid="07chc4i"
              >
                <AlignRight className="h-4 w-4" data-oid="lsbaa_." />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="grid gap-2" data-oid="ogvoj7c">
            <Label data-oid="g48j0c7">Preview</Label>
            <div
              className="p-4 border rounded-lg bg-muted/50"
              style={{
                fontFamily: font,
                fontSize: `${fontSize}px`,
                color: color,
                fontWeight: isBold ? "bold" : "normal",
                fontStyle: isItalic ? "italic" : "normal",
                textAlign: alignment as any,
              }}
              data-oid="bs8peo7"
            >
              {text || "Sample text preview..."}
            </div>
          </div>
        </div>

        <DialogFooter data-oid="t6.zz9c">
          <Button variant="outline" onClick={onClose} data-oid="sm3u.os">
            <X className="h-4 w-4 mr-2" data-oid="a-y1u1-" />
            Cancel
          </Button>
          <Button
            onClick={handleAddText}
            disabled={!text.trim()}
            data-oid="uspj79c"
          >
            <Save className="h-4 w-4 mr-2" data-oid="ir::7c9" />
            Add Text
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
