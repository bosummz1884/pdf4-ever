import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  ScanText,
  Copy,
  Download,
  FileText,
  Search,
  Languages,
  Zap,
  CheckCircle,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { createWorker, Worker } from "tesseract.js";

interface TextRegion {
  id: string;
  text: string;
  confidence: number;
  bbox: {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
  };
  words: Array<{
    text: string;
    confidence: number;
    bbox: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
    };
  }>;
}

interface OCRResult {
  text: string;
  confidence: number;
  regions: TextRegion[];
  language: string;
  processingTime: number;
}

interface OCRTextExtractorProps {
  imageData?: string | HTMLCanvasElement;
  onTextExtracted?: (result: OCRResult) => void;
  languages?: string[];
}

export function OCRTextExtractor({
  imageData,
  onTextExtracted,
  languages = ["eng"],
}: OCRTextExtractorProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [ocrResult, setOcrResult] = useState<OCRResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedLanguages, setSelectedLanguages] =
    useState<string[]>(languages);
  const [searchTerm, setSearchTerm] = useState("");
  const [highlightedText, setHighlightedText] = useState<string[]>([]);

  const workerRef = useRef<Worker | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const supportedLanguages = [
    { code: "eng", name: "English" },
    { code: "spa", name: "Spanish" },
    { code: "fra", name: "French" },
    { code: "deu", name: "German" },
    { code: "ita", name: "Italian" },
    { code: "por", name: "Portuguese" },
    { code: "rus", name: "Russian" },
    { code: "jpn", name: "Japanese" },
    { code: "chi_sim", name: "Chinese (Simplified)" },
    { code: "chi_tra", name: "Chinese (Traditional)" },
    { code: "ara", name: "Arabic" },
    { code: "hin", name: "Hindi" },
    { code: "kor", name: "Korean" },
    { code: "tha", name: "Thai" },
    { code: "vie", name: "Vietnamese" },
  ];

  const initializeWorker = async () => {
    if (workerRef.current) {
      await workerRef.current.terminate();
    }

    const worker = await createWorker();
    workerRef.current = worker;

    // Load languages
    const langString = selectedLanguages.join("+");
    await worker.loadLanguage(langString);
    await worker.initialize(langString);

    // Configure OCR parameters for better accuracy
    await worker.setParameters({
      tessedit_char_whitelist:
        "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz !@#$%^&*()_+-=[]{}|;:,.<>?`~\"'",
      tessedit_pageseg_mode: "1", // Automatic page segmentation with OSD
      preserve_interword_spaces: "1",
    });

    return worker;
  };

  const extractTextFromImage = async (
    imageSource: string | HTMLCanvasElement,
  ) => {
    try {
      setIsProcessing(true);
      setProgress(0);
      setError(null);
      setOcrResult(null);

      const startTime = Date.now();

      // Set up progress tracking
      worker.setParameters({
        tessedit_create_hocr: "1",
        tessedit_create_tsv: "1",
      });

      setProgress(25);

      // Perform OCR
      const { data } = await worker.recognize(imageSource, {
        logger: (m) => {
          if (m.status === "recognizing text") {
            setProgress(25 + m.progress * 0.7 * 100);
          }
        },
      });

      setProgress(95);

      // Process results
      const processingTime = Date.now() - startTime;

      // Extract regions with bounding boxes
      const regions: TextRegion[] =
        data.paragraphs
          ?.map((para, index) => ({
            id: `region_${index}`,
            text: para.text.trim(),
            confidence: para.confidence,
            bbox: para.bbox,
            words:
              para.words?.map((word) => ({
                text: word.text,
                confidence: word.confidence,
                bbox: word.bbox,
              })) || [],
          }))
          .filter((region) => region.text.length > 0) || [];

      const result: OCRResult = {
        text: data.text.trim(),
        confidence: data.confidence,
        regions,
        language: selectedLanguages.join("+"),
        processingTime,
      };

      setOcrResult(result);
      onTextExtracted?.(result);
      setProgress(100);

      // Clean up
      setTimeout(() => {
        setIsProcessing(false);
        setProgress(0);
      }, 500);
    } catch (err) {
      console.error("OCR Error:", err);
      setError(err instanceof Error ? err.message : "OCR processing failed");
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const processCurrentImage = async () => {
    if (!imageData) {
      setError("No image data provided");
      return;
    }

    await extractTextFromImage(imageData);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const downloadText = (
    text: string,
    filename: string = "extracted_text.txt",
  ) => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const searchInText = (term: string) => {
    if (!ocrResult || !term.trim()) {
      setHighlightedText([]);
      return;
    }

    const matches = ocrResult.text.match(new RegExp(term, "gi")) || [];
    setHighlightedText(matches);
  };

  const highlightText = (text: string) => {
    if (!searchTerm || highlightedText.length === 0) {
      return text;
    }

    return text.replace(
      new RegExp(`(${searchTerm})`, "gi"),
      '<mark class="bg-yellow-200 dark:bg-yellow-800">$1</mark>',
    );
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 80) return "text-green-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 80)
      return (
        <CheckCircle className="h-4 w-4 text-green-600" data-oid="hdlsq6e" />
      );

    if (confidence >= 60)
      return (
        <AlertTriangle className="h-4 w-4 text-yellow-600" data-oid="19ei3v7" />
      );

    return <XCircle className="h-4 w-4 text-red-600" data-oid="nl2umnw" />;
  };

  return (
    <div className="space-y-4" data-oid="qn3luym">
      <Card data-oid="-59lkf6">
        <CardHeader data-oid="e3osz44">
          <CardTitle className="flex items-center gap-2" data-oid="wvkmpp8">
            <ScanText className="h-5 w-5" data-oid="w.ho422" />
            OCR Text Extraction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="mxz1ulg">
          {/* Language Selection */}
          <div className="space-y-2" data-oid="uxwc2qj">
            <label className="text-sm font-medium" data-oid="057jd.n">
              Languages
            </label>
            <div className="flex flex-wrap gap-2" data-oid="9qz.fig">
              {supportedLanguages.slice(0, 6).map((lang) => (
                <Badge
                  key={lang.code}
                  variant={
                    selectedLanguages.includes(lang.code)
                      ? "default"
                      : "outline"
                  }
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedLanguages((prev) =>
                      prev.includes(lang.code)
                        ? prev.filter((l) => l !== lang.code)
                        : [...prev, lang.code],
                    );
                  }}
                  data-oid="i2h-qme"
                >
                  {lang.name}
                </Badge>
              ))}
            </div>
          </div>

          {/* Process Button */}
          <Button
            onClick={processCurrentImage}
            disabled={isProcessing || !imageData}
            className="w-full"
            data-oid="oiwy2qh"
          >
            {isProcessing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" data-oid="op:.g8d" />
                Processing...
              </>
            ) : (
              <>
                <ScanText className="h-4 w-4 mr-2" data-oid="iqeh.kr" />
                Extract Text
              </>
            )}
          </Button>

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2" data-oid=".w:wzgp">
              <Progress
                value={progress}
                className="w-full"
                data-oid="-qqld-4"
              />

              <p
                className="text-sm text-gray-600 text-center"
                data-oid="qtyxhv0"
              >
                {progress < 25
                  ? "Initializing..."
                  : progress < 95
                    ? "Recognizing text..."
                    : "Finalizing..."}
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div
              className="p-3 bg-red-50 border border-red-200 rounded-md"
              data-oid="-_b8:nh"
            >
              <p className="text-sm text-red-700" data-oid="1:8.j6a">
                {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {ocrResult && (
        <Card data-oid="b8eicg.">
          <CardHeader data-oid="4xhh679">
            <CardTitle
              className="flex items-center justify-between"
              data-oid="ces0u_w"
            >
              <span data-oid="q1b5_cm">Extraction Results</span>
              <div className="flex items-center gap-2" data-oid="m3up1vg">
                {getConfidenceIcon(ocrResult.confidence)}
                <span
                  className={`text-sm ${getConfidenceColor(ocrResult.confidence)}`}
                  data-oid="ct8vbc_"
                >
                  {ocrResult.confidence.toFixed(1)}% confidence
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent data-oid="cf8sl5v">
            <Tabs defaultValue="text" className="w-full" data-oid="fvnog6m">
              <TabsList className="grid w-full grid-cols-3" data-oid="82khars">
                <TabsTrigger value="text" data-oid="mvjqpi7">
                  Full Text
                </TabsTrigger>
                <TabsTrigger value="regions" data-oid="7l32wcb">
                  Text Regions
                </TabsTrigger>
                <TabsTrigger value="stats" data-oid="9jf3mog">
                  Statistics
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="text"
                className="space-y-4"
                data-oid="sv3w72d"
              >
                {/* Search */}
                <div className="flex gap-2" data-oid="yzzvhz9">
                  <div className="relative flex-1" data-oid="11ylg-r">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                      data-oid="7hc9jyf"
                    />

                    <input
                      type="text"
                      placeholder="Search in extracted text..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        searchInText(e.target.value);
                      }}
                      className="pl-10 pr-4 py-2 border rounded-md w-full"
                      data-oid="msbzv-y"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(ocrResult.text)}
                    data-oid="oc081ji"
                  >
                    <Copy className="h-4 w-4" data-oid="d9v9ejm" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadText(ocrResult.text)}
                    data-oid="96:gyuk"
                  >
                    <Download className="h-4 w-4" data-oid="blerh7c" />
                  </Button>
                </div>

                {/* Extracted Text */}
                <ScrollArea
                  className="h-64 w-full border rounded-md p-4"
                  data-oid="1jp-_nj"
                >
                  <div
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(ocrResult.text),
                    }}
                    data-oid="y978-80"
                  />
                </ScrollArea>

                {searchTerm && highlightedText.length > 0 && (
                  <p className="text-sm text-gray-600" data-oid="vy9jgv.">
                    Found {highlightedText.length} matches for "{searchTerm}"
                  </p>
                )}
              </TabsContent>

              <TabsContent
                value="regions"
                className="space-y-4"
                data-oid="ts_1ow0"
              >
                <ScrollArea className="h-64 w-full" data-oid="z2cn2z:">
                  <div className="space-y-3" data-oid="brybwfr">
                    {ocrResult.regions.map((region, index) => (
                      <Card key={region.id} className="p-3" data-oid="9s12-r8">
                        <div
                          className="flex items-start justify-between mb-2"
                          data-oid="l9hs.-n"
                        >
                          <span
                            className="text-xs font-medium text-gray-500"
                            data-oid="vm9-ke7"
                          >
                            Region {index + 1}
                          </span>
                          <div
                            className="flex items-center gap-1"
                            data-oid="at2mq6u"
                          >
                            {getConfidenceIcon(region.confidence)}
                            <span
                              className={`text-xs ${getConfidenceColor(region.confidence)}`}
                              data-oid="ku0w:io"
                            >
                              {region.confidence.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm" data-oid="ryi00ae">
                          {region.text}
                        </p>
                        <div
                          className="mt-2 text-xs text-gray-500"
                          data-oid="olygmlo"
                        >
                          Position: ({region.bbox.x0}, {region.bbox.y0}) to (
                          {region.bbox.x1}, {region.bbox.y1})
                        </div>
                      </Card>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent
                value="stats"
                className="space-y-4"
                data-oid="3702w3m"
              >
                <div className="grid grid-cols-2 gap-4" data-oid="9n3crgl">
                  <Card className="p-4" data-oid="sc7lj_3">
                    <div className="text-center" data-oid="m-s2.1m">
                      <FileText
                        className="h-8 w-8 mx-auto mb-2 text-blue-600"
                        data-oid="hvp3esa"
                      />

                      <div className="text-2xl font-bold" data-oid="vh_-2wn">
                        {ocrResult.text.split(/\s+/).length}
                      </div>
                      <div className="text-sm text-gray-600" data-oid="ybi:g.n">
                        Words
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4" data-oid="wnl6vzb">
                    <div className="text-center" data-oid="zod.5hc">
                      <Languages
                        className="h-8 w-8 mx-auto mb-2 text-green-600"
                        data-oid="-s18v6r"
                      />

                      <div className="text-2xl font-bold" data-oid="_qdh5g0">
                        {ocrResult.text.length}
                      </div>
                      <div className="text-sm text-gray-600" data-oid="3-h7kv9">
                        Characters
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4" data-oid="2m35phr">
                    <div className="text-center" data-oid="iyflgw_">
                      <Zap
                        className="h-8 w-8 mx-auto mb-2 text-purple-600"
                        data-oid="hbe5fcs"
                      />

                      <div className="text-2xl font-bold" data-oid="j1nnpq6">
                        {(ocrResult.processingTime / 1000).toFixed(1)}s
                      </div>
                      <div className="text-sm text-gray-600" data-oid="3gxji1q">
                        Processing Time
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4" data-oid="unzt3dg">
                    <div className="text-center" data-oid="wbel4kv">
                      <CheckCircle
                        className="h-8 w-8 mx-auto mb-2 text-orange-600"
                        data-oid="-d2a2vx"
                      />

                      <div className="text-2xl font-bold" data-oid="ocn4v:k">
                        {ocrResult.regions.length}
                      </div>
                      <div className="text-sm text-gray-600" data-oid="uk-.q2q">
                        Text Regions
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-4" data-oid="3-t__v0">
                  <h4 className="font-medium mb-2" data-oid="wa-q7er">
                    Language Detection
                  </h4>
                  <p className="text-sm text-gray-600" data-oid=".oysu6g">
                    Processed with:{" "}
                    {ocrResult.language
                      .split("+")
                      .map(
                        (lang) =>
                          supportedLanguages.find((l) => l.code === lang)
                            ?.name || lang,
                      )
                      .join(", ")}
                  </p>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
