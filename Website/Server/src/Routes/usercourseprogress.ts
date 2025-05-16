import express from "express";
import {
  getUserCourseProgress,
  getUserEnrolledCourses,
  updateUserCourseProgress,
} from "../Controllers/userCourseProgresscontroler"; // ← garante que tens ".js" no final se usares ES Modules

const router = express.Router();

// 🔹 Obter todos os cursos em que o utilizador está inscrito
router.get("/:userId/enrolled-courses", getUserEnrolledCourses);

// 🔹 Obter progresso de um curso específico
router.get("/:userId/courses/:courseId", getUserCourseProgress);

// 🔹 Atualizar progresso de um curso específico
router.put("/:userId/courses/:courseId", updateUserCourseProgress);

export default router;
