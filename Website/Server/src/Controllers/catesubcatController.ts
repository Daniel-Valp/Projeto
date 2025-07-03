// Controllers/CategoriasController.ts
import { Request, Response } from "express";
import { Categoria, Subcategoria } from "../models/cursomodels";
import { Model } from "sequelize";

// Interfaces para tipar os modelos
interface CategoriaAttributes {
  id: string;
  nome: string;
}
interface CategoriaInstance extends Model<CategoriaAttributes>, CategoriaAttributes {}

interface SubcategoriaAttributes {
  subcategoriaid: string;
  nome: string;
}
interface SubcategoriaInstance extends Model<SubcategoriaAttributes>, SubcategoriaAttributes {}

// POST /api/categorias
export const criarCategoria = async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    const novaCategoria = await Categoria.create({ nome });
    res.status(201).json({ message: "Categoria criada com sucesso", data: novaCategoria });
  } catch (err) {
    res.status(500).json({ message: "Erro ao criar categoria", error: err });
  }
};

// POST /api/subcategorias
export const criarSubcategoria = async (req: Request, res: Response) => {
  try {
    const { nome } = req.body;
    const novaSubcategoria = await Subcategoria.create({ nome }); // sem passar subcategoriaid
    res.status(201).json({ message: "Serviço criado com sucesso", data: novaSubcategoria });
  } catch (err) {
    console.error("Erro ao criar serviço:", err);
    res.status(500).json({ message: "Erro ao criar serviço", error: err });
  }
};


// PUT /api/categorias/:id
export const atualizarCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const categoria = await Categoria.findByPk(id) as CategoriaInstance | null;
    if (!categoria) return res.status(404).json({ message: "Categoria não encontrada" });

    categoria.nome = nome;
    await categoria.save();

    res.json({ message: "Categoria atualizada com sucesso", data: categoria });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar categoria", error: err });
  }
};

// DELETE /api/categorias/:id
export const apagarCategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id) as CategoriaInstance | null;
    if (!categoria) return res.status(404).json({ message: "Categoria não encontrada" });

    await categoria.destroy();
    res.json({ message: "Categoria apagada com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao apagar categoria", error: err });
  }
};

// PUT /api/subcategorias/:id
export const atualizarSubcategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome } = req.body;

    const subcategoria = await Subcategoria.findByPk(id) as SubcategoriaInstance | null;
    if (!subcategoria) return res.status(404).json({ message: "Serviço não encontrado" });

    subcategoria.nome = nome;
    await subcategoria.save();

    res.json({ message: "Serviço atualizado com sucesso", data: subcategoria });
  } catch (err) {
    res.status(500).json({ message: "Erro ao atualizar o serviço", error: err });
  }
};

// DELETE /api/subcategorias/:id
export const apagarSubcategoria = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const subcategoria = await Subcategoria.findByPk(id) as SubcategoriaInstance | null;
    if (!subcategoria) return res.status(404).json({ message: "Serviço não encontrado" });

    await subcategoria.destroy();
    res.json({ message: "Serviço apagado com sucesso" });
  } catch (err) {
    res.status(500).json({ message: "Erro ao apagar o serviço", error: err });
  }
};
