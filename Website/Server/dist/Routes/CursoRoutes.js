import express from "express";
import multer from "multer";
import { criarCurso, getCursoPorId, listarCursos } from "../Controllers/ControllerCurso.js";
import { requireAuth } from "@clerk/express";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
// 📝 Rota para listar todos os cursos com seções e capítulos
router.get("/", listarCursos);
// 📝 Rota para pegar um curso pelo ID (completo)
router.get("/:id", getCursoPorId);
router.post("/", requireAuth(), criarCurso);
router.put("/:id", requireAuth());
export default router;
