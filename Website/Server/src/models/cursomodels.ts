import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Curso = sequelize.define("Curso", {
  cursoid: {
    type: DataTypes.UUID,  
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  professorid: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  professornome: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  titulo: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  descricao: {
    type: DataTypes.TEXT,
  },
  categoria: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  imagem: {
    type: DataTypes.TEXT,
  },
  nivel: {
    type: DataTypes.STRING, // Pode ser ENUM se houver opções fixas
    allowNull: false,
  },
  estado: {
    type: DataTypes.STRING, // Pode ser ENUM se houver opções fixas
    allowNull: false,
  },
  secao: {
    type: DataTypes.ARRAY(DataTypes.JSON), // ARRAY no PostgreSQL
  },
  enlistados: {
    type: DataTypes.ARRAY(DataTypes.JSON), // ARRAY no PostgreSQL
  },
  analise: {
    type: DataTypes.JSONB, // JSONB permite consultas rápidas no PostgreSQL
  },
  criadoem: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Timestamp automático
  },
  atualizadoem: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW, // Atualiza automaticamente
  },
}, {
  timestamps: false, // Desativa createdAt e updatedAt porque já temos criadoem e atualizadoem
  tableName: "curso", // Nome exato da tabela no banco de dados
});

export default Curso;
