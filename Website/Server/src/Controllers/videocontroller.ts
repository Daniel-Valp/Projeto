import { Request, Response } from "express";
import * as videoModel from "../models/videomodels";
import { getVideoById, updateVideo as updateVideoQuery } from "../models/videomodels";
import { getEligibleUsers } from "../utils/getEligibleUsers";
import { sendEmail } from "../utils/sendemail";
import { clerkClient } from "@clerk/express";

export async function getVideos(req: Request, res: Response) {
  const videos = await videoModel.getAllVideos();
  res.json(videos);
}

export async function getVideo(req: Request, res: Response) {
  const video = await videoModel.getVideoById(Number(req.params.id));
  if (!video) return res.status(404).json({ message: "Vídeo não encontrado" });
  res.json(video);
}

export async function createVideo(req: Request, res: Response) {
  const newVideo = await videoModel.createVideo(req.body);
  res.status(201).json(newVideo);
}

export async function updateVideo(req: Request, res: Response) {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  // Obter o vídeo atual (antes da atualização)
  const videoAnterior = await getVideoById(id);
  if (!videoAnterior) {
    return res.status(404).json({ message: "Vídeo não encontrado" });
  }

  const professorId = videoAnterior.professor_id;

let professorEmail = "Desconhecido";
try {
  const professor = await clerkClient.users.getUser(professorId);
  professorEmail = professor.emailAddresses[0]?.emailAddress || "Desconhecido";
} catch (error) {
  console.error("❌ Erro ao obter email do professor:", error);
}

  // Atualizar o vídeo
  const videoAtualizado = await updateVideoQuery(id, req.body);

  const statusAntes = videoAnterior.status?.toLowerCase();
  const statusDepois = req.body.status?.toLowerCase();

  if (statusDepois === "publicado" && statusAntes !== "publicado") {
    const dataPublicacao = new Date().toLocaleDateString("pt-PT", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
        <h2 style="color: #2c3e50; text-align: center;">🎬 Novo Vídeo Publicado</h2>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
        <p><strong>📌 Título:</strong> ${videoAtualizado.title}</p>
        <p><strong>👤 Professor:</strong> ${professorEmail}</p>
        <p><strong>📅 Publicado em:</strong> ${dataPublicacao}</p>
        <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
        <p style="text-align: center; color: #888;">Esta é uma notificação automática sobre novos vídeos disponíveis na plataforma.</p>
        <p style="text-align: center; color: #888;">Para parar de receber emails, desative esta opção nas definições da sua conta.</p>
      </div>
    `;

    const users = await getEligibleUsers("video");
    await Promise.allSettled(
      users.map((user) =>
        sendEmail(user.emailAddresses[0].emailAddress, "🎬 Novo vídeo publicado!", emailHtml)
      )
    );

    console.log("📧 Emails enviados com sucesso.");
  }

  res.json(videoAtualizado);
}

export async function deleteVideo(req: Request, res: Response) {
  await videoModel.deleteVideo(Number(req.params.id));
  res.status(204).send();
}

export async function updateVideoStatus(req: Request, res: Response) {
  const videoId = Number(req.params.id);
  const { status } = req.body;

  if (!["rascunho", "publicado"].includes(status)) {
    return res.status(400).json({ message: "Status inválido" });
  }

  const updated = await videoModel.updateVideo(videoId, { status });
  res.json(updated);
}



