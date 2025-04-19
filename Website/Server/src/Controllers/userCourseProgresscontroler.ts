import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import {
  ProgressoCursoUsuario,
  ProgressoSecao,
  ProgressoCapitulo,
} from "../models/userprogress.js";
import { Curso } from "../models/cursomodels.js"; // já definido por ti
import { calculateOverallProgress, mergeSections } from "../utils/utils.js";

export const getUserEnrolledCourses = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const auth = getAuth(req);

  if (!auth || auth.userId !== userId) {
    res.status(403).json({ message: "Access denied" });
    return;
  }

  try {
    const enrolled = await ProgressoCursoUsuario.findAll({
      where: { usuarioid: userId },
      include: [{ model: Curso, as: "curso" }],
    });

    res.json({
      message: "Cursos inscritos obtidos com sucesso",
      data: enrolled.map((e) => e.cursoid),
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao obter cursos inscritos",
      error,
    });
  }
};

export const getUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;

  try {
    // ✅ Correto para findOne com includes aninhados
    let progresso = await ProgressoCursoUsuario.findOne({
        where: {
          usuarioid: userId,
          cursoid: courseId,
        },
        include: [
          {
            model: ProgressoSecao,
            as: "secoes",
            include: [
              {
                model: ProgressoCapitulo,
                as: "capitulos",
              },
            ],
          },
        ],
      });
      
  

    if (!progresso) {
      res
        .status(404)
        .json({ message: "Progresso do curso não encontrado para este utilizador" });
      return;
    }

    res.json({
      message: "Progresso do curso obtido com sucesso",
      data: progresso,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erro ao obter progresso do curso",
      error,
    });
  }
};

export const updateUserCourseProgress = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, courseId } = req.params;
  const { secoes } = req.body;

  try {
    let progresso = await ProgressoCursoUsuario.findOne({
        where: {
          usuarioid: userId,
          cursoid: courseId,
        },
        include: [
          {
            model: ProgressoSecao,
            as: "secoes",
            include: [
              {
                model: ProgressoCapitulo,
                as: "capitulos",
              },
            ],
          },
        ],
      });
      

    if (!progresso) {
      // Criar novo progresso se não existir
      progresso = await ProgressoCursoUsuario.create({
        usuarioid: userId,
        cursoid: courseId,
        data_inscricao: new Date(),
        progresso_geral: 0,
        ultimo_acesso: new Date(),
      });
    }

    // Atualizar secoes e capítulos (forma simplificada)
    for (const secao of secoes) {
      let progressoSecao = await ProgressoSecao.findOne({
        where: {
          secaoid: secao.secaoid,
          progressoCursoId: progresso.id,
        },
      });

      if (!progressoSecao) {
        progressoSecao = await ProgressoSecao.create({
          secaoid: secao.secaoid,
          progressoCursoId: progresso.id,
        });
      }

      for (const capitulo of secao.capitulos) {
        let progressoCap = await ProgressoCapitulo.findOne({
          where: {
            progressoSecaoId: progressoSecao.id,
            capituloid: capitulo.capituloid,
          },
        });

        if (!progressoCap) {
          await ProgressoCapitulo.create({
            progressoSecaoId: progressoSecao.id,
            capituloid: capitulo.capituloid,
            concluido: capitulo.concluido,
          });
        } else {
          await progressoCap.update({ concluido: capitulo.concluido });
        }
      }
    }

    // Recalcular progresso geral
    const todasSecoes = await ProgressoSecao.findAll({
      where: { progressoCursoId: progresso.id },
      include: { model: ProgressoCapitulo, as: "capitulos" },
    });

    const progressoTotal = calculateOverallProgress(todasSecoes);
    await progresso.update({
      progresso_geral: progressoTotal,
      ultimo_acesso: new Date(),
    });

    res.json({
      message: "Progresso atualizado com sucesso",
      data: progresso,
    });
  } catch (error) {
    console.error("Erro ao atualizar progresso:", error);
    res.status(500).json({
      message: "Erro ao atualizar progresso",
      error,
    });
  }
};
