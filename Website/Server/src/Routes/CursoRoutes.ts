import express from "express";
import { getCursoPorId, listarCursos } from "../Controllers/ControllerCurso.js";

const router = express.Router();

// 📝 Rota para listar todos os cursos com seções e capítulos
router.get("/", listarCursos);

// 📝 Rota para pegar um curso pelo ID (completo)
router.get("/:id", getCursoPorId);

export default router;
