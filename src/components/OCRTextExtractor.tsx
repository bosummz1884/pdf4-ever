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
        <CheckCircle className="h-4 w-4 text-green-600" data-oid="7vjz-sp" />
      );
    if (confidence >= 60)
      return (
        <AlertTriangle className="h-4 w-4 text-yellow-600" data-oid="ytkes3g" />
      );
    return <XCircle className="h-4 w-4 text-red-600" data-oid="43btjmo" />;
  };

  return (
    <div className="space-y-4" data-oid="z.2iqmj">
      <Card data-oid=":2e8jkp">
        <CardHeader data-oid="2c55c.1">
          <CardTitle className="flex items-center gap-2" data-oid="4xsrcdw">
            <ScanText className="h-5 w-5" data-oid="z2xl-37" />
            OCR Text Extraction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="f.jc8o8">
          {/* Language Selection */}
          <div className="space-y-2" data-oid="wqck7c:">
            <label className="text-sm font-medium" data-oid="z.8jvtx">
              Languages
            </label>
            <div className="flex flex-wrap gap-2" data-oid=".tszyq3">
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
                  data-oid="41f085r"
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
            data-oid="bc0nnmp"
          >
            {isProcessing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" data-oid="w0wqzk4" />
                Processing...
              </>
            ) : (
              <>
                <ScanText className="h-4 w-4 mr-2" data-oid="p.i05.a" />
                Extract Text
              </>
            )}
          </Button>

          {/* Progress */}
          {isProcessing && (
            <div className="space-y-2" data-oid="jszuj7d">
              <Progress
                value={progress}
                className="w-full"
                data-oid="vg2tp__"
              />
              <p
                className="text-sm text-gray-600 text-center"
                data-oid="9hk3wd_"
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
              data-oid="lf:mxk3"
            >
              <p className="text-sm text-red-700" data-oid="5rjt5fl">
                {error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results */}
      {ocrResult && (
        <Card data-oid="m286ul4">
          <CardHeader data-oid="gydbsdt">
            <CardTitle
              className="flex items-center justify-between"
              data-oid="1_9s2wk"
            >
              <span data-oid="ipo87d7">Extraction Results</span>
              <div className="flex items-center gap-2" data-oid="nr5uxgt">
                {getConfidenceIcon(ocrResult.confidence)}
                <span
                  className={`text-sm ${getConfidenceColor(ocrResult.confidence)}`}
                  data-oid="rv3b577"
                >
                  {ocrResult.confidence.toFixed(1)}% confidence
                </span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent data-oid="04yezkd">
            <Tabs defaultValue="text" className="w-full" data-oid="dj4ex8b">
              <TabsList className="grid w-full grid-cols-3" data-oid=":z_8n7_">
                <TabsTrigger value="text" data-oid="yn_9h.q">
                  Full Text
                </TabsTrigger>
                <TabsTrigger value="regions" data-oid="plf8ix7">
                  Text Regions
                </TabsTrigger>
                <TabsTrigger value="stats" data-oid="t18-fi_">
                  Statistics
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="text"
                className="space-y-4"
                data-oid="t8ixn7."
              >
                {/* Search */}
                <div className="flex gap-2" data-oid="w0b2_l6">
                  <div className="relative flex-1" data-oid=".hswun.">
                    <Search
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                      data-oid="081yhph"
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
                      data-oid="x-i-cjr"
                    />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(ocrResult.text)}
                    data-oid="m1iogsi"
                  >
                    <Copy className="h-4 w-4" data-oid="ajfgj.n" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadText(ocrResult.text)}
                    data-oid="y-3mlh-"
                  >
                    <Download className="h-4 w-4" data-oid="va:68ld" />
                  </Button>
                </div>

                {/* Extracted Text */}
                <ScrollArea
                  className="h-64 w-full border rounded-md p-4"
                  data-oid="ym3g1hg"
                >
                  <div
                    className="text-sm whitespace-pre-wrap"
                    dangerouslySetInnerHTML={{
                      __html: highlightText(ocrResult.text),
                    }}
                    data-oid="a1o1vbl"
                  />
                </ScrollArea>

                {searchTerm && highlightedText.length > 0 && (
                  <p className="text-sm text-gray-600" data-oid="adi-mdo">
                    Found {highlightedText.length} matches for "{searchTerm}"
                  </p>
                )}
              </TabsContent>

              <TabsContent
                value="regions"
                className="space-y-4"
                data-oid="a68kyys"
              >
                <ScrollArea className="h-64 w-full" data-oid="6p3peuf">
                  <div className="space-y-3" data-oid="8r.jzt_">
                    {ocrResult.regions.map((region, index) => (
                      <Card key={region.id} className="p-3" data-oid="hjkbsj4">
                        <div
                          className="flex items-start justify-between mb-2"
                          data-oid="g4dmm1q"
                        >
                          <span
                            className="text-xs font-medium text-gray-500"
                            data-oid="bw1zka8"
                          >
                            Region {index + 1}
                          </span>
                          <div
                            className="flex items-center gap-1"
                            data-oid="qhfsaiw"
                          >
                            {getConfidenceIcon(region.confidence)}
                            <span
                              className={`text-xs ${getConfidenceColor(region.confidence)}`}
                              data-oid="0ye-4n1"
                            >
                              {region.confidence.toFixed(1)}%
                            </span>
                          </div>
                        </div>
                        <p className="text-sm" data-oid=":foulim">
                          {region.text}
                        </p>
                        <div
                          className="mt-2 text-xs text-gray-500"
                          data-oid="s6sis6m"
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
                data-oid="y8x0:df"
              >
                <div className="grid grid-cols-2 gap-4" data-oid="jy7v-jb">
                  <Card className="p-4" data-oid="3g-x3jv">
                    <div className="text-center" data-oid="7dbtl5i">
                      <FileText
                        className="h-8 w-8 mx-auto mb-2 text-blue-600"
                        data-oid="fj9kyve"
                      />
                      <div className="text-2xl font-bold" data-oid="4hot9-r">
                        {ocrResult.text.split(/\s+/).length}
                      </div>
                      <div className="text-sm text-gray-600" data-oid="a7es4rj">
                        Words
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4" data-oid="aptotg_">
                    <div className="text-center" data-oid="p8se_aj">
                      <Languages
                        className="h-8 w-8 mx-auto mb-2 text-green-600"
                        data-oid="pm:8xk6"
                      />
                      <div className="text-2xl font-bold" data-oid="ddxbjst">
                        {ocrResult.text.length}
                      </div>
                      <div className="text-sm text-gray-600" data-oid="4ov5fze">
                        Characters
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4" data-oid="e2bshti">
                    <div className="text-center" data-oid="kt722pd">
                      <Zap
                        className="h-8 w-8 mx-auto mb-2 text-purple-600"
                        data-oid=":78bbdp"
                      />
                      <div className="text-2xl font-bold" data-oid=":49na::">
                        {(ocrResult.processingTime / 1000).toFixed(1)}s
                      </div>
                      <div className="text-sm text-gray-600" data-oid="1tr398.">
                        Processing Time
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4" data-oid="91d6zc5">
                    <div className="text-center" data-oid="at2p.._">
                      <CheckCircle
                        className="h-8 w-8 mx-auto mb-2 text-orange-600"
                        data-oid="gbq2m0r"
                      />
                      <div className="text-2xl font-bold" data-oid="5h1umbc">
                        {ocrResult.regions.length}
                      </div>
                      <div className="text-sm text-gray-600" data-oid="kmm0n2c">
                        Text Regions
                      </div>
                    </div>
                  </Card>
                </div>

                <Card className="p-4" data-oid="sc84na8">
                  <h4 className="font-medium mb-2" data-oid="ulvehj2">
                    Language Detection
                  </h4>
                  <p className="text-sm text-gray-600" data-oid="3qid33m">
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
