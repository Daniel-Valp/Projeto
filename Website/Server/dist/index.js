import express from "express";
import cors from "cors";
import CursoRoutes from "./Routes/CursoRoutes.js"; // 👈 Certifique-se de adicionar ".js"
const app = express();
app.use(express.json());
app.use(cors());
// Rota inicial
app.get("/", (req, res) => {
    res.send("Servidor rodando!");
});
// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
app.use("/cursos", CursoRoutes);
/*

// 📌 Rota para inserir um dado de teste
app.post("/testeinserir", async (req, res) => {
  try {
    console.log("🚀 Inserindo dados no banco...");

    const query = `
      INSERT INTO teste (nome, idade)
      VALUES ('Sandra', 29)
      RETURNING *`;

    const result = await pool.query(query);
    console.log("✅ Dados inseridos:", result.rows[0]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("❌ Erro ao inserir no banco:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📌 Rota para buscar todos os registros da tabela "teste"
app.get("/teste", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM teste");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Rota para CRIAR um novo curso
app.post("/cursos", async (req, res) => {
  try {
    const { professorid, professornome, titulo, descricao, categoria, imagem, nivel, estado, secao, enlistados, analise } = req.body;

    const query = `
      INSERT INTO curso (professorid, professornome, titulo, descricao, categoria, imagem, nivel, estado, secao, enlistados, analise, criadoem, atualizadoem)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *`;

    const values = [professorid, professornome, titulo, descricao, categoria, imagem, nivel, estado, secao, enlistados, analise];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 📌 Rota para listar os cursos
app.get("/cursos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM curso");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});*/ 
