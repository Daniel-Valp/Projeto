import { Request, Response } from "express";
import * as videoModel from "../models/videomodels";

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
console.log("🧪 req.params.id =", req.params.id);

  const updated = await videoModel.updateVideo(id, req.body);
  res.json(updated);
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



