import { Curso, Secao, Capitulo, Categoria, Subcategoria } from "../models/cursomodels.js"; // Importação nomeada
import { v4 as uuidv4 } from "uuid";
import { getAuth } from "@clerk/express";
// 📌 Função para listar TODOS os cursos com suas seções e capítulos
export const listarCursos = async (req, res) => {
    const { categoria } = req.query;
    try {
        let whereClause = {};
        if (categoria && categoria !== "all") {
            whereClause = { categoria };
        }
        const cursos = await Curso.findAll({
            attributes: { include: ["enlistados"] }, // 🔥 Força a inclusão de enlistados
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
            nivel: "Iniciante",
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
export const atualizarCurso = async (req, res) => {
    const { cursoid } = req.params;
    const updateData = { ...req.body };
    const { userId } = getAuth(req);
    if (!cursoid) {
        res.status(400).json({ message: "ID do curso é obrigatório." });
        return;
    }
    try {
        // Buscar curso pelo ID
        const curso = await Curso.findByPk(cursoid);
        if (!curso) {
            res.status(404).json({ message: "Curso não foi encontrado." });
            return;
        }
        // Verificar se o usuário tem permissão para modificar
        if (curso.getDataValue("professorid") !== userId) {
            res.status(403).json({ message: "Não está autorizado a modificar este curso." });
            return;
        }
        // Validar a hora
        if (updateData.horas) {
            const hora = parseInt(updateData.horas);
            if (isNaN(hora) || hora <= 0) {
                res.status(400).json({
                    message: "Hora em formato inválido",
                    error: "A hora precisa ser um valor numérico válido e maior que zero."
                });
                return;
            }
            updateData.horas = hora; // Mantendo sem multiplicação por 100
        }
        // Validar as seções do curso
        if (updateData.secoes) {
            try {
                const sectionsData = typeof updateData.secoes === "string"
                    ? JSON.parse(updateData.secoes)
                    : updateData.secoes;
                updateData.secoes = sectionsData.map((Secao) => ({
                    ...Secao,
                    Secaoid: Secao.Secaoid || uuidv4(),
                    Capitulo: Array.isArray(Secao.capitulos)
                        ? Secao.capitulos.map((Capitulo) => ({
                            ...Capitulo,
                            Capituloid: Capitulo.Capituloid || uuidv4(),
                        }))
                        : [],
                }));
            }
            catch (error) {
                res.status(400).json({ message: "Erro ao processar as seções", error });
                return;
            }
        }
        // Atualizar o curso com os novos dados
        await curso.update(updateData);
        res.json({ message: "Curso atualizado com sucesso", data: curso });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao atualizar o curso", error });
    }
};
export const apagarCurso = async (req, res) => {
    const { cursoid } = req.params;
    const { userId } = getAuth(req);
    try {
        // Buscar curso pelo ID
        const curso = await Curso.findByPk(cursoid);
        if (!curso) {
            res.status(404).json({ message: "Curso não foi encontrado." });
            return;
        }
        // Verificar se o usuário tem permissão para apagar
        if (curso.getDataValue("professorid") !== userId) {
            res.status(403).json({ message: "Não está autorizado a apagar este curso." });
            return;
        }
        // 🔥 Apagar o curso corretamente
        await curso.destroy();
        res.json({ message: "Curso apagado com sucesso" });
    }
    catch (error) {
        res.status(500).json({ message: "Erro ao apagar o curso", error });
    }
};
export const listarCategorias = async (req, res) => {
    try {
        const categorias = await Categoria.findAll(); // Busca todas as categorias no banco de dados
        res.json({ message: "Lista de categorias carregada com sucesso", data: categorias });
    }
    catch (error) {
        console.error("Erro ao buscar categorias:", error);
        res.status(500).json({ message: "Erro ao buscar categorias", error });
    }
};
export const listarSubcategorias = async (req, res) => {
    try {
        const subcategorias = await Subcategoria.findAll(); // Busca todas as subcategorias
        res.json({ message: "Lista de subcategorias carregada com sucesso", data: subcategorias });
    }
    catch (error) {
        console.error("Erro ao buscar subcategorias:", error);
        res.status(500).json({ message: "Erro ao buscar subcategorias", error });
    }
};
