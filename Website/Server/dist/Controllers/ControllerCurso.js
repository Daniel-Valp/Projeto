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
        console.log("📥 Dados recebidos para criar curso:", req.body);
        const { professorid, professornome, subcategoriaid } = req.body;
        // 👉 Substitui manualmente o categoria_id aqui
        const categoria_id = "cdbcca83-2c95-4e51-ac14-ad1ba34f0df2";
        console.log("➡️ professorid:", professorid);
        console.log("➡️ professornome:", professornome);
        console.log("➡️ categoria_id (fixo):", categoria_id);
        console.log("➡️ subcategoriaid:", subcategoriaid);
        if (!professorid || !professornome || !categoria_id || !subcategoriaid) {
            console.log("⚠️ Faltando dados necessários");
            res.status(400).json({ message: "Nome e ID do professor, categoria e subcategoria são necessários" });
            return;
        }
        const newCourse = await Curso.create({
            cursoid: uuidv4(),
            professorid,
            professornome,
            titulo: "Curso sem título",
            descricao: "",
            categoria_id, // ✅ Usando o UUID fixo aqui
            imagem: "",
            nivel: "Iniciante",
            estado: "Rascunho",
            horas: 0,
            subcategoriaid,
            enlistados: 0,
            criadoem: new Date(),
            atualizadoem: new Date(),
        });
        console.log("✅ Novo curso criado:", newCourse);
        res.json({ message: "Curso criado com sucesso", data: newCourse });
    }
    catch (error) {
        console.error("❌ Erro ao criar curso:", error);
        res.status(500).json({ message: "Erro ao criar o curso", error });
    }
};
export const atualizarCurso = async (req, res) => {
    const { id: cursoid } = req.params;
    const updateData = { ...req.body };
    const { userId } = getAuth(req);
    console.log("🔧 Início da atualização do curso");
    console.log("📦 Params:", req.params);
    console.log("👤 Usuário autenticado:", userId);
    console.log("📬 Dados recebidos:", updateData);
    if (!cursoid) {
        console.log("❌ cursoid ausente");
        res.status(400).json({ message: "ID do curso é obrigatório." });
        return;
    }
    try {
        console.log("🔎 Procurando curso com ID:", cursoid);
        const curso = await Curso.findByPk(cursoid);
        if (!curso) {
            console.log("⚠️ Curso não encontrado.");
            res.status(404).json({ message: "Curso não foi encontrado." });
            return;
        }
        const professorIdNoCurso = curso.getDataValue("professorid");
        console.log("👨‍🏫 Professor do curso:", professorIdNoCurso);
        if (professorIdNoCurso !== userId) {
            console.log("🚫 Permissão negada. ID do usuário:", userId);
            res.status(403).json({ message: "Não está autorizado a modificar este curso." });
            return;
        }
        // Log da hora
        if (updateData.horas) {
            console.log("⏱️ Hora recebida:", updateData.horas);
            const hora = parseInt(updateData.horas);
            if (isNaN(hora) || hora <= 0) {
                console.log("❌ Hora inválida:", updateData.horas);
                res.status(400).json({
                    message: "Hora em formato inválido",
                    error: "A hora precisa ser um valor numérico válido e maior que zero."
                });
                return;
            }
            updateData.horas = hora;
        }
        // Seções
        if (updateData.secoes) {
            console.log("🧩 Seções recebidas (brutas):", updateData.secoes);
            try {
                const sectionsData = typeof updateData.secoes === "string"
                    ? JSON.parse(updateData.secoes)
                    : updateData.secoes;
                console.log("✅ Seções após parse:", sectionsData);
                updateData.secoes = sectionsData.map((Secao) => {
                    const novaSecao = {
                        ...Secao,
                        Secaoid: Secao.Secaoid || uuidv4(),
                        Capitulo: Array.isArray(Secao.capitulos)
                            ? Secao.capitulos.map((Capitulo) => ({
                                ...Capitulo,
                                Capituloid: Capitulo.Capituloid || uuidv4(),
                            }))
                            : [],
                    };
                    console.log("📚 Secao formatada:", novaSecao);
                    return novaSecao;
                });
            }
            catch (error) {
                console.log("❌ Erro ao processar as seções:", error);
                res.status(400).json({ message: "Erro ao processar as seções", error });
                return;
            }
        }
        console.log("📤 Dados finais para atualização:", updateData);
        const atualizado = await curso.update(updateData);
        console.log("✅ Curso atualizado com sucesso:", atualizado);
        res.status(200).json({
            data: {
                message: "Curso atualizado com sucesso",
                curso: atualizado,
            }
        });
    }
    catch (error) {
        console.log("🔥 Erro inesperado durante atualização:", error);
        res.status(500).json({
            message: "Erro ao atualizar o curso",
            error,
        });
    }
};
export const apagarCurso = async (req, res) => {
    console.log("🔑 Parâmetros recebidos:", req.params); // Log para ver se o id está vindo correto
    const { id } = req.params;
    const { userId } = getAuth(req);
    try {
        // Buscar curso pelo ID
        const curso = await Curso.findByPk(id);
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
        res.json({ data: { message: "Curso apagado com sucesso" } });
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
