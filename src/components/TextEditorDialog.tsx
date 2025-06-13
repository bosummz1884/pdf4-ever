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
    <Dialog open={isVisible} onOpenChange={onClose} data-oid="lfac57p">
      <DialogContent className="sm:max-w-[600px]" data-oid="2w62m-7">
        <DialogHeader data-oid="npurnpc">
          <DialogTitle className="flex items-center gap-2" data-oid="t644eqj">
            <Type className="h-5 w-5" data-oid="jt6.9bm" />
            Add Text to PDF
          </DialogTitle>
          <DialogDescription data-oid="vfx2.v2">
            Enter your text and customize its appearance. The text will be added
            to the current page.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4" data-oid="hy9dwcy">
          {/* Text Input */}
          <div className="grid gap-2" data-oid="h7vzd23">
            <Label htmlFor="text-input" data-oid="gbasmrk">
              Text Content
            </Label>
            <Textarea
              id="text-input"
              placeholder="Enter the text you want to add..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-[80px]"
              data-oid="q8otxk-"
            />
          </div>

          {/* Font Settings Row */}
          <div
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            data-oid="s5_vhyr"
          >
            <div className="grid gap-2" data-oid="4ypneyq">
              <Label htmlFor="font-family" data-oid="yo-85a2">
                Font Family
              </Label>
              <Select value={font} onValueChange={setFont} data-oid="0jd0849">
                <SelectTrigger data-oid="935cnxl">
                  <SelectValue data-oid="e8j_zsd" />
                </SelectTrigger>
                <SelectContent data-oid="yry3meu">
                  {availableFonts.map((fontName) => (
                    <SelectItem
                      key={fontName}
                      value={fontName}
                      data-oid="0yk48hj"
                    >
                      {fontName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2" data-oid="4ekg7_2">
              <Label htmlFor="font-size" data-oid="y-ujvry">
                Font Size
              </Label>
              <Select
                value={fontSize}
                onValueChange={setFontSize}
                data-oid="_bu7ks1"
              >
                <SelectTrigger data-oid="paqcyn3">
                  <SelectValue data-oid="abbkwhq" />
                </SelectTrigger>
                <SelectContent data-oid="ntm0yjd">
                  {fontSizes.map((size) => (
                    <SelectItem key={size} value={size} data-oid=":bfc3-0">
                      {size}px
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2" data-oid="xhx0pxk">
              <Label htmlFor="text-color" data-oid="sx.zk62">
                Text Color
              </Label>
              <div className="flex items-center gap-2" data-oid="-uc1.5c">
                <Input
                  id="text-color"
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-16 h-10 p-1 border rounded"
                  data-oid="pd:4p65"
                />

                <Input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="flex-1"
                  placeholder="#000000"
                  data-oid="x1znj7c"
                />
              </div>
            </div>
          </div>

          {/* Style Options */}
          <div className="grid gap-2" data-oid="-huk6vd">
            <Label data-oid="2_5qf:i">Text Style</Label>
            <div className="flex items-center gap-2" data-oid=".:l.6v0">
              <Button
                type="button"
                variant={isBold ? "default" : "outline"}
                size="sm"
                onClick={() => setIsBold(!isBold)}
                className="flex items-center gap-2"
                data-oid="vp.822t"
              >
                <Bold className="h-4 w-4" data-oid="b1lfmwn" />
                Bold
              </Button>
              <Button
                type="button"
                variant={isItalic ? "default" : "outline"}
                size="sm"
                onClick={() => setIsItalic(!isItalic)}
                className="flex items-center gap-2"
                data-oid="lj57tib"
              >
                <Italic className="h-4 w-4" data-oid="38t52c." />
                Italic
              </Button>
            </div>
          </div>

          {/* Alignment Options */}
          <div className="grid gap-2" data-oid="o5bwcpn">
            <Label data-oid="d3s5mcb">Text Alignment</Label>
            <div className="flex items-center gap-2" data-oid="9.lmuq-">
              <Button
                type="button"
                variant={alignment === "left" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlignment("left")}
                data-oid="uz-ua9c"
              >
                <AlignLeft className="h-4 w-4" data-oid="0xbex11" />
              </Button>
              <Button
                type="button"
                variant={alignment === "center" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlignment("center")}
                data-oid="uswd3o0"
              >
                <AlignCenter className="h-4 w-4" data-oid="jqgxuvz" />
              </Button>
              <Button
                type="button"
                variant={alignment === "right" ? "default" : "outline"}
                size="sm"
                onClick={() => setAlignment("right")}
                data-oid=".q.l61l"
              >
                <AlignRight className="h-4 w-4" data-oid=".ehewv9" />
              </Button>
            </div>
          </div>

          {/* Preview */}
          <div className="grid gap-2" data-oid="_0b3aaw">
            <Label data-oid="qojyblm">Preview</Label>
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
              data-oid="evb35-0"
            >
              {text || "Sample text preview..."}
            </div>
          </div>
        </div>

        <DialogFooter data-oid="juzeha-">
          <Button variant="outline" onClick={onClose} data-oid="ay5kv_f">
            <X className="h-4 w-4 mr-2" data-oid="hz0.:f8" />
            Cancel
          </Button>
          <Button
            onClick={handleAddText}
            disabled={!text.trim()}
            data-oid="uay.iew"
          >
            <Save className="h-4 w-4 mr-2" data-oid="p4tn9p-" />
            Add Text
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
