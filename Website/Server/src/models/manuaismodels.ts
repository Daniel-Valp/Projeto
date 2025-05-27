// src/models/manuaismodels.ts
import { DataTypes } from "sequelize";
import sequelize from "../db";

const Manual = sequelize.define("manuais", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  imagem_capa_url: {
    type: DataTypes.TEXT,
  },
  arquivo_pdf_url: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  categoria_id: {
    type: DataTypes.UUID,
  },
  subcategoria_id: {
    type: DataTypes.INTEGER,
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: false, // 👈 Adiciona esta linha aqui!
});


export default Manual;
