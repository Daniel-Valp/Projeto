import express from "express";
import cors from "cors";
import CursoRoutes from "./Routes/CursoRoutes.js";  // 👈 Certifique-se de adicionar ".js"

const app = express();
app.use(express.json());
app.use(cors());

// Rota inicial
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Ativar rotas de cursos
app.use("/cursos", CursoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
