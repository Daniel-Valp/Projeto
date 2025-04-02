// routes/curso.js

import express from "express";
import multer from "multer";
import { apagarCurso, atualizarCurso, criarCurso, getCursoPorId, listarCursos } from "../Controllers/ControllerCurso.js";
import { listarCategorias } from "../Controllers/ControllerCurso.js";  // Importa o controlador de categorias
import { requireAuth } from "@clerk/express";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 📝 Rota para listar todos os cursos com seções e capítulos
router.get("/", listarCursos);

// 📝 Rota para listar todas as categorias
router.get("/categorias", listarCategorias);  // Nova rota para obter as categorias

// 📝 Rota para pegar um curso pelo ID (completo)
router.get("/:id", getCursoPorId);


router.post("/", requireAuth(), criarCurso);

router.put("/:id", requireAuth(), upload.single("image"), atualizarCurso);

router.delete("/:id", requireAuth(), apagarCurso);

export default router;
