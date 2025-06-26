import express from "express";
import {
  criarCategoria,
  criarSubcategoria,
  atualizarCategoria,
  apagarCategoria,
  atualizarSubcategoria,
  apagarSubcategoria,
} from "../Controllers/catesubcatController";

const router = express.Router();

// 📝 Rotas para Categorias
router.post("/categorias", criarCategoria);           // Criar nova categoria
router.put("/categorias/:id", atualizarCategoria);     // Atualizar categoria pelo id
router.delete("/categorias/:id", apagarCategoria);     // Apagar categoria pelo id

// 📝 Rotas para Subcategorias
router.post("/subcategorias", criarSubcategoria);           // Criar nova subcategoria
router.put("/subcategorias/:id", atualizarSubcategoria);     // Atualizar subcategoria pelo id
router.delete("/subcategorias/:id", apagarSubcategoria);     // Apagar subcategoria pelo id

export default router;
