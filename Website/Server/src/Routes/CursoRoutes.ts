// routes/curso.js

import express from "express";
import multer from "multer";
import { 
  apagarCurso,
  atualizarCurso,
  criarCurso,
  getCursoPorId,
  listarCursos,
  listarSubcategorias,
  listarCategorias,
  enlistarUsuario
} from "../Controllers/ControllerCurso";
import { requireAuth } from "@clerk/express";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// 📝 Rota para listar todos os cursos com seções e capítulos
router.get("/", listarCursos);

// ✅ MANTÉM essas duas ANTES do :id
router.get("/categorias", listarCategorias);
router.get("/subcategorias", listarSubcategorias); // 👈 IMPORTANTE estar antes

router.post("/:cursoid/enlistar", enlistarUsuario);

// 📝 Essa rota genérica SEMPRE por último
router.get("/:id", getCursoPorId);

router.post("/", requireAuth(), criarCurso);
router.put("/:id", requireAuth(), upload.single("imagem"), atualizarCurso);
router.delete("/:id", requireAuth(), apagarCurso);



export default router;
