import express from "express";
import { getCurso, listarCursos } from "../Controllers/ControllerCurso.js";

const router = express.Router();
router.get("/", listarCursos);
router.get("/:cursoid", getCurso);

export default router;
