declare module 'pdfjs-dist/build/pdf.mjs' {
    // You can be more specific if you know the exports, e.g.:
    // export * from 'pdfjs-dist/types/pdf';
    const pdfjsLib: any;
    export = pdfjsLib;
}
// This file is used to ensure that the pdfjs-dist/build/pdf.mjs module can be imported