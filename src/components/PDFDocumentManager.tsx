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
    <div className="space-y-6" data-oid="7z2y8d7">
      {/* Upload Section */}
      <Card data-oid="pru3yny">
        <CardHeader data-oid="qwt-l1l">
          <CardTitle className="flex items-center gap-2" data-oid="vt3m99f">
            <FileText className="h-5 w-5" data-oid="f8be-d-" />
            PDF Document Manager
          </CardTitle>
        </CardHeader>
        <CardContent data-oid="mbk1d-.">
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 transition-colors"
            onClick={() => fileInputRef.current?.click()}
            onDrop={(e) => {
              e.preventDefault();
              const files = e.dataTransfer.files;
              if (files.length > 0) handleFileUpload(files);
            }}
            onDragOver={(e) => e.preventDefault()}
            data-oid="m0jcve1"
          >
            <Upload
              className="h-12 w-12 mx-auto mb-4 text-gray-400"
              data-oid="21m4.eb"
            />

            <p
              className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2"
              data-oid="gdo-qlq"
            >
              Drop PDF files here or click to upload
            </p>
            <p
              className="text-sm text-gray-500 dark:text-gray-400"
              data-oid="_p3tde5"
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
            data-oid="4k_6pd0"
          />

          {isProcessing && (
            <div className="mt-4" data-oid="6u:ga24">
              <Progress
                value={progress}
                className="w-full"
                data-oid="eqy-70q"
              />

              <p
                className="text-sm text-gray-600 text-center mt-2"
                data-oid="om48cru"
              >
                Processing documents... {progress.toFixed(0)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document List */}
      {documents.length > 0 && (
        <Card data-oid="ke24693">
          <CardHeader data-oid="qygmnwf">
            <CardTitle data-oid="g-n:ou5">Loaded Documents</CardTitle>
          </CardHeader>
          <CardContent data-oid="82-.wf:">
            <ScrollArea className="h-64" data-oid="s9qocj4">
              <div className="space-y-2" data-oid="wsb9ugz">
                {documents.map((doc, index) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                    data-oid="ty0jj_s"
                  >
                    <div className="flex items-center gap-3" data-oid="to6wd.m">
                      <FileText
                        className="h-5 w-5 text-blue-600"
                        data-oid="bg4hqke"
                      />

                      <div data-oid="27io5-6">
                        <p className="font-medium text-sm" data-oid="a5.k:.:">
                          {doc.name}
                        </p>
                        <div
                          className="flex items-center gap-2 text-xs text-gray-500"
                          data-oid="eh1mxvt"
                        >
                          <Badge variant="outline" data-oid="mbvc7wg">
                            {doc.pageCount} pages
                          </Badge>
                          <span data-oid="y22xlci">
                            {formatFileSize(doc.size)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1" data-oid="og71hh7">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveDocument(doc.id, "up")}
                        disabled={index === 0}
                        data-oid="e10wj6z"
                      >
                        <ArrowUp className="h-3 w-3" data-oid="2h:mgdc" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveDocument(doc.id, "down")}
                        disabled={index === documents.length - 1}
                        data-oid="ka856kn"
                      >
                        <ArrowDown className="h-3 w-3" data-oid="eocm4g8" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeDocument(doc.id)}
                        data-oid="n4rgcpm"
                      >
                        <Trash2 className="h-3 w-3" data-oid="gup.btz" />
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
        <Card data-oid="u8.m72v">
          <CardHeader data-oid="ju5:8nf">
            <CardTitle data-oid="-7939a2">Document Operations</CardTitle>
          </CardHeader>
          <CardContent data-oid="bqq76lw">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              data-oid="cvc3dvo"
            >
              <TabsList className="grid w-full grid-cols-3" data-oid="n6k8irv">
                <TabsTrigger
                  value="merge"
                  className="flex items-center gap-2"
                  data-oid="jp_e_1r"
                >
                  <Merge className="h-4 w-4" data-oid="jzr:rst" />
                  Merge
                </TabsTrigger>
                <TabsTrigger
                  value="split"
                  className="flex items-center gap-2"
                  data-oid="i0ks:15"
                >
                  <Split className="h-4 w-4" data-oid="_-4i3u8" />
                  Split
                </TabsTrigger>
                <TabsTrigger
                  value="compress"
                  className="flex items-center gap-2"
                  data-oid="u930o.r"
                >
                  <Archive className="h-4 w-4" data-oid="dujjljr" />
                  Compress
                </TabsTrigger>
              </TabsList>

              <TabsContent
                value="merge"
                className="space-y-4"
                data-oid="r9jwkfz"
              >
                <div className="text-center" data-oid=":g_ism_">
                  <p className="text-gray-600 mb-4" data-oid="fle0bv4">
                    Merge {documents.length} PDF documents into a single file
                  </p>
                  <Button
                    onClick={mergePDFs}
                    disabled={documents.length < 2 || isProcessing}
                    className="w-full"
                    data-oid=":i6ov6j"
                  >
                    <Package className="h-4 w-4 mr-2" data-oid="qn_m.fc" />
                    {isProcessing
                      ? "Merging..."
                      : `Merge ${documents.length} Documents`}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent
                value="split"
                className="space-y-4"
                data-oid="yq7kw.e"
              >
                {documents.length === 1 ? (
                  <div className="space-y-4" data-oid="hrqqgfd">
                    <div
                      className="flex items-center justify-between"
                      data-oid="csc0cf_"
                    >
                      <h4 className="font-medium" data-oid="hk85plz">
                        Split Ranges
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={addSplitRange}
                        data-oid="ylwvvu:"
                      >
                        <Plus className="h-3 w-3 mr-1" data-oid="wxp2i7a" />
                        Add Range
                      </Button>
                    </div>

                    {splitRanges.length === 0 ? (
                      <p
                        className="text-gray-600 text-center py-4"
                        data-oid="qra1kbr"
                      >
                        Add split ranges to divide the document
                      </p>
                    ) : (
                      <div className="space-y-3" data-oid="7233at.">
                        {splitRanges.map((range, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 p-3 border rounded-lg"
                            data-oid="mjn-awq"
                          >
                            <Input
                              placeholder="Section name"
                              value={range.name}
                              onChange={(e) =>
                                updateSplitRange(index, "name", e.target.value)
                              }
                              className="flex-1"
                              data-oid="coqzg92"
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
                              data-oid="bx2x2.9"
                            />

                            <span className="text-gray-500" data-oid="t6d.1wo">
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
                              data-oid="ntrer0x"
                            />

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeSplitRange(index)}
                              data-oid="k26.8p."
                            >
                              <X className="h-3 w-3" data-oid=".2_vhd9" />
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
                        data-oid="_:v9g7a"
                      >
                        <Scissors className="h-4 w-4 mr-2" data-oid="4:fmgpr" />
                        {isProcessing
                          ? "Splitting..."
                          : `Split into ${splitRanges.length} Files`}
                      </Button>
                    )}
                  </div>
                ) : (
                  <p
                    className="text-gray-600 text-center py-4"
                    data-oid="3dvsdg."
                  >
                    Load exactly one PDF document to split it
                  </p>
                )}
              </TabsContent>

              <TabsContent
                value="compress"
                className="space-y-4"
                data-oid="4ixn7yb"
              >
                <div className="space-y-4" data-oid="gfcfcq4">
                  <div className="space-y-2" data-oid="q2utqrr">
                    <Label data-oid="-3_fo5d">
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
                      data-oid="-jnb1g1"
                    />

                    <div
                      className="flex justify-between text-xs text-gray-500"
                      data-oid="qy-mzb3"
                    >
                      <span data-oid="aq.-2kf">Lower quality</span>
                      <span data-oid="._2oa6z">Higher quality</span>
                    </div>
                  </div>

                  <div className="space-y-2" data-oid="x2ulg51">
                    {documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border rounded-lg"
                        data-oid="ajxs69f"
                      >
                        <div data-oid="1k_wm6u">
                          <p className="font-medium text-sm" data-oid="e2zbzza">
                            {doc.name}
                          </p>
                          <p
                            className="text-xs text-gray-500"
                            data-oid="s3ju3rz"
                          >
                            Current size: {formatFileSize(doc.size)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => compressPDF(doc)}
                          disabled={isProcessing}
                          data-oid="e1:7wu."
                        >
                          <Archive
                            className="h-3 w-3 mr-1"
                            data-oid="yhpjew2"
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
