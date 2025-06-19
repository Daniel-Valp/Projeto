// src/Controllers/manualcontroller.ts
import { Request, Response } from "express";
import Manual from "../models/manuaismodels";
import { Multer } from "multer";
import { clerkClient } from "@clerk/clerk-sdk-node";
import { sendEmail } from "../utils/sendemail"; // ajuste o caminho conforme sua estrutura
import { getEligibleUsers } from "../utils/getEligibleUsers"; // função para buscar usuários elegíveis
import { AuthObject } from "@clerk/clerk-sdk-node";


interface AuthenticatedRequest extends Request {
  auth?: AuthObject;
}

export const createManual = async (req: Request, res: Response) => {
  try {
    console.log("🔁 Requisição recebida para criar manual");

    const {
      titulo,
      descricao,
      categoria_id,
      subcategoria_id,
      status,
      arquivo_pdf_url,
      imagem_capa_url,
      professor_email, // 👈 ADD AQUI
    } = req.body;

    console.log("📥 Dados recebidos no body:", {
      titulo,
      descricao,
      categoria_id,
      subcategoria_id,
      status,
      arquivo_pdf_url,
      imagem_capa_url,
      professor_email,
    });

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const pdfFile = files?.["arquivo_pdf"]?.[0];
    const imageFile = files?.["imagem_capa_url"]?.[0];

    console.log("📁 Arquivo PDF recebido:", pdfFile?.filename);
    console.log("🖼️ Imagem de capa recebida:", imageFile?.filename);

    const finalPdfUrl = pdfFile
      ? `/uploads/${pdfFile.filename}`
      : arquivo_pdf_url || null;

    const finalImageUrl = imageFile
      ? `/uploads/${imageFile.filename}`
      : imagem_capa_url || null;

    console.log("✅ URL final do PDF:", finalPdfUrl);
    console.log("✅ URL final da imagem:", finalImageUrl);

    if (!titulo || !finalPdfUrl || !professor_email) {
      console.warn("⚠️ Dados obrigatórios ausentes:", {
        titulo,
        finalPdfUrl,
        professor_email,
      });
      return res.status(400).json({
        message: "Título, PDF e e-mail do professor são obrigatórios.",
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
      professor_email, // 👈 SALVAR AQUI
    });

    console.log("✅ Manual criado com sucesso:", manual);


    res.status(201).json(manual);
  } catch (error) {
    console.error("❌ Erro ao criar manual:", error);
    res.status(500).json({ message: "Erro ao criar manual" });
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



export const getManuais = async (req: Request, res: Response) => {
  try {
    const manuais = await Manual.findAll();
    res.json(manuais);
  } catch (error) {
    console.error("Erro ao buscar manuais:", error); // 👈 ADICIONA ISSO
    res.status(500).json({ message: "Erro ao buscar manuais" });
  }
};


export const updateManual = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;

    const files = req.files as {
      [fieldname: string]: Express.Multer.File[];
    };

    const finalPdfUrl = files?.["arquivo_pdf"]?.[0]
      ? `/uploads/${files["arquivo_pdf"][0].filename}`
      : req.body.arquivo_pdf_url;

    const finalImagemUrl = files?.["imagem_capa_url"]?.[0]
      ? `/uploads/${files["imagem_capa_url"][0].filename}`
      : req.body.imagem_capa_url;

    // 🔍 Obter manual atual antes da atualização
    const manualAnterior = await Manual.findByPk(id);
    if (!manualAnterior) {
      return res.status(404).json({ message: "Manual não encontrado" });
    }

    const statusAntes = manualAnterior.status?.toLowerCase();
    const statusDepois = req.body.status?.toLowerCase();

    const manualData = {
      ...req.body,
      arquivo_pdf_url: finalPdfUrl,
      imagem_capa_url: finalImagemUrl,
    };

    const [updated] = await Manual.update(manualData, {
      where: { id },
    });

    if (!updated) {
      return res.status(404).json({ message: "Manual não encontrado para atualização" });
    }

    const manualAtualizado = await Manual.findByPk(id);
    if (!manualAtualizado) return res.status(404).json({ message: "Manual não encontrado" });

    const titulo = manualAtualizado.get("titulo");
let professorEmail = manualAtualizado.get("professor_email");




    let professorNome = "Desconhecido";
    try {
      const professor = await clerkClient.users.getUser(professorEmail);
      professorEmail = professor.emailAddresses[0]?.emailAddress || professorEmail;
      professorNome = `${professor.firstName || ""} ${professor.lastName || ""}`.trim() || "Desconhecido";
    } catch (err) {
      console.warn("⚠️ Erro ao buscar professor no Clerk:", professorEmail);
    }

    console.log("📘 Dados do manualAtualizado:", manualAtualizado?.toJSON?.() || manualAtualizado);
    console.log("📌 Título:", manualAtualizado.get("titulo"));
console.log("👤 Email do professor:", manualAtualizado.get("professor_email"));


    // 📧 Enviar email se status mudou para "publicado"
    if (statusDepois === "publicado" && statusAntes !== "publicado") {
      const dataPublicacao = new Date().toLocaleDateString("pt-PT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });

      const emailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
          <h2 style="color: #2c3e50; text-align: center;">📘 Novo Manual Publicado</h2>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
          <p><strong>📌 Título:</strong> ${titulo}</p>
          <p><strong>👤 Professor:</strong> (${professorEmail})</p>
          <p><strong>📅 Publicado em:</strong> ${dataPublicacao}</p>
          <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
          <p style="text-align: center; color: #888;">Esta é uma notificação automática sobre novos manuais disponíveis na plataforma.</p>
          <p style="text-align: center; color: #888;">Para parar de receber emails, desative esta opção nas definições da sua conta.</p>
        </div>
      `;

      const users = await getEligibleUsers("manual");
      await Promise.allSettled(
        users.map((user) =>
          sendEmail(user.emailAddresses[0].emailAddress, "📘 Novo manual publicado!", emailHtml)
        )
      );

      console.log("📧 Emails enviados com sucesso.");
    }

    res.json(manualAtualizado);
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


