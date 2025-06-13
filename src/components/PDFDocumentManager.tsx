import { useState, useRef } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import {
  Upload,
  Download,
  Merge,
  Split,
  FileText,
  Trash2,
  Plus,
  ArrowUp,
  ArrowDown,
  Scissors,
  Package,
  RefreshCw,
  Eye,
  Check,
  X,
  Archive,
} from "lucide-react";
import { PDFDocument, degrees } from "pdf-lib";

interface PDFFile {
  id: string;
  name: string;
  file: File;
  document?: PDFDocument;
  pageCount: number;
  size: number;
  thumbnail?: string;
  isProcessing?: boolean;
}

interface SplitRange {
  start: number;
  end: number;
  name: string;
}

interface PDFDocumentManagerProps {
  onDocumentProcessed?: (result: Uint8Array, filename: string) => void;
}

export function PDFDocumentManager({
  onDocumentProcessed,
}: PDFDocumentManagerProps) {
  const [documents, setDocuments] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [splitRanges, setSplitRanges] = useState<SplitRange[]>([]);
  const [compressionLevel, setCompressionLevel] = useState(50);
  const [activeTab, setActiveTab] = useState("merge");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList) => {
    setIsProcessing(true);
    setProgress(0);

    const newDocuments: PDFFile[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type === "application/pdf") {
        try {
          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await PDFDocument.load(arrayBuffer);

          const pdfFile: PDFFile = {
            id: Date.now().toString() + i,
            name: file.name,
            file,
            document: pdfDoc,
            pageCount: pdfDoc.getPageCount(),
            size: file.size,
            isProcessing: false,
          };

          newDocuments.push(pdfFile);
          setProgress(((i + 1) / files.length) * 100);
        } catch (error) {
          console.error(`Error loading PDF ${file.name}:`, error);
        }
      }
    }

    setDocuments((prev) => [...prev, ...newDocuments]);
    setIsProcessing(false);
    setProgress(0);
  };

  const removeDocument = (id: string) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== id));
  };

  const moveDocument = (id: string, direction: "up" | "down") => {
    setDocuments((prev) => {
      const index = prev.findIndex((doc) => doc.id === id);
      if (index === -1) return prev;

      const newIndex = direction === "up" ? index - 1 : index + 1;
      if (newIndex < 0 || newIndex >= prev.length) return prev;

      const newDocs = [...prev];
      [newDocs[index], newDocs[newIndex]] = [newDocs[newIndex], newDocs[index]];
      return newDocs;
    });
  };

  const mergePDFs = async () => {
    if (documents.length < 2) return;

    try {
      setIsProcessing(true);
      setProgress(0);

      const mergedPdf = await PDFDocument.create();
      let processedPages = 0;
      let totalPages = documents.reduce((sum, doc) => sum + doc.pageCount, 0);

      for (const doc of documents) {
        if (doc.document) {
          const pages = await mergedPdf.copyPages(
            doc.document,
            doc.document.getPageIndices(),
          );
          pages.forEach((page) => mergedPdf.addPage(page));

          processedPages += doc.pageCount;
          setProgress((processedPages / totalPages) * 100);
        }
      }

      const pdfBytes = await mergedPdf.save();
      const filename = `merged_document_${Date.now()}.pdf`;

      downloadPDF(pdfBytes, filename);
      onDocumentProcessed?.(pdfBytes, filename);
    } catch (error) {
      console.error("Error merging PDFs:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const splitPDF = async (document: PDFFile) => {
    if (!document.document || splitRanges.length === 0) return;

    try {
      setIsProcessing(true);
      setProgress(0);

      for (let i = 0; i < splitRanges.length; i++) {
        const range = splitRanges[i];
        const splitPdf = await PDFDocument.create();

        // Validate range
        const startPage = Math.max(
          1,
          Math.min(range.start, document.pageCount),
        );
        const endPage = Math.max(
          startPage,
          Math.min(range.end, document.pageCount),
        );

        // Copy pages in range
        const pageIndices = Array.from(
          { length: endPage - startPage + 1 },
          (_, index) => startPage - 1 + index,
        );

        const pages = await splitPdf.copyPages(document.document, pageIndices);
        pages.forEach((page) => splitPdf.addPage(page));

        const pdfBytes = await splitPdf.save();
        const filename = `${range.name || `split_${i + 1}`}_${Date.now()}.pdf`;

        downloadPDF(pdfBytes, filename);
        onDocumentProcessed?.(pdfBytes, filename);

        setProgress(((i + 1) / splitRanges.length) * 100);
      }
    } catch (error) {
      console.error("Error splitting PDF:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const compressPDF = async (document: PDFFile) => {
    if (!document.document) return;

    try {
      setIsProcessing(true);
      setProgress(25);

      // Create a new PDF with compression
      const compressedPdf = await PDFDocument.create();
      setProgress(50);

      // Copy all pages
      const pages = await compressedPdf.copyPages(
        document.document,
        document.document.getPageIndices(),
      );
      pages.forEach((page) => compressedPdf.addPage(page));
      setProgress(75);

      // Save with compression settings
      const pdfBytes = await compressedPdf.save({
        useObjectStreams: true,
        addDefaultPage: false,
        objectsPerTick: Math.floor(compressionLevel / 10) + 1,
      });

      const filename = `compressed_${document.name}`;
      const compressionRatio = (
        ((document.size - pdfBytes.length) / document.size) *
        100
      ).toFixed(1);

      console.log(
        `Compression: ${formatFileSize(document.size)} → ${formatFileSize(pdfBytes.length)} (${compressionRatio}% reduction)`,
      );

      downloadPDF(pdfBytes, filename);
      onDocumentProcessed?.(pdfBytes, filename);
      setProgress(100);
    } catch (error) {
      console.error("Error compressing PDF:", error);
    } finally {
      setIsProcessing(false);
      setProgress(0);
    }
  };

  const downloadPDF = (
    pdfBytes: ArrayBuffer | Uint8Array,
    filename: string,
  ) => {
    // Always create a fresh Uint8Array copy
    const bytes =
      pdfBytes instanceof Uint8Array
        ? pdfBytes
        : new Uint8Array(pdfBytes.slice(0));
    const blob = new Blob([pdfBytes.slice(0)], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const addSplitRange = () => {
    const newRange: SplitRange = {
      start: 1,
      end: documents[0]?.pageCount || 1,
      name: `Section ${splitRanges.length + 1}`,
    };
    setSplitRanges((prev) => [...prev, newRange]);
  };

  const updateSplitRange = (
    index: number,
    field: keyof SplitRange,
    value: string | number,
  ) => {
    setSplitRanges((prev) =>
      prev.map((range, i) =>
        i === index ? { ...range, [field]: value } : range,
      ),
    );
  };

  const removeSplitRange = (index: number) => {
    setSplitRanges((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6" data-oid="rf52uqj">
      {/* Upload Section */}
      <Card data-oid="_fd9nxg">
        <CardHeader data-oid="pqczxyn">
          <CardTitle className="flex items-center gap-2" data-oid="cqqo606">
            <FileText className="h-5 w-5" data-oid="g:t0cab" />
            PDF Document Manager
          </CardTitle>
        </CardHeader>
        <CardContent data-oid="e_e2gy8">
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              if (files.length > 0) handleFileUpload(files);
            }}
            onDragOver={(e) => e.preventDefault()}
            data-oid="nmf2no."
          >
            <Upload
              className="h-12 w-12 mx-auto mb-4 text-gray-400"
              data-oid="erif98o"
            />
            <p
              className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2"
              data-oid="m-ubk45"
            >
              Drop PDF files here or click to upload
            </p>
            <p
              className="text-sm text-gray-500 dark:text-gray-400"
              data-oid="zpb1u5j"
            >
              Support for multiple PDF files
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            multiple
            onChange={(e) => {
              if (e.target.files) handleFileUpload(e.target.files);
            }}
            className="hidden"
            data-oid="ohtaev1"
          />

          {isProcessing && (
            <div className="mt-4" data-oid="a951_gx">
              <Progress
                value={progress}
                className="w-full"
                data-oid="50jq:lh"
              />
              <p
                className="text-sm text-gray-600 text-center mt-2"
                data-oid="rov48-6"
              >
                Processing documents... {progress.toFixed(0)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document List */}
      {documents.length > 0 && (
        <Card data-oid="af2tq7s">
          <CardHeader data-oid="croazcd">
            <CardTitle data-oid=".hz91m5">Loaded Documents</CardTitle>
          </CardHeader>
          <CardContent data-oid="za7.s70">
            <ScrollArea className="h-64" data-oid="b7rzh4.">
              <div className="space-y-2" data-oid=".8:3-ix">
                {documents.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                    data-oid=".pc6sth"
                  >
                    <div className="flex items-center gap-3" data-oid="8ibtn60">
                      <FileText
                        className="h-5 w-5 text-blue-600"
                        data-oid="6j_bin2"
                      />
                      <div data-oid="2j0-:zc">
                        <p className="font-medium text-sm" data-oid="e-kdrq.">
                          {doc.name}
                        </p>
                        <div
                          className="flex items-center gap-2 text-xs text-gray-500"
                          data-oid="3lwb8ek"
                        >
                          <Badge variant="outline" data-oid="kr2y56o">
                            {doc.pageCount} pages
                          </Badge>
                          <span data-oid="p0uypk9">
                            {formatFileSize(doc.size)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" data-oid="fm6_w_1">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveDocument(doc.id, "up")}
                        disabled={index === 0}
                        data-oid="zx4oo2_"
                      >
                        <ArrowUp className="h-3 w-3" data-oid="_hib779" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveDocument(doc.id, "down")}
                        disabled={index === documents.length - 1}
                        data-oid="-831i_v"
                      >
                        <ArrowDown className="h-3 w-3" data-oid="g.t1_g_" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        data-oid="qmzq.w."
                      >
                        <Trash2 className="h-3 w-3" data-oid="p551ly8" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      )}

      {/* Operations */}
      {documents.length > 0 && (
        <Card data-oid="w-n80rv">
          <CardHeader data-oid="jmkzp:j">
            <CardTitle data-oid=":u0q0df">Document Operations</CardTitle>
          </CardHeader>
          <CardContent data-oid="tmgfn9_">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              data-oid="fivu75f"
            >
              <TabsList className="grid w-full grid-cols-3" data-oid="u_-tjk.">
                <TabsTrigger
                  value="merge"
                  className="flex items-center gap-2"
                  data-oid="qa493:l"
                >
                  <Merge className="h-4 w-4" data-oid="34q99iq" />
                  Merge
                </TabsTrigger>
                <TabsTrigger
                  value="split"
                  className="flex items-center gap-2"
                  data-oid="cm8uunb"
                >
                  <Split className="h-4 w-4" data-oid="kdjg633" />
                  Split
                </TabsTrigger>
                <TabsTrigger
                  value="compress"
                  className="flex items-center gap-2"
                  data-oid="yehhng6"
                >
                  <Archive className="h-4 w-4" data-oid="7wdfm5:" />
                  Compress
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="merge"
                className="space-y-4"
                data-oid=".4_dixu"
              >
                <div className="text-center" data-oid="zv73b:3">
                  <p className="text-gray-600 mb-4" data-oid="-2fc58a">
                    Merge {documents.length} PDF documents into a single file
                  </p>
                  <Button
                    onClick={mergePDFs}
                    disabled={documents.length < 2 || isProcessing}
                    className="w-full"
                    data-oid=".p2sfhd"
                  >
                    <Package className="h-4 w-4 mr-2" data-oid="bfzbp8d" />
                    {isProcessing
                      ? "Merging..."
                      : `Merge ${documents.length} Documents`}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent
                value="split"
                className="space-y-4"
                data-oid="4x0h34f"
              >
                {documents.length === 1 ? (
                  <div className="space-y-4" data-oid="uj9rw.i">
                    <div
                      className="flex items-center justify-between"
                      data-oid="x3w1ykm"
                    >
                      <h4 className="font-medium" data-oid=":sqby1:">
                        Split Ranges
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addSplitRange}
                        data-oid="w1wpzoh"
                      >
                        <Plus className="h-3 w-3 mr-1" data-oid="r-fqnv4" />
                        Add Range
                      </Button>
                    </div>

                    {splitRanges.length === 0 ? (
                      <p
                        className="text-gray-600 text-center py-4"
                        data-oid="c9mvlbu"
                      >
                        Add split ranges to divide the document
                      </p>
                    ) : (
                      <div className="space-y-3" data-oid="edg0b_.">
                        {splitRanges.map((range, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 border rounded-lg"
                            data-oid="jxgmc12"
                          >
                            <Input
                              placeholder="Section name"
                              value={range.name}
                              onChange={(e) =>
                                updateSplitRange(index, "name", e.target.value)
                              }
                              className="flex-1"
                              data-oid="ye5h.z:"
                            />

                            <Input
                              type="number"
                              placeholder="Start"
                              value={range.start}
                              onChange={(e) =>
                                updateSplitRange(
                                  index,
                                  "start",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="w-20"
                              min={1}
                              max={documents[0].pageCount}
                              data-oid="p3f-tfz"
                            />

                            <span className="text-gray-500" data-oid="77.yqdc">
                              to
                            </span>
                            <Input
                              type="number"
                              placeholder="End"
                              value={range.end}
                              onChange={(e) =>
                                updateSplitRange(
                                  index,
                                  "end",
                                  parseInt(e.target.value) || 1,
                                )
                              }
                              className="w-20"
                              min={range.start}
                              max={documents[0].pageCount}
                              data-oid="mldnoi5"
                            />

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSplitRange(index)}
                              data-oid="4nfw-.m"
                            >
                              <X className="h-3 w-3" data-oid="x4n0bl5" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    {splitRanges.length > 0 && (
                      <Button
                        onClick={() => splitPDF(documents[0])}
                        disabled={isProcessing}
                        className="w-full"
                        data-oid="k5-47g2"
                      >
                        <Scissors className="h-4 w-4 mr-2" data-oid="vupv5ma" />
                        {isProcessing
                          ? "Splitting..."
                          : `Split into ${splitRanges.length} Files`}
                      </Button>
                    )}
                  </div>
                ) : (
                  <p
                    className="text-gray-600 text-center py-4"
                    data-oid="nt4:.sg"
                  >
                    Load exactly one PDF document to split it
                  </p>
                )}
              </TabsContent>

              <TabsContent
                value="compress"
                className="space-y-4"
                data-oid="kq2fn-y"
              >
                <div className="space-y-4" data-oid="xo44i7-">
                  <div className="space-y-2" data-oid="kvg0jio">
                    <Label data-oid="ud9y_ch">
                      Compression Level: {compressionLevel}%
                    </Label>
                    <input
                      type="range"
                      min="10"
                      max="90"
                      value={compressionLevel}
                      onChange={(e) =>
                        setCompressionLevel(parseInt(e.target.value))
                      }
                      className="w-full"
                      data-oid="fp670is"
                    />

                    <div
                      className="flex justify-between text-xs text-gray-500"
                      data-oid="jp9z0-4"
                    >
                      <span data-oid="i9r4_r2">Lower quality</span>
                      <span data-oid="m_0inys">Higher quality</span>
                    </div>
                  </div>

                  <div className="space-y-2" data-oid="ut6qmzx">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                        data-oid="qr:qil2"
                      >
                        <div data-oid="maj0sd6">
                          <p className="font-medium text-sm" data-oid="_d4t3fi">
                            {doc.name}
                          </p>
                          <p
                            className="text-xs text-gray-500"
                            data-oid="itp_utj"
                          >
                            Current size: {formatFileSize(doc.size)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => compressPDF(doc)}
                          disabled={isProcessing}
                          data-oid="1r20z_e"
                        >
                          <Archive
                            className="h-3 w-3 mr-1"
                            data-oid="ne5-not"
                          />
                          Compress
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
