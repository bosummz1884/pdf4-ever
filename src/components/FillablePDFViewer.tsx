import React, { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Download, Save, FileText } from "lucide-react";
import { saveFilledFormFields } from "../utils/saveFilledFormFields";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
import "pdfjs-dist/web/pdf_viewer.css";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

type FieldEntry = {
  id: string;
  fieldName: string;
  fieldType: string;
  rect: number[];
  value: string;
  options?: string[];
  radioGroup?: string;
  page: number;
  required?: boolean;
};

interface FillablePDFViewerProps {
  file: File | null;
  pdfDocument?: any;
  currentPage?: number;
  onFieldsDetected: (fields: FieldEntry[]) => void;
  onSave: (fields: FieldEntry[]) => void;
  className?: string;
}

export default function FillablePDFViewer({
  file,
  pdfDocument,
  currentPage: externalCurrentPage,
  onFieldsDetected,
  onSave,
  className,
}: FillablePDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfDoc, setPdfDoc] = useState<any>(null);
  const [pageNum, setPageNum] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [fields, setFields] = useState<FieldEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scale, setScale] = useState(1.5);

  useEffect(() => {
    if (pdfDocument) {
      // Use the already loaded PDF document
      setPdfDoc(pdfDocument);
      setTotalPages(pdfDocument.numPages);
      setPageNum(externalCurrentPage || 1);
      detectAllFields(pdfDocument);
    } else if (file) {
      loadPDF(file);
    }
  }, [file, pdfDocument, externalCurrentPage]);

  // Separate effect for rendering when canvas is ready
  useEffect(() => {
    if (pdfDoc && canvasRef.current) {
      renderPage(pdfDoc, pageNum);
    }
  }, [pdfDoc, pageNum, scale]);

  // Create a key that changes with scale to force complete re-render
  const formFieldsKey = `fields-${scale}-${pageNum}`;

  const loadPDF = async (file: File) => {
    try {
      setIsLoading(true);

      // Check if file has content
      if (file.size === 0) {
        throw new Error("PDF file is empty");
      }

      const buffer = await file.arrayBuffer();

      // Validate buffer has content
      if (buffer.byteLength === 0) {
        throw new Error("PDF file has no content");
      }

      const doc = await pdfjsLib.getDocument({
        data: new Uint8Array(buffer),
        verbosity: 0, // Reduce console noise
      }).promise;

      setPdfDoc(doc);
      setTotalPages(doc.numPages);
      setPageNum(1);

      await renderPage(doc, 1);
      await detectAllFields(doc);
    } catch (error) {
      console.error("Error loading PDF:", error);
      // Reset state on error
      setPdfDoc(null);
      setTotalPages(0);
      setFields([]);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPage = async (doc: any, num: number) => {
    if (!canvasRef.current) {
      console.log("Canvas ref not available");
      return;
    }

    try {
      const page = await doc.getPage(num);
      const viewport = page.getViewport({ scale });
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        console.log("Canvas context not available");
        return;
      }

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: ctx, viewport }).promise;
      console.log(`Successfully rendered page ${num}`);
    } catch (error) {
      console.error(`Error rendering page ${num}:`, error);
    }
  };

  const detectAllFields = async (doc: any) => {
    const allFields: FieldEntry[] = [];

    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      const pageFields = await detectFieldsOnPage(doc, pageNum);
      allFields.push(...pageFields);
    }

    setFields(allFields);
    onFieldsDetected(allFields);
  };

  const detectFieldsOnPage = async (
    doc: any,
    pageNum: number,
  ): Promise<FieldEntry[]> => {
    const page = await doc.getPage(pageNum);
    const annotations = await page.getAnnotations();

    const formFields: FieldEntry[] = annotations
      .filter((a: any) => a.subtype === "Widget")
      .map((a: any, index: number) => ({
        id: a.id || `field_${pageNum}_${index}`,
        fieldName: a.fieldName || `field_${pageNum}_${index}`,
        fieldType: a.fieldType,
        rect: a.rect,
        value: a.fieldValue || a.buttonValue || "",
        options: a.options || [],
        radioGroup: a.radioButton ? a.fieldName : undefined,
        page: pageNum,
        required: a.required || false,
      }));

    return formFields;
  };

  const updateFieldValue = useCallback((id: string, value: string) => {
    setFields((prev) => {
      const updated = prev.map((field) =>
        field.id === id ? { ...field, value } : field,
      );
      return updated;
    });
  }, []);

  const handleRadioChange = useCallback(
    (groupName: string, fieldId: string) => {
      setFields((prev) =>
        prev.map((field) => {
          if (field.radioGroup === groupName) {
            return { ...field, value: field.id === fieldId ? "Yes" : "Off" };
          }
          return field;
        }),
      );
    },
    [],
  );

  const renderFormField = (field: FieldEntry) => {
    if (field.page !== pageNum) return null;

    const canvas = canvasRef.current;
    if (!canvas) return null;

    const [x1, y1, x2, y2] = field.rect;

    // Use simpler, more direct positioning calculation for better zoom compatibility
    const width = (x2 - x1) * scale;
    const height = (y2 - y1) * scale;
    const left = x1 * scale;
    const top = canvas.height - y2 * scale;

    const baseStyle = {
      position: "absolute" as const,
      left,
      top,
      width,
      height,
      zIndex: 10,
      fontSize: "14px",
      border: "2px solid #3b82f6",
      borderRadius: "3px",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      color: "#1e40af",
      fontWeight: "500",
    };

    switch (field.fieldType) {
      case "Tx": // Text field
        const isDateField = field.fieldName.toLowerCase().includes("date");
        const isEmailField = field.fieldName.toLowerCase().includes("email");

        return (
          <input
            key={field.id}
            type={isDateField ? "date" : isEmailField ? "email" : "text"}
            value={field.value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            placeholder={field.fieldName}
            required={field.required}
            style={{
              ...baseStyle,
              padding: "4px 6px",
              boxSizing: "border-box",
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            }}
            data-oid="s.9h7pi"
          />
        );

      case "Btn": // Button (checkbox or radio)
        if (field.radioGroup) {
          return (
            <label
              key={field.id}
              className="pdf-radio-label"
              title={field.fieldName}
              style={{
                ...baseStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: Math.min(width, height),
                height: Math.min(width, height),
                margin: 0,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              data-oid="a405.hs"
            >
              <input
                type="radio"
                name={field.radioGroup}
                checked={field.value === "Yes"}
                onChange={() => handleRadioChange(field.radioGroup!, field.id)}
                className="pdf-radio-input"
                title={field.fieldName}
                aria-label={field.fieldName}
                style={{
                  accentColor: "#3b82f6",
                  cursor: "pointer",
                  margin: 0,
                  transform: "scale(1.2)",
                }}
                data-oid="es98:qb"
              />

              <span className="sr-only" data-oid="60it0bo">
                {field.fieldName}
              </span>
            </label>
          );
        } else {
          return (
            <label
              key={field.id}
              className="pdf-checkbox-label"
              title={field.fieldName}
              style={{
                ...baseStyle,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: Math.min(width, height),
                height: Math.min(width, height),
                margin: 0,
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
              }}
              data-oid="xhxy85j"
            >
              <input
                type="checkbox"
                checked={field.value === "Yes" || field.value === "On"}
                onChange={(e) =>
                  updateFieldValue(field.id, e.target.checked ? "Yes" : "Off")
                }
                className="pdf-checkbox-input"
                title={field.fieldName}
                aria-label={field.fieldName}
                style={{
                  accentColor: "#3b82f6",
                  cursor: "pointer",
                  margin: 0,
                  transform: "scale(1.2)",
                }}
                data-oid="qb6habk"
              />

              <span className="sr-only" data-oid="jjvmq2v">
                {field.fieldName}
              </span>
            </label>
          );
        }

      case "Ch": // Choice (dropdown)
        return (
          <select
            key={field.id}
            value={field.value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            required={field.required}
            className="pdf-select"
            title={field.fieldName}
            aria-label={field.fieldName}
            data-oid="dzne_7l"
          >
            <option value="" data-oid="cf7fo3.">
              Select...
            </option>
            {field.options?.map((opt, i) => (
              <option key={i} value={opt} data-oid="afzu_v-">
                {opt}
              </option>
            ))}
          </select>
        );

      case "Sig": // Signature
        return (
          <input
            key={field.id}
            type="text"
            placeholder="Signature"
            value={field.value}
            onChange={(e) => updateFieldValue(field.id, e.target.value)}
            required={field.required}
            style={{
              ...baseStyle,
              fontStyle: "italic",
              fontFamily: "cursive",
              borderBottom: "2px solid #000",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              backgroundColor: "transparent",
              padding: "2px 4px",
            }}
            data-oid="v1vvace"
          />
        );

      default:
        return null;
    }
  };

  const goToPage = async (num: number) => {
    if (pdfDoc && num >= 1 && num <= totalPages) {
      setPageNum(num);
      await renderPage(pdfDoc, num);
    }
  };

  const getFieldStats = () => {
    const total = fields.length;
    const filled = fields.filter(
      (f) => f.value && f.value.trim() !== "",
    ).length;
    const required = fields.filter((f) => f.required).length;
    const requiredFilled = fields.filter(
      (f) => f.required && f.value && f.value.trim() !== "",
    ).length;

    return { total, filled, required, requiredFilled };
  };

  const stats = getFieldStats();

  if (!file && !pdfDocument) {
    return (
      <div
        className={`flex items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg ${className}`}
        data-oid="5dzq6rp"
      >
        <div className="text-center" data-oid="4mb2kni">
          <FileText
            className="h-12 w-12 mx-auto text-gray-400 mb-4"
            data-oid="ek5f9sy"
          />

          <p className="text-gray-500" data-oid="hilbufv">
            Upload a PDF to view fillable form fields
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`} data-oid="ntai4iy">
      {/* Form Statistics */}
      {fields.length > 0 && (
        <Card data-oid="912d655">
          <CardHeader className="pb-3" data-oid="k720y:_">
            <CardTitle className="text-lg" data-oid="s-3g6i6">
              Form Fields
            </CardTitle>
          </CardHeader>
          <CardContent data-oid="mk:q:qz">
            <div className="flex flex-wrap gap-2" data-oid="xys:ues">
              <Badge variant="secondary" data-oid="y993q8g">
                {stats.filled}/{stats.total} fields filled
              </Badge>
              {stats.required > 0 && (
                <Badge
                  variant={
                    stats.requiredFilled === stats.required
                      ? "default"
                      : "destructive"
                  }
                  data-oid="4929.-s"
                >
                  {stats.requiredFilled}/{stats.required} required
                </Badge>
              )}
            </div>
            <div className="flex gap-2 mt-3" data-oid="6y-bskc">
              <Button
                onClick={() => onSave(fields)}
                disabled={isLoading}
                size="sm"
                data-oid="e.j1_ud"
              >
                <Save className="h-4 w-4 mr-2" data-oid="2p_-i0g" />
                Save Form Data
              </Button>
              {file && (
                <Button
                  onClick={() => saveFilledFormFields(file, fields)}
                  disabled={isLoading}
                  size="sm"
                  variant="outline"
                  data-oid="00vz6o9"
                >
                  <Download className="h-4 w-4 mr-2" data-oid="vjeopw7" />
                  Download Filled PDF
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* PDF Viewer */}
      <div
        className="border border-gray-200 rounded-lg overflow-hidden"
        data-oid="ddl60va"
      >
        {/* Navigation */}
        {totalPages > 1 && (
          <div
            className="bg-gray-50 px-4 py-2 border-b flex items-center justify-between"
            data-oid="vnh5.e."
          >
            <div className="flex items-center gap-2" data-oid="6dh1kr6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pageNum - 1)}
                disabled={pageNum <= 1}
                data-oid="6ufrsz7"
              >
                Previous
              </Button>
              <span className="text-sm" data-oid="ivu7dz4">
                Page {pageNum} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(pageNum + 1)}
                disabled={pageNum >= totalPages}
                data-oid="r6z2pur"
              >
                Next
              </Button>
            </div>
            <div className="flex items-center gap-2" data-oid="g17-c7w">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(scale * 0.8)}
                disabled={scale <= 0.5}
                data-oid="0mc7yb8"
              >
                Zoom Out
              </Button>
              <span className="text-sm" data-oid="8htl0jk">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setScale(scale * 1.25)}
                disabled={scale >= 3}
                data-oid="nhpu52v"
              >
                Zoom In
              </Button>
            </div>
          </div>
        )}

        {/* Canvas Container */}
        <div
          ref={containerRef}
          className="relative bg-white overflow-auto"
          style={{ maxHeight: "70vh" }}
          data-oid="-48w7s_"
        >
          {isLoading && (
            <div
              className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20"
              data-oid="fol5r7z"
            >
              <div className="text-center" data-oid="bm3aa92">
                <div
                  className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"
                  data-oid="mft74m7"
                ></div>
                <p className="text-sm text-gray-600" data-oid=":e9i7:0">
                  Loading PDF...
                </p>
              </div>
            </div>
          )}

          <canvas
            ref={canvasRef}
            className="block"
            style={{ maxWidth: "100%", height: "auto" }}
            data-oid="wyom_68"
          />

          {/* Form Fields Overlay */}
          <div key={formFieldsKey} data-oid="y9je7e6">
            {fields.map(renderFormField)}
          </div>
        </div>
      </div>

      {/* Field List for debugging */}
      {import.meta.env.MODE === "development" && fields.length > 0 && (
        <details className="text-xs" data-oid="5d6_19x">
          <summary className="cursor-pointer text-gray-600" data-oid="-zitc4f">
            Debug: Show detected fields (
            {fields.filter((f) => f.page === pageNum).length} on current page)
          </summary>
          <pre
            className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto max-h-32"
            data-oid="mhy2-fg"
          >
            {JSON.stringify(
              fields.filter((f) => f.page === pageNum),
              null,
              2,
            )}
          </pre>
        </details>
      )}
    </div>
  );
}
