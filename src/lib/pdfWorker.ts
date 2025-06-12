import * as pdfjsLib from 'pdfjs-dist/build/pdf.mjs';
import 'pdfjs-dist/web/pdf_viewer.css';
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
