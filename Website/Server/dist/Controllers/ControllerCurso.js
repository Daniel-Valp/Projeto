import { Curso, Secao, Capitulo } from "../models/cursomodels.js"; // Importação nomeada
import { v4 as uuidv4 } from "uuid";
// 📌 Função para listar TODOS os cursos com suas seções e capítulos
export const listarCursos = async (req, res) => {
    const { categoria } = req.query;
    try {
        let whereClause = {};
        if (categoria && categoria !== "all") {
            whereClause = { categoria };
        }
        const cursos = await Curso.findAll({
            where: whereClause,
            include: [
                {
                    model: Secao,
                    as: "secoes",
                    include: [
                        {
                            model: Capitulo,
                            as: "capitulos",
                        },
                    ],
                },
            ],
        });
        res.json({ message: "Lista de cursos completa", data: cursos });
    }
    catch (error) {
        console.error("Erro ao buscar cursos:", error);
        res.status(500).json({ message: "Erro ao buscar cursos", error });
    }
};
// 📌 Função para buscar UM curso pelo ID (completo)
export const getCursoPorId = async (req, res) => {
    const { id } = req.params;
    console.log("🔍 ID recebido:", id); // 👀 Verifica se o ID está correto
    if (!id) {
        res.status(400).json({ message: "ID do curso não fornecido" });
        return;
    }
    try {
        const curso = await Curso.findOne({
            where: { cursoid: id }, // Verifica se cursoid é a chave correta
            include: [
                {
                    model: Secao,
                    as: "secoes",
                    include: [
                        {
                            model: Capitulo,
                            as: "capitulos",
                        },
                    ],
                },
            ],
        });
        if (!curso) {
            res.status(404).json({ message: "Curso não encontrado" });
            return;
        }
        res.json({ message: "Curso encontrado", data: curso });
    }
    catch (error) {
        console.error("❌ Erro ao buscar curso:", error);
        res.status(500).json({ message: "Erro ao buscar curso", error });
    }
};
export const criarCurso = async (req, res) => {
    try {
        const { professorid, professornome, subcategoriaid } = req.body;
        if (!professorid || !professornome) {
            res.status(400).json({ message: "Nome e ID do professor são necessários" });
            return;
        }
        const newCourse = await Curso.create({
            cursoid: uuidv4(),
            professorid,
            professornome,
            titulo: "Curso sem título",
            descricao: "",
            categoria: "Sem categoria",
            imagem: "",
            horas: 0,
            nivel: "Beginner",
            estado: "Draft",
            subcategoriaid: subcategoriaid || null,
            criadoem: new Date(),
            atualizadoem: new Date(),
        });
        res.json({ message: "Curso criado com sucesso", data: newCourse });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao criar o curso", error });
    }
};
