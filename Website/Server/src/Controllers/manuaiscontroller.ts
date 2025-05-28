// src/Controllers/manualcontroller.ts
import { Request, Response } from "express";
import Manual from "../models/manuaismodels";
import { Multer } from "multer";

export const createManual = async (req: Request, res: Response) => {
  try {
    const {
      titulo,
      descricao,
      categoria_id,
      subcategoria_id,
      status,
      arquivo_pdf_url,
      imagem_capa_url,
    } = req.body;

    // ✅ Tipagem correta para evitar erro TS7053
    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const pdfFile = files?.["arquivo_pdf"]?.[0];
    const imageFile = files?.["imagem_capa_url"]?.[0];

    const finalPdfUrl = pdfFile
      ? `/uploads/${pdfFile.filename}`
      : arquivo_pdf_url || null;

    const finalImageUrl = imageFile
      ? `/uploads/${imageFile.filename}`
      : imagem_capa_url || null;

    if (!titulo || !finalPdfUrl) {
      return res.status(400).json({
        message: "Título e arquivo PDF (upload ou URL) são obrigatórios.",
      });
    }

    const manual = await Manual.create({
      titulo,
      descricao,
      imagem_capa_url: finalImageUrl,
      categoria_id,
      subcategoria_id,
      arquivo_pdf_url: finalPdfUrl,
      status: status || "rascunho",
    });

    res.status(201).json(manual);
  } catch (error) {
    console.error("❌ Erro ao criar manual:", error);
    res.status(500).json({ message: "Erro ao criar manual" });
  }
};



export const getManuais = async (req: Request, res: Response) => {
  try {
    const manuais = await Manual.findAll();
    res.json(manuais);
  } catch (error) {
    console.error("Erro ao buscar manuais:", error); // 👈 ADICIONA ISSO
    res.status(500).json({ message: "Erro ao buscar manuais" });
  }
};


export const getManualById = async (req: Request, res: Response) => {
  try {
    const manual = await Manual.findByPk(req.params.id);
    if (!manual) return res.status(404).json({ message: "Manual não encontrado" });
    res.json(manual);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar manual" });
  }
};

export const updateManual = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    // Se houver upload de PDF, use o novo caminho
    const finalPdfUrl = req.file
      ? `/uploads/pdfs/${req.file.filename}`
      : req.body.arquivo_pdf_url;

    const manualData = {
      ...req.body,
      arquivo_pdf_url: finalPdfUrl,
    };

    const [updated] = await Manual.update(manualData, {
      where: { id },
    });

    if (updated) {
      const manual = await Manual.findByPk(id);
      res.json(manual);
    } else {
      res.status(404).json({ message: "Manual não encontrado" });
    }
  } catch (error) {
    console.error("❌ Erro ao atualizar manual:", error);
    res.status(500).json({ message: "Erro ao atualizar manual" });
  }
};

import fs from 'fs';
import path from 'path';


export const deleteManual = async (req: Request, res: Response) => {
  try {
    const manualId = req.params.id;

    const manual = await Manual.findByPk(manualId);
    if (!manual)
      return res.status(404).json({ message: "Manual não encontrado" });

    const uploadsDir = path.resolve(__dirname, "..", "uploads");

    // PDF
    if (manual.arquivo_pdf_url) {
      const pdfFilename = path.basename(manual.arquivo_pdf_url);
      const pdfPath = path.join(uploadsDir, pdfFilename);
      console.log("🔍 PDF path:", pdfPath);
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
        console.log("✅ PDF deletado.");
      }
    }

    // Imagem
    if (manual.imagem_capa_url) {
      const imgFilename = path.basename(manual.imagem_capa_url);
      const imgPath = path.join(uploadsDir, imgFilename);
      console.log("🔍 Imagem path:", imgPath);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
        console.log("✅ Imagem deletada.");
      }
    }

    await manual.destroy();

    res
      .status(200)
      .json({ message: "Manual e arquivos deletados com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar manual:", error);
    res.status(500).json({ message: "Erro interno ao deletar manual." });
  }
};


