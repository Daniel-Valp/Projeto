require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(express.json());
app.use(cors());

// Configuração do banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT
});

// Testar conexão
pool.connect()
  .then(() => console.log("🟢 Conectado ao PostgreSQL"))
  .catch(err => console.error("🔴 Erro ao conectar ao banco:", err));

// Rota inicial
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
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
  });

  app.post("/testeinserir", async (req, res) => {
    try {
        console.log("🚀 Inserindo dados no banco...");

        const query = `
            INSERT INTO teste (nome, idade) 
            VALUES ('sandra', 29) 
            RETURNING *`;

        const result = await pool.query(query);
        console.log("✅ Dados inseridos:", result.rows[0]);

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error("❌ Erro ao inserir no banco:", err);
        res.status(500).json({ error: err.message });
    }
});

// 🔹 Rota para buscar todos os registros da tabela "teste"
app.get("/teste", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM teste");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

