import express from "express";
import cors from "cors";
import CursoRoutes from "./Routes/CursoRoutes.js";
import userClerkRoutes from "./Routes/userClerkRoutes.js";
import userCourseProgressRoutes from "./Routes/usercourseprogress.js";
import graphRoutes from "./Routes/graphroutes.js"; // ✅ CERTO
import { clerkMiddleware, createClerkClient, requireAuth } from "@clerk/express";
const app = express();
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());
export const clerkClient = createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY
});
// Rota inicial
app.get("/", (req, res) => {
    res.send("Servidor rodando!");
});
// Rotas
app.use("/cursos", CursoRoutes);
app.use("/users/clerk", requireAuth(), userClerkRoutes);
app.use("/api/progresso", userCourseProgressRoutes);
app.use("/api", graphRoutes);
// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
