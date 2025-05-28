// src/types/pdfjs-dist.d.ts
declare module "pdfjs-dist/webpack" {
  export const getDocument: typeof import("pdfjs-dist").getDocument;
  export const GlobalWorkerOptions: typeof import("pdfjs-dist").GlobalWorkerOptions;
  export const version: string;
}
