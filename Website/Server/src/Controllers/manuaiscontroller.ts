// src/Controllers/manualcontroller.ts
import { Request, Response } from "express";
import Manual from "../models/manuaismodels";

export const createManual = async (req: Request, res: Response) => {
  try {
    const {
      titulo,
      descricao,
      imagem_capa_url,
      categoria_id,
      subcategoria_id,
    } = req.body;

    const finalArquivoPdfUrl = req.file
      ? `/uploads/${req.file.filename}`
      : null;

    if (!titulo || !finalArquivoPdfUrl) {
      return res.status(400).json({
        message: "Título e arquivo PDF são obrigatórios.",
      });
    }

    const manual = await Manual.create({
      titulo,
      descricao,
      imagem_capa_url,
      categoria_id,
      subcategoria_id,
      status: "rascunho", // ✅ define status aqui se é fixo
      arquivo_pdf_url: finalArquivoPdfUrl,
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
    const [updated] = await Manual.update(req.body, {
      where: { id: req.params.id },
    });
    if (updated) {
      const manual = await Manual.findByPk(req.params.id);
      res.json(manual);
    } else {
      res.status(404).json({ message: "Manual não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar manual" });
  }
};

export const deleteManual = async (req: Request, res: Response) => {
  try {
    const deleted = await Manual.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: "Manual deletado com sucesso" });
    } else {
      res.status(404).json({ message: "Manual não encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erro ao deletar manual" });
  }
};
