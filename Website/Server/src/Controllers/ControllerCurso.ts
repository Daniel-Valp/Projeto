import { Request, Response } from "express";
import { Curso, Secao, Capitulo, Categoria, Subcategoria } from "../models/cursomodels"; // Importação nomeada
import { v4 as uuidv4 } from "uuid"
import { getAuth } from "@clerk/express";
import { getEligibleUsers } from "../utils/getEligibleUsers";
import { sendEmail } from "../utils/sendemail";
import { clerkClient } from "@clerk/clerk-sdk-node";



// 📌 Função para listar TODOS os cursos com suas seções e capítulos
export const listarCursos = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
        console.error("Erro ao buscar cursos:", error);
        res.status(500).json({ message: "Erro ao buscar cursos", error });
    }
};

// 📌 Função para buscar UM curso pelo ID (completo)
export const getCursoPorId = async (req: Request, res: Response): Promise<void> => {
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
  } catch (error) {
      console.error("❌ Erro ao buscar curso:", error);
      res.status(500).json({ message: "Erro ao buscar curso", error });
  }
};

export const criarCurso = async (req: Request, res: Response): Promise<void> => {
  try {
    const { professorid, subcategoriaid } = req.body;
    let professornome = "Professor desconhecido";

    if (!professorid || !professornome || !subcategoriaid) {
      res.status(400).json({ message: "Campos obrigatórios ausentes" });
      return;
    }

    const categoriaDefault = 'cdbcca83-2c95-4e51-ac14-ad1ba34f0df2';

    const categoriaVerificada = await Categoria.findByPk(categoriaDefault);
    if (!categoriaVerificada) {
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
      subcategoriaid,
      enlistados: 0,
      criadoem: new Date(),
      atualizadoem: new Date(),
    });


// Buscar nome real do professor no Clerk
try {
  const professor = await clerkClient.users.getUser(professorid);
  professornome = professor.firstName
    ? `${professor.firstName} ${professor.lastName || ''}`.trim()
    : professor.username || "Professor desconhecido";
} catch (e) {
  console.warn(`⚠️ Não foi possível obter nome do professor ${professorid}:`, e);
}


    console.log("✅ Curso criado com sucesso:", novoCurso);

    // Busca os usuários elegíveis para notificação
    const users = await getEligibleUsers("course");
    console.log("📋 Utilizadores elegíveis:", users.map(u => u.emailAddresses[0]?.emailAddress));

    

    res.status(201).json({
      data: {
        curso: novoCurso.toJSON(),
        message: "Curso criado com sucesso",
      },
    });

  } catch (error) {
    console.error("❌ Erro ao criar curso:", error);
    res.status(500).json({ message: "Erro ao criar o curso", error });
  }
};

  
  
  

