import React, { useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { ScrollArea } from "./ui/scroll-area";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Eye, Copy, Download, FileText, Zap } from "lucide-react";
import { createWorker } from "tesseract.js";

interface OCRResult {
  id: string;
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  page: number;
}

interface OCRProcessorProps {
  pdfDocument?: any;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  currentPage: number;
  onTextDetected?: (results: OCRResult[]) => void;
  onTextBoxCreate?: (x: number, y: number, text: string) => void;
}

export default function OCRProcessor({
  pdfDocument,
  canvasRef,
  currentPage,
  onTextDetected,
  onTextBoxCreate,
}: OCRProcessorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrResults, setOcrResults] = useState<OCRResult[]>([]);
  const [extractedText, setExtractedText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("eng");

  const languages = [
    { code: "eng", name: "English" },
    { code: "spa", name: "Spanish" },
    { code: "fra", name: "French" },
    { code: "deu", name: "German" },
    { code: "chi_sim", name: "Chinese (Simplified)" },
    { code: "jpn", name: "Japanese" },
    { code: "kor", name: "Korean" },
    { code: "rus", name: "Russian" },
    { code: "ara", name: "Arabic" },
    { code: "por", name: "Portuguese" },
  ];

  const extractTextFromPDF = useCallback(async () => {
    if (!pdfDocument) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const page = await pdfDocument.getPage(currentPage);
      const textContent = await page.getTextContent();

      let extractedPageText = "";
      const results: OCRResult[] = [];

      textContent.items.forEach((item: any, index: number) => {
        if (item.str && item.str.trim()) {
          extractedPageText += item.str + " ";

          // Create OCR result for PDF text
          results.push({
            id: `pdf-text-${index}`,
            text: item.str,
            confidence: 100, // PDF text is 100% confident
            bbox: {
              x0: item.transform[4],
              y0: item.transform[5],
              x1: item.transform[4] + item.width,
              y1: item.transform[5] + item.height,
            },
            page: currentPage,
          });
        }
      });

      setExtractedText(extractedPageText.trim());
      setOcrResults(results);
      onTextDetected?.(results);
      setProgress(100);
    } catch (error) {
      console.error("PDF text extraction error:", error);
    } finally {
      setIsProcessing(false);
    }
  }, [pdfDocument, currentPage, onTextDetected]);

  const performOCR = useCallback(async () => {
    if (!canvasRef.current) return;

    setIsProcessing(true);
    setProgress(0);

    try {
      const canvas = canvasRef.current;
      const imageData = canvas.toDataURL("image/png");

      const worker = await createWorker(selectedLanguage);

      await worker.setParameters({
        tessedit_pageseg_mode: "6", // Uniform block of text
        tessedit_char_whitelist:
          "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz .,!?-()[]{}:;\"'",
      });

      const { data } = await worker.recognize(imageData, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(Math.round(m.progress * 100));
          }
        },
      });

      const results: OCRResult[] = data.words
        .filter((word) => word.text.trim() && word.confidence > 30)
        .map((word, index) => ({
          id: `ocr-${index}`,
          text: word.text,
          confidence: word.confidence,
          bbox: word.bbox,
          page: currentPage,
        }));

      setExtractedText(data.text);
      setOcrResults(results);
      onTextDetected?.(results);

      await worker.terminate();
    } catch (error) {
      console.error("OCR processing error:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  }, [canvasRef, currentPage, selectedLanguage, onTextDetected]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(extractedText);
  }, [extractedText]);

  const downloadText = useCallback(() => {
    const blob = new Blob([extractedText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `extracted-text-page-${currentPage}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }, [extractedText, currentPage]);

  const createTextBoxFromResult = useCallback(
    (result: OCRResult) => {
      if (onTextBoxCreate) {
        onTextBoxCreate(result.bbox.x0, result.bbox.y0, result.text);
      }
    },
    [onTextBoxCreate],
  );

  const highlightTextOnCanvas = useCallback(
    (result: OCRResult) => {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Draw highlight rectangle
      ctx.save();
      ctx.fillStyle = "rgba(255, 255, 0, 0.3)";
      ctx.fillRect(
        result.bbox.x0,
        result.bbox.y0,
        result.bbox.x1 - result.bbox.x0,
        result.bbox.y1 - result.bbox.y0,
      );
      ctx.restore();
    },
    [canvasRef],
  );

  return (
    <div className="space-y-4" data-oid="227gtfk">
      {/* OCR Controls */}
      <Card data-oid="zkq-c4n">
        <CardHeader data-oid="ya4g34m">
          <CardTitle className="flex items-center gap-2" data-oid=":6s:ctz">
            <Eye className="h-5 w-5" data-oid=".:q2dxh" />
            Text Recognition
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="29c-kvg">
          <div className="flex items-center gap-2 flex-wrap" data-oid="_9acgl2">
            <Button
              onClick={extractTextFromPDF}
              disabled={isProcessing || !pdfDocument}
              size="sm"
              data-oid="0e2joj-"
            >
              <FileText className="h-4 w-4 mr-1" data-oid="xv7lint" />
              Extract PDF Text
            </Button>

            <Button
              onClick={performOCR}
              disabled={isProcessing || !canvasRef.current}
              size="sm"
              variant="outline"
              data-oid="tfsfx0_"
            >
              <Zap className="h-4 w-4 mr-1" data-oid="80xjm_s" />
              OCR Scan
            </Button>

            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
              disabled={isProcessing}
              data-oid="4.m:po1"
            >
              {languages.map((lang) => (
                <option key={lang.code} value={lang.code} data-oid="zlumii0">
                  {lang.name}
                </option>
              ))}
            </select>

            {ocrResults.length > 0 && (
              <Badge variant="secondary" data-oid="mqus-su">
                {ocrResults.length} text regions found
              </Badge>
            )}
          </div>

          {isProcessing && (
            <div className="space-y-2" data-oid="72jv.1k">
              <Progress
                value={progress}
                className="w-full"
                data-oid="sebnq9w"
              />

              <p className="text-sm text-gray-500" data-oid="w7fovz7">
                {progress > 0 ? `Processing: ${progress}%` : "Initializing..."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Display */}
      {extractedText && (
        <Card data-oid=".k:-7ka">
          <CardHeader data-oid="4wf8uwz">
            <CardTitle
              className="flex items-center justify-between"
              data-oid="i1lv.mn"
            >
              <span data-oid="x-tmh_g">Extracted Text</span>
              <div className="flex gap-2" data-oid="ds-7.w0">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyToClipboard}
                  data-oid="4aqz7jl"
                >
                  <Copy className="h-4 w-4 mr-1" data-oid="8:2ehu:" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={downloadText}
                  data-oid="7ijr-39"
                >
                  <Download className="h-4 w-4 mr-1" data-oid="gl5m-qw" />
                  Download
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent data-oid="6l.x.bv">
            <Textarea
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
              className="min-h-32 font-mono text-sm"
              placeholder="Extracted text will appear here..."
              data-oid="_um7pf9"
            />
          </CardContent>
        </Card>
      )}

      {/* Detected Text Regions */}
      {ocrResults.length > 0 && (
        <Card data-oid="3mradfl">
          <CardHeader data-oid="h83prm_">
            <CardTitle data-oid="xt45ljj">Detected Text Regions</CardTitle>
          </CardHeader>
          <CardContent data-oid="cq2h531">
            <ScrollArea className="h-48" data-oid="zwlhds4">
              <div className="space-y-2" data-oid="1t6pq96">
                {ocrResults.map((result) => (
                  <div
                    key={result.id}
                    className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 dark:hover:bg-gray-800"
                    data-oid="v:huec6"
                  >
                    <div className="flex-1" data-oid="3qs9ca2">
                      <p className="text-sm font-medium" data-oid="ud9n831">
                        {result.text}
                      </p>
                      <p className="text-xs text-gray-500" data-oid="x_k86wo">
                        Confidence: {Math.round(result.confidence)}%
                      </p>
                    </div>
                    <div className="flex gap-1" data-oid="qtzxejl">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => highlightTextOnCanvas(result)}
                        data-oid="yd.z1kq"
                      >
                        Highlight
                      </Button>
                      {onTextBoxCreate && (
                        <Button
                          size="sm"
                          onClick={() => createTextBoxFromResult(result)}
                          data-oid=":tzd8g4"
                        >
                          Add Box
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export type { OCRResult };
