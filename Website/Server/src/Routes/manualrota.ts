// src/Routes/manualroutes.ts
import express from "express";
import multer from "multer";
import {
  createManual,
  getManuais,
  getManualById,
  updateManual,
  deleteManual,
} from "../Controllers/manuaiscontroller";

const router = express.Router();

import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Ex: ".pdf"
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


// ✅ Usa o middleware do multer para processar 'arquivo_pdf'
router.post("/manuais", upload.single("arquivo_pdf"), createManual);

router.get("/manuais", getManuais);
router.get("/manuais/:id", getManualById);
router.put("/manuais/:id", updateManual);
router.delete("/manuais/:id", deleteManual);

export default router;
