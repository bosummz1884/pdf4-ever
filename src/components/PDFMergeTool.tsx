import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Upload, Download, X, ArrowUp, ArrowDown } from "lucide-react";
import { mergePDFs } from "../lib/pdfUtils";

interface PDFFile {
  file: File;
  id: string;
  name: string;
  size: number;
}

interface PDFMergeToolProps {
  onClose: () => void;
}

const PDFMergeTool: React.FC<PDFMergeToolProps> = ({ onClose }) => {
  const [pdfFiles, setPdfFiles] = useState<PDFFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const pdfFileObjects = files
      .filter((file) => file.type === "application/pdf")
      .map((file) => ({
        file,
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
      }));

    setPdfFiles((prev) => [...prev, ...pdfFileObjects]);
  };

  const removeFile = (id: string) => {
    setPdfFiles((prev) => prev.filter((file) => file.id !== id));
  };

  const moveFileUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...pdfFiles];
    [newFiles[index], newFiles[index - 1]] = [
      newFiles[index - 1],
      newFiles[index],
    ];

    setPdfFiles(newFiles);
  };

  const moveFileDown = (index: number) => {
    if (index === pdfFiles.length - 1) return;
    const newFiles = [...pdfFiles];
    [newFiles[index], newFiles[index + 1]] = [
      newFiles[index + 1],
      newFiles[index],
    ];

    setPdfFiles(newFiles);
  };

  const handleMerge = async () => {
    if (pdfFiles.length < 2) {
      alert("Please select at least 2 PDF files to merge");
      return;
    }

    setIsProcessing(true);
    try {
      const pdfBuffers = await Promise.all(
        pdfFiles.map(async ({ file }) => {
          const arrayBuffer = await file.arrayBuffer();
          return new Uint8Array(arrayBuffer);
        }),
      );

      const mergedPdf = await mergePDFs(pdfBuffers);
      const blob = new Blob([mergedPdf], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "merged_document.pdf";
      a.click();

      URL.revokeObjectURL(url);
      alert("PDFs merged successfully!");
    } catch (error) {
      alert("Error merging PDFs: " + (error as Error).message);
    } finally {
      setIsProcessing(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      data-oid="6-f3gqw"
    >
      <Card
        className="w-full max-w-2xl max-h-[80vh] overflow-hidden"
        data-oid="o08::8y"
      >
        <CardHeader data-oid="4twgqav">
          <div className="flex justify-between items-center" data-oid="bnh:jrd">
            <CardTitle data-oid="gldlvg9">Merge PDF Files</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              data-oid="7s::emo"
            >
              <X className="w-4 h-4" data-oid="hrbuhxa" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4" data-oid="b460vp9">
          <div
            className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center"
            data-oid="-2r84t2"
          >
            <Upload
              className="w-8 h-8 mx-auto mb-2 text-muted-foreground"
              data-oid="hfmd22k"
            />

            <p
              className="text-sm text-muted-foreground mb-2"
              data-oid="_y-:fu_"
            >
              Select PDF files to merge
            </p>
            <input
              type="file"
              accept=".pdf"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="pdf-upload"
              data-oid="z:a8a1y"
            />

            <label htmlFor="pdf-upload" data-oid="4bts8rx">
              <Button
                variant="outline"
                className="cursor-pointer"
                data-oid="exyj505"
              >
                Choose PDF Files
              </Button>
            </label>
          </div>

          {pdfFiles.length > 0 && (
            <div
              className="space-y-2 max-h-60 overflow-y-auto"
              data-oid="pcr1me5"
            >
              <h3 className="font-medium" data-oid="-vdyjvd">
                Files to merge ({pdfFiles.length}):
              </h3>
              {pdfFiles.map((pdfFile, index) => (
                <div
                  key={pdfFile.id}
                  className="flex items-center gap-2 p-2 border rounded"
                  data-oid="mpmj5bh"
                >
                  <div className="flex-1 min-w-0" data-oid="m4edhuc">
                    <p
                      className="text-sm font-medium truncate"
                      data-oid="64mbwgy"
                    >
                      {pdfFile.name}
                    </p>
                    <p
                      className="text-xs text-muted-foreground"
                      data-oid="x1sn0g6"
                    >
                      {formatFileSize(pdfFile.size)}
                    </p>
                  </div>
                  <div className="flex gap-1" data-oid="qlnebuq">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFileUp(index)}
                      disabled={index === 0}
                      data-oid="5waihv1"
                    >
                      <ArrowUp className="w-3 h-3" data-oid=".2b7_wk" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveFileDown(index)}
                      disabled={index === pdfFiles.length - 1}
                      data-oid="7616idn"
                    >
                      <ArrowDown className="w-3 h-3" data-oid=":zlktq7" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(pdfFile.id)}
                      data-oid="q4wncq3"
                    >
                      <X className="w-3 h-3" data-oid="nbwdb-s" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex gap-2 pt-4" data-oid="c-yz089">
            <Button
              onClick={handleMerge}
              disabled={pdfFiles.length < 2 || isProcessing}
              className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent text-white"
              data-oid="mfst2hg"
            >
              <Download className="w-4 h-4 mr-2" data-oid="0zq9vb." />
              {isProcessing ? "Merging..." : "Merge PDFs"}
            </Button>
            <Button variant="outline" onClick={onClose} data-oid="244dqwf">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PDFMergeTool;
