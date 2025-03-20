import express from "express";
import cors from "cors";
import CursoRoutes from "./Routes/CursoRoutes.js";  // 👈 Certifique-se de adicionar ".js"
import { createClerkClient } from "@clerk/express";
import userClerkRoutes from "./Routes/userClerkRoutes.js"

const app = express();
app.use(express.json());
app.use(cors());


export const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY
})

// Rota inicial
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Ativar rotas de cursos
app.use("/cursos", CursoRoutes);
app.use("/users/clerk", userClerkRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
