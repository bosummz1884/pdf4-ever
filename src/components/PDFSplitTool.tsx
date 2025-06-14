import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Upload, Download, X, FileText } from "lucide-react";
import { extractPagesFromPdf } from "../lib/pdfUtils";

interface PDFSplitToolProps {
  onClose: () => void;
  initialFile?: File | null;
}

const PDFSplitTool: React.FC<PDFSplitToolProps> = ({
  onClose,
  initialFile,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(
    initialFile || null,
  );
  const [totalPages, setTotalPages] = useState<number>(0);
  const [selectedPages, setSelectedPages] = useState<number[]>([]);
  const [pageRange, setPageRange] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (selectedFile) {
      loadPdfInfo();
    }
  }, [selectedFile]);

  const loadPdfInfo = async () => {
    if (!selectedFile) return;

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdf = await loadingTask.promise;
      setTotalPages(pdf.numPages);
    } catch (error) {
      alert("Error loading PDF: " + (error as Error).message);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      setSelectedPages([]);
      setPageRange("");
    }
  };

  const handlePageToggle = (pageNum: number) => {
    setSelectedPages((prev) =>
      prev.includes(pageNum)
        ? prev.filter((p) => p !== pageNum)
        : [...prev, pageNum].sort((a, b) => a - b),
    );
  };

  const handleRangeInput = (value: string) => {
    setPageRange(value);
    try {
      const pages: number[] = [];
      const ranges = value.split(",").map((s) => s.trim());

      for (const range of ranges) {
        if (range.includes("-")) {
          const [start, end] = range.split("-").map((n) => parseInt(n.trim()));
          if (start && end && start <= end && start >= 1 && end <= totalPages) {
            for (let i = start; i <= end; i++) {
              if (!pages.includes(i)) pages.push(i);
            }
          }
        } else {
          const pageNum = parseInt(range);
          if (
            pageNum >= 1 &&
            pageNum <= totalPages &&
            !pages.includes(pageNum)
          ) {
            pages.push(pageNum);
          }
        }
      }

      setSelectedPages(pages.sort((a, b) => a - b));
    } catch {
      // Invalid range format
    }
  };

  const handleSplit = async () => {
    if (!selectedFile || selectedPages.length === 0) {
      alert("Please select pages to extract");
      return;
    }

    setIsProcessing(true);
    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const pdfBytes = new Uint8Array(arrayBuffer);

      // Convert to 0-based index
      const pageIndices = selectedPages.map((p) => p - 1);
      const extractedPdf = await extractPagesFromPdf(pdfBytes, pageIndices);

      const blob = new Blob(
        [new Uint8Array(extractedPdf as unknown as ArrayBuffer)],
        { type: "application/pdf" },
      );
      // Use the extractedPdf directly as a BlobPart (Uint8Array is valid)
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `extracted_pages_${selectedPages.join("_")}.pdf`;
      a.click();

      URL.revokeObjectURL(url);
      alert(`Successfully extracted ${selectedPages.length} pages!`);
    } catch (error) {
      alert("Error splitting PDF: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      data-oid="54zyaeu"
    >
      <Card
        className="w-full max-w-4xl max-h-[80vh] overflow-hidden"
        data-oid="h06cend"
      >
        <CardHeader data-oid="f:0t2:m">
          <div className="flex justify-between items-center" data-oid="duq0xum">
            <CardTitle data-oid="j1m1u09">Split PDF - Extract Pages</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-oid="smrk1i5"
            >
              <X className="w-4 h-4" data-oid="p-rabp9" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="bl4r:zz">
          {!selectedFile && (
            <div
              className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center"
              data-oid="ica0pwd"
            >
              <Upload
                className="w-8 h-8 mx-auto mb-2 text-muted-foreground"
                data-oid="y3aeamx"
              />

              <p
                className="text-sm text-muted-foreground mb-2"
                data-oid="l1bm1.s"
              >
                Select a PDF file to split
              </p>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
                id="pdf-upload"
                data-oid="7avr2jd"
              />

              <label htmlFor="pdf-upload" data-oid="in:8yet">
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  data-oid="98v5ri0"
                >
                  Choose PDF File
                </Button>
              </label>
            </div>
          )}

          {selectedFile && totalPages > 0 && (
            <>
              <div
                className="flex items-center gap-2 p-3 bg-muted/50 rounded"
                data-oid="wv83:xz"
              >
                <FileText className="w-5 h-5 text-primary" data-oid="dp07kiw" />
                <div data-oid="fvhzli7">
                  <p className="font-medium" data-oid=".nbgw8j">
                    {selectedFile.name}
                  </p>
                  <p
                    className="text-sm text-muted-foreground"
                    data-oid="1vv30b1"
                  >
                    {totalPages} pages •{" "}
                    {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
              </div>

              <div className="space-y-3" data-oid="-rahzh8">
                <div data-oid="dt603-y">
                  <Label htmlFor="page-range" data-oid="s5tmv1m">
                    Page Range (e.g., 1-3, 5, 7-9)
                  </Label>
                  <Input
                    id="page-range"
                    value={pageRange}
                    onChange={(e) => handleRangeInput(e.target.value)}
                    placeholder="Enter page numbers or ranges"
                    data-oid=":ik4dnc"
                  />
                </div>

                <div
                  className="max-h-40 overflow-y-auto border rounded p-3"
                  data-oid="3in_t_-"
                >
                  <Label
                    className="text-sm font-medium mb-2 block"
                    data-oid="j613z5u"
                  >
                    Select Pages ({selectedPages.length} selected):
                  </Label>
                  <div className="grid grid-cols-10 gap-1" data-oid="cbgshe.">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (pageNum) => (
                        <div
                          key={pageNum}
                          className="flex items-center space-x-1"
                          data-oid="zl_r9tc"
                        >
                          <Checkbox
                            id={`page-${pageNum}`}
                            checked={selectedPages.includes(pageNum)}
                            onCheckedChange={() => handlePageToggle(pageNum)}
                            data-oid="x8vepzn"
                          />

                          <Label
                            htmlFor={`page-${pageNum}`}
                            className="text-xs cursor-pointer"
                            data-oid="k148:60"
                          >
                            {pageNum}
                          </Label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                {selectedPages.length > 0 && (
                  <div
                    className="p-2 bg-primary/10 rounded text-sm"
                    data-oid=".wf-qce"
                  >
                    Selected pages: {selectedPages.join(", ")}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-4" data-oid="nm0h4gf">
                <Button
                  onClick={handleSplit}
                  disabled={selectedPages.length === 0 || isProcessing}
                  className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent text-white"
                  data-oid="w:nphnm"
                >
                  <Download className="w-4 h-4 mr-2" data-oid="4gelyj_" />
                  {isProcessing
                    ? "Extracting..."
                    : `Extract ${selectedPages.length} Pages`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedFile(null)}
                  data-oid="niv8:et"
                >
                  Choose Different File
                </Button>
                <Button variant="outline" onClick={onClose} data-oid="s_2zj93">
                  Cancel
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFSplitTool;
