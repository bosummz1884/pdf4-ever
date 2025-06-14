import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "pdfjs-dist/web/pdf_viewer.css";
import * as pdfjsLib from "pdfjs-dist/build/pdf.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

createRoot(document.getElementById("root")!).render(<App />);
