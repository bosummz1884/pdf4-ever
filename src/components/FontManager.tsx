import React, { useState, useEffect, useCallback } from "react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Type, Download, Eye, Search } from "lucide-react";

interface FontInfo {
  name: string;
  family: string;
  style: string;
  weight: string;
  size?: number;
  variants?: string[];
  loaded: boolean;
}

interface FontManagerProps {
  selectedFont: string;
  onFontChange: (font: string) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
  fontWeight: "normal" | "bold";
  onFontWeightChange: (weight: "normal" | "bold") => void;
  fontStyle: "normal" | "italic";
  onFontStyleChange: (style: "normal" | "italic") => void;
  showAdvanced?: boolean;
}

export default function FontManager({
  selectedFont,
  onFontChange,
  fontSize,
  onFontSizeChange,
  fontWeight,
  onFontWeightChange,
  fontStyle,
  onFontStyleChange,
  showAdvanced = false,
}: FontManagerProps) {
  const [availableFonts, setAvailableFonts] = useState<FontInfo[]>([]);
  const [loadingFonts, setLoadingFonts] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [fontPreview, setFontPreview] = useState(
    "The quick brown fox jumps over the lazy dog",
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Standard PDF-safe fonts
  const standardFonts: FontInfo[] = [
    {
      name: "Helvetica",
      family: "Helvetica",
      style: "normal",
      weight: "normal",
      loaded: true,
    },
    {
      name: "Times-Roman",
      family: "Times",
      style: "normal",
      weight: "normal",
      loaded: true,
    },
    {
      name: "Courier",
      family: "Courier",
      style: "normal",
      weight: "normal",
      loaded: true,
    },
    {
      name: "Arial",
      family: "Arial",
      style: "normal",
      weight: "normal",
      loaded: true,
    },
    {
      name: "Georgia",
      family: "Georgia",
      style: "normal",
      weight: "normal",
      loaded: true,
    },
    {
      name: "Verdana",
      family: "Verdana",
      style: "normal",
      weight: "normal",
      loaded: true,
    },
  ];

  // Google Fonts list (most popular)
  const googleFonts = [
    "Open Sans",
    "Roboto",
    "Lato",
    "Montserrat",
    "Source Sans Pro",
    "Raleway",
    "Ubuntu",
    "Nunito",
    "Poppins",
    "Merriweather",
    "Playfair Display",
    "Oswald",
    "Mukti",
    "Fira Sans",
    "Work Sans",
    "Libre Baskerville",
    "Crimson Text",
    "Lora",
    "PT Sans",
    "Noto Sans",
  ];

  const loadGoogleFont = useCallback(async (fontName: string) => {
    try {
      const link = document.createElement("link");
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(/\s+/g, "+")}:wght@300;400;500;600;700&display=swap`;
      link.rel = "stylesheet";
      document.head.appendChild(link);

      // Wait for font to load
      await new Promise((resolve) => {
        const observer = new FontFaceObserver(fontName);
        observer.load().then(resolve).catch(resolve);
      });

      return true;
    } catch (error) {
      console.warn(`Failed to load font: ${fontName}`, error);
      return false;
    }
  }, []);

  const loadFonts = useCallback(async () => {
    setLoadingFonts(true);
    setLoadProgress(0);

    const fonts: FontInfo[] = [...standardFonts];

    for (let i = 0; i < googleFonts.length; i++) {
      const fontName = googleFonts[i];
      setLoadProgress((i / googleFonts.length) * 100);

      const loaded = await loadGoogleFont(fontName);
      fonts.push({
        name: fontName,
        family: fontName,
        style: "normal",
        weight: "normal",
        loaded,
        variants: ["300", "400", "500", "600", "700"],
      });
    }

    setAvailableFonts(fonts);
    setLoadingFonts(false);
    setLoadProgress(100);
  }, [loadGoogleFont, standardFonts]);

  useEffect(() => {
    // Initialize with standard fonts
    setAvailableFonts(standardFonts);
  }, []);

  const detectUsedFonts = useCallback(async (pdfDocument: any) => {
    if (!pdfDocument) return [];

    const detectedFonts: FontInfo[] = [];

    try {
      const numPages = pdfDocument.numPages;

      for (let i = 1; i <= numPages; i++) {
        const page = await pdfDocument.getPage(i);
        const textContent = await page.getTextContent();

        textContent.items.forEach((item: any) => {
          if (item.fontName) {
            const existing = detectedFonts.find(
              (f) => f.name === item.fontName,
            );
            if (!existing) {
              detectedFonts.push({
                name: item.fontName,
                family: item.fontName,
                style: "normal",
                weight: "normal",
                loaded: false,
              });
            }
          }
        });
      }
    } catch (error) {
      console.error("Font detection error:", error);
    }

    return detectedFonts;
  }, []);

  const matchFont = useCallback(
    (targetFont: string) => {
      // Try exact match first
      let match = availableFonts.find(
        (f) =>
          f.name.toLowerCase() === targetFont.toLowerCase() ||
          f.family.toLowerCase() === targetFont.toLowerCase(),
      );

      if (match) return match.name;

      // Try partial match
      match = availableFonts.find(
        (f) =>
          f.name.toLowerCase().includes(targetFont.toLowerCase()) ||
          targetFont.toLowerCase().includes(f.name.toLowerCase()),
      );

      if (match) return match.name;

      // Fallback mapping
      const fallbacks: { [key: string]: string } = {
        times: "Times-Roman",
        helvetica: "Helvetica",
        courier: "Courier",
        arial: "Arial",
        "sans-serif": "Helvetica",
        serif: "Times-Roman",
        monospace: "Courier",
      };

      const fallback = fallbacks[targetFont.toLowerCase()];
      return fallback || "Helvetica";
    },
    [availableFonts],
  );

  const filteredFonts = availableFonts.filter(
    (font) =>
      font.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      font.family.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const selectedFontInfo = availableFonts.find((f) => f.name === selectedFont);

  return (
    <div className="space-y-4" data-oid="jgvea.q">
      {/* Font Selection */}
      <div className="flex items-center gap-2 flex-wrap" data-oid="i6kewe.">
        <Select
          value={selectedFont}
          onValueChange={onFontChange}
          data-oid="gamr-qx"
        >
          <SelectTrigger className="w-48" data-oid="mqru4ru">
            <SelectValue placeholder="Select font" data-oid="b92.p0g" />
          </SelectTrigger>
          <SelectContent className="max-h-60" data-oid="bb2654y">
            {filteredFonts.map((font) => (
              <SelectItem key={font.name} value={font.name} data-oid="rr5a2qf">
                <div className="flex items-center gap-2" data-oid="sgjpica">
                  <span style={{ fontFamily: font.family }} data-oid="vzhwu1l">
                    {font.name}
                  </span>
                  {!font.loaded && (
                    <Badge
                      variant="outline"
                      className="text-xs"
                      data-oid="8l.5.e4"
                    >
                      Not loaded
                    </Badge>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="number"
          value={fontSize}
          onChange={(e) => onFontSizeChange(Number(e.target.value))}
          className="w-20"
          min={8}
          max={144}
          placeholder="Size"
          data-oid="8vezap8"
        />

        <Button
          variant={fontWeight === "bold" ? "default" : "outline"}
          size="sm"
          onClick={() =>
            onFontWeightChange(fontWeight === "bold" ? "normal" : "bold")
          }
          data-oid="bt3..nv"
        >
          <strong data-oid="kdrur78">B</strong>
        </Button>

        <Button
          variant={fontStyle === "italic" ? "default" : "outline"}
          size="sm"
          onClick={() =>
            onFontStyleChange(fontStyle === "italic" ? "normal" : "italic")
          }
          data-oid="0ar12vl"
        >
          <em data-oid=".u6xdei">I</em>
        </Button>

        {!loadingFonts && (
          <Button
            variant="outline"
            size="sm"
            onClick={loadFonts}
            data-oid="37z6kjx"
          >
            <Download className="h-4 w-4 mr-1" data-oid="ylz70f:" />
            Load More Fonts
          </Button>
        )}
      </div>

      {/* Loading Progress */}
      {loadingFonts && (
        <div className="space-y-2" data-oid="8idt:88">
          <Progress value={loadProgress} data-oid="t4aww4." />
          <p className="text-sm text-gray-500" data-oid="3inc7id">
            Loading fonts... {Math.round(loadProgress)}%
          </p>
        </div>
      )}

      {/* Advanced Controls */}
      {showAdvanced && (
        <Card data-oid="wcxby-3">
          <CardHeader data-oid="f7_6:u1">
            <CardTitle className="flex items-center gap-2" data-oid="6-2h1k.">
              <Type className="h-5 w-5" data-oid="k3fjk70" />
              Font Tools
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4" data-oid="28ke:1g">
            {/* Font Search */}
            <div className="relative" data-oid="qr0ap:y">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                data-oid="65ojjng"
              />

              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search fonts..."
                className="pl-10"
                data-oid="tdi0cu9"
              />
            </div>

            {/* Font Preview */}
            <div className="space-y-2" data-oid="zrw8.yg">
              <label className="text-sm font-medium" data-oid="-e4m2xg">
                Preview Text:
              </label>
              <Input
                value={fontPreview}
                onChange={(e) => setFontPreview(e.target.value)}
                placeholder="Enter preview text..."
                data-oid=".ytn2g9"
              />

              {selectedFontInfo && (
                <div
                  className="p-4 border rounded bg-white dark:bg-gray-900"
                  style={{
                    fontFamily: selectedFontInfo.family,
                    fontSize: `${fontSize}px`,
                    fontWeight: fontWeight,
                    fontStyle: fontStyle,
                  }}
                  data-oid="s6xy7bd"
                >
                  {fontPreview}
                </div>
              )}
            </div>

            {/* Font Info */}
            {selectedFontInfo && (
              <div className="space-y-2 text-sm" data-oid="v7v.h30">
                <h4 className="font-medium" data-oid="7iwhr9r">
                  Font Information:
                </h4>
                <div className="grid grid-cols-2 gap-2" data-oid=":2mgrap">
                  <div data-oid=":v2umlp">
                    <span className="text-gray-500" data-oid="up52to3">
                      Family:
                    </span>{" "}
                    {selectedFontInfo.family}
                  </div>
                  <div data-oid="e59hm42">
                    <span className="text-gray-500" data-oid="wouep-x">
                      Style:
                    </span>{" "}
                    {selectedFontInfo.style}
                  </div>
                  <div data-oid="a9e:3:w">
                    <span className="text-gray-500" data-oid=".-u79r_">
                      Weight:
                    </span>{" "}
                    {selectedFontInfo.weight}
                  </div>
                  <div data-oid="wzc26uw">
                    <span className="text-gray-500" data-oid="wwuc9v7">
                      Status:
                    </span>
                    <Badge
                      variant={
                        selectedFontInfo.loaded ? "default" : "secondary"
                      }
                      className="ml-2"
                      data-oid="ad3u3dg"
                    >
                      {selectedFontInfo.loaded ? "Loaded" : "Not Loaded"}
                    </Badge>
                  </div>
                </div>

                {selectedFontInfo.variants && (
                  <div data-oid="llnmqya">
                    <span className="text-gray-500" data-oid="05qa8b2">
                      Available weights:
                    </span>
                    <div className="flex gap-1 mt-1" data-oid=".ndpc.0">
                      {selectedFontInfo.variants.map((variant) => (
                        <Badge
                          key={variant}
                          variant="outline"
                          className="text-xs"
                          data-oid="khl5:vs"
                        >
                          {variant}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Font Statistics */}
            <div className="text-sm text-gray-500" data-oid="fws5sj6">
              <p data-oid="-w8z8zq">Available fonts: {availableFonts.length}</p>
              <p data-oid="gofj9kt">
                Loaded fonts: {availableFonts.filter((f) => f.loaded).length}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// FontFaceObserver polyfill for older browsers
class FontFaceObserver {
  family: string;

  constructor(family: string) {
    this.family = family;
  }

  load() {
    return new Promise((resolve, reject) => {
      const testString = "BESbswy";
      const timeout = 3000;
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) {
        reject(new Error("Canvas context not available"));
        return;
      }

      // Measure with fallback font
      context.font = `12px monospace`;
      const fallbackWidth = context.measureText(testString).width;

      // Measure with target font
      context.font = `12px "${this.family}", monospace`;

      const startTime = Date.now();

      const check = () => {
        const currentWidth = context.measureText(testString).width;

        if (currentWidth !== fallbackWidth) {
          resolve(true);
        } else if (Date.now() - startTime > timeout) {
          reject(new Error("Font load timeout"));
        } else {
          setTimeout(check, 50);
        }
      };

      check();
    });
  }
}

export type { FontInfo };