export const atualizarCurso = async (req: Request, res: Response): Promise<void> => {
  const { id: cursoid } = req.params;
  const updateData = { ...req.body };
  const { userId } = getAuth(req);

if (!userId) {
  res.status(401).json({ message: "Usuário não autenticado." });
  return;
}


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

    if (req.file) {
      const buffer = req.file.buffer;
      const base64Image = buffer.toString("base64");
      const mimeType = req.file.mimetype;
      const dataUrl = `data:${mimeType};base64,${base64Image}`;
      updateData.imagem = dataUrl;
      console.log("🖼️ Nova imagem recebida e processada.");
    }

    const estadoAnterior = curso.getDataValue("estado");
    const estadoNovo = updateData.estado;

    await curso.update({
      ...updateData,
      atualizadoem: new Date(),
    });

    console.log("✅ Curso atualizado com dados básicos.");

    // Se mudou para "publicado"
    if (
      estadoNovo &&
      estadoNovo.toLowerCase() === "publicado" &&
      estadoAnterior.toLowerCase() !== "publicado"
    ) {
      console.log(`🚀 Curso ${cursoid} publicado, enviando notificações...`);

      const users = await getEligibleUsers();

      // Pega o nome do professor via Clerk
      let professornome = "Professor desconhecido";
      try {
        const professor = await clerkClient.users.getUser(userId);
        professornome = professor.firstName
          ? `${professor.firstName} ${professor.lastName || ""}`.trim()
          : professor.username || "Professor desconhecido";
      } catch (e) {
        console.warn(`⚠️ Não foi possível obter nome do professor ${userId}:`, e);
      }

     // Obtém seções e capítulos para contar
const secoes = await Secao.findAll({ where: { cursoid } });
let totalCapitulos = 0;

for (const secao of secoes) {
  const capitulos = await Capitulo.findAll({
  where: { secaoid: secao.getDataValue("secaoid") }
});

  totalCapitulos += capitulos.length;
}

// Data formatada
const dataPublicacao = new Date().toLocaleDateString("pt-PT", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
});

// Corpo do email
const emailHtml = `
  <div style="font-family: Arial, sans-serif; max-width: 700px; margin: auto; padding: 20px; background-color: #f9f9f9; border-radius: 8px; border: 1px solid #ddd;">
    <h2 style="color: #2c3e50; text-align: center;">📢 Novo Curso Publicado</h2>
    <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />

    <p><strong>🎓 Título do Curso:</strong> ${curso.getDataValue("titulo")}</p>
    <p><strong>👨‍🏫 Professor:</strong> ${professornome}</p>
    <p><strong>📅 Publicado em:</strong> ${dataPublicacao}</p>
    <p><strong>📚 Seções:</strong> ${secoes.length}</p>
    <p><strong>🎬 Capítulos:</strong> ${totalCapitulos}</p>

    <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />
    <p style="text-align: center; color: #888;">Esta é uma notificação automática sobre novos cursos disponíveis na plataforma.</p>
    <p style="text-align: center; color: #888;">Caso não queria receber mais emails desative a opção nas definições pessoais.</p>
  </div>
`;


await Promise.allSettled(
  users.map(user =>
    sendEmail(
      user.emailAddresses[0].emailAddress,
      "📢 Novo curso publicado!",
      emailHtml
    )
  )
);


      console.log("📧 Emails de notificação enviados.");
    }

    if (updateData.secoes) {
      const secoesRecebidas =
        typeof updateData.secoes === "string" ? JSON.parse(updateData.secoes) : updateData.secoes;

      console.log("🔄 Seções recebidas:", secoesRecebidas);

      await Capitulo.destroy({
        where: { secaoid: secoesRecebidas.map((s: { secaoid: string }) => s.secaoid) },
      });

      await Secao.destroy({ where: { cursoid } });

      console.log("🗑️ Seções e capítulos antigos apagados.");

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
  } catch (error) {
    console.error("🔥 Erro ao atualizar curso:", error);
    res.status(500).json({ message: "Erro ao atualizar o curso", error });
  }
};


  
  
  

export const apagarCurso = async (req: Request, res: Response): Promise<void> => {
    console.log("🔑 Parâmetros recebidos:", req.params);  // Log para ver se o id está vindo correto
    
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
    } catch (error) {
        res.status(500).json({ message: "Erro ao apagar o curso", error });
    }
};




export const listarCategorias = async (req: Request, res: Response): Promise<void> => {
    try {
        const categorias = await Categoria.findAll(); // Busca todas as categorias no banco de dados
        res.json({ message: "Lista de categorias carregada com sucesso", data: categorias });
    } catch (error) {
        console.error("Erro ao buscar categorias:", error);
        res.status(500).json({ message: "Erro ao buscar categorias", error });
    }
};

export const listarSubcategorias = async (req: Request, res: Response): Promise<void> => {
    try {
      const subcategorias = await Subcategoria.findAll(); // Busca todas as subcategorias
      res.json({ message: "Lista de subcategorias carregada com sucesso", data: subcategorias });
    } catch (error) {
      console.error("Erro ao buscar subcategorias:", error);
      res.status(500).json({ message: "Erro ao buscar subcategorias", error });
    }
  };
  

export const enlistarUsuario = async (req: Request, res: Response): Promise<void> => {
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
    } catch (error) {
      console.error("Erro ao inscrever usuário:", error);
      res.status(500).json({ message: "Erro ao inscrever usuário", error });
    }
};
  