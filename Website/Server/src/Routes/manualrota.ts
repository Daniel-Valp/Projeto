// src/Routes/manualroutes.ts
import express from "express";
import multer from "multer";
import path from "path";

import {
  createManual,
  getManuais,
  getManualById,
  updateManual,
  deleteManual,
} from "../Controllers/manuaiscontroller";

const router = express.Router();

// 📁 Configuração do Multer para salvar arquivos em disco
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

// ✅ Criar manual com upload de PDF e imagem
router.post(
  "/manuais",
  upload.fields([
    { name: "arquivo_pdf", maxCount: 1 },
    { name: "imagem_capa_url", maxCount: 1 },
  ]),
  createManual
);

// ✅ Obter todos os manuais
router.get("/manuais", getManuais);

// ✅ Obter manual específico
router.get("/manuais/:id", getManualById);

// ✅ Atualizar manual com suporte a upload de arquivos (imagem/pdf)
router.put(
  "/manuais/:id",
  upload.fields([
    { name: "arquivo_pdf", maxCount: 1 },
    { name: "imagem_capa_url", maxCount: 1 },
  ]),
  updateManual
);

// ✅ Remover manual
router.delete("/manuais/:id", deleteManual);

export default router;
