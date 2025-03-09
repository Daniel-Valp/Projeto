import express from "express";
import { getCursos, listarCursos } from "../Controllers/ControllerCurso.js";
const router = express.Router();
router.get("/", listarCursos);
router.get("/:cursoid", getCursos);
export default router;
