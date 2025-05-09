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
            attributes: { include: ["enlistados"] },
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
                {
                    model: Categoria,
                    as: "categoria",
                },
                {
                    model: Subcategoria,
                    as: "subcategoria",
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
                {
                    model: Categoria,
                    as: "categoria", // ⬅️ Garante que o alias bate com o definido no modelo
                },
                {
                    model: Subcategoria,
                    as: "subcategoria", // ⬅️ Mesmo aqui
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
        console.log("📥 Dados recebidos no corpo da requisição:", req.body);
        if (!professorid || !professornome || !subcategoriaid) {
            console.log("⚠️ Campos obrigatórios ausentes");
            res.status(400).json({ message: "Campos obrigatórios ausentes" });
            return;
        }
        const categoriaDefault = 'cdbcca83-2c95-4e51-ac14-ad1ba34f0df2'; // deve existir na tabela "categorias"
        console.log("🆕 UUID gerado para categoria:", categoriaDefault);
        const categoriaVerificada = await Categoria.findByPk(categoriaDefault);
        if (!categoriaVerificada) {
            console.error("❌ Categoria não foi persistida no banco!");
            res.status(500).json({ message: "Erro ao salvar categoria no banco" });
            return;
        }
        const novoCurso = await Curso.create({
            professorid,
            professornome,
            titulo: "Curso sem título",
            descricao: "",
            categoria_id: categoriaDefault,
            imagem: "",
            nivel: "Iniciante",
            estado: "Rascunho",
            horas: 0,
            subcategoriaid, // <- já vem do req.body
            enlistados: 0,
            criadoem: new Date(),
            atualizadoem: new Date(),
        });
        console.log("✅ Curso criado com sucesso:", novoCurso);
        res.status(201).json({
            data: {
                curso: novoCurso,
                message: "Curso criado com sucesso"
            }
        });
    }
    catch (error) {
        console.error("❌ Erro ao criar curso:", error);
        res.status(500).json({ message: "Erro ao criar o curso", error });
    }
};
export const atualizarCurso = async (req, res) => {
    const { id: cursoid } = req.params;
    const updateData = { ...req.body };
    const { userId } = getAuth(req); // Assume que isso retorna o ID do professor autenticado
    console.log("🔄 Requisição para atualizar curso:", cursoid);
    console.log("📥 Dados recebidos para atualização:", updateData);
    if (!cursoid) {
        res.status(400).json({ message: "ID do curso é obrigatório." });
        return;
    }
    try {
        const curso = await Curso.findByPk(cursoid);
        if (!curso) {
            console.warn("⚠️ Curso não encontrado:", cursoid);
            res.status(404).json({ message: "Curso não foi encontrado." });
            return;
        }
        if (curso.getDataValue("professorid") !== userId) {
            console.warn("⛔ Acesso não autorizado para o curso:", cursoid);
            res.status(403).json({ message: "Não autorizado." });
            return;
        }
        await curso.update({
            ...updateData,
            atualizadoem: new Date(),
        });
        console.log("✅ Curso atualizado com dados básicos.");
        if (updateData.secoes) {
            const secoesRecebidas = typeof updateData.secoes === "string"
                ? JSON.parse(updateData.secoes)
                : updateData.secoes;
            console.log("🔄 Seções recebidas:", secoesRecebidas);
            // Remove capítulos e seções anteriores
            await Capitulo.destroy({
                where: { secaoid: secoesRecebidas.map((s) => s.secaoid) },
            });
            await Secao.destroy({ where: { cursoid } });
            console.log("🗑️ Seções e capítulos antigos apagados.");
            // Recria novas seções e capítulos
            for (const secao of secoesRecebidas) {
                const novaSecao = await Secao.create({
                    secaoid: secao.secaoid || uuidv4(),
                    cursoid,
                    secaotitulo: secao.secaotitulo,
                    secaodescricao: secao.secaodescricao || "",
                });
                console.log("➕ Nova seção criada:", novaSecao.toJSON());
                if (Array.isArray(secao.capitulos)) {
                    for (const capitulo of secao.capitulos) {
                        const novoCapitulo = await Capitulo.create({
                            capituloid: capitulo.capituloid || uuidv4(),
                            secaoid: novaSecao.getDataValue("secaoid"),
                            type: capitulo.type || "Video",
                            capitulotitulo: capitulo.capitulotitulo,
                            conteudo: capitulo.conteudo || "",
                            video: capitulo.video || "",
                            freepreview: capitulo.freepreview || false,
                        });
                        console.log("📚 Capítulo criado:", novoCapitulo.toJSON());
                    }
                }
            }
        }
        res.status(200).json({
            message: "Curso atualizado com sucesso",
            data: curso,
        });
    }
    catch (error) {
        console.error("🔥 Erro ao atualizar curso:", error);
        res.status(500).json({ message: "Erro ao atualizar o curso", error });
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
export const enlistarUsuario = async (req, res) => {
    const { cursoid } = req.params;
    const { userId } = getAuth(req); // Pega o ID do usuário logado
    try {
        const curso = await Curso.findByPk(cursoid);
        if (!curso) {
            res.status(404).json({ message: "Curso não encontrado." });
            return;
        }
        // ✅ Incrementa os enlistados (pode ser um número ou array, dependendo da modelagem)
        const enlistadosAtuais = curso.getDataValue("enlistados") || 0;
        curso.set("enlistados", enlistadosAtuais + 1);
        await curso.save();
        res.status(200).json({ message: "Usuário inscrito com sucesso", curso });
    }
    catch (error) {
        console.error("Erro ao inscrever usuário:", error);
        res.status(500).json({ message: "Erro ao inscrever usuário", error });
    }
};
