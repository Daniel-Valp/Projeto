import { DataTypes } from "sequelize";
import sequelize from "../db.js";

// 📌 Progresso por Capítulo
const ProgressoCapitulo = sequelize.define("ProgressoCapitulo", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  progressoSecaoId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "progresso_secao",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  capituloid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "capitulo",
      key: "capituloid",
    },
    onDelete: "CASCADE",
  },
  concluido: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
  tableName: "progresso_capitulo",
  timestamps: false,
});

// 📌 Progresso por Secção
const ProgressoSecao = sequelize.define("ProgressoSecao", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  secaoid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "secao",
      key: "secaoid",
    },
    onDelete: "CASCADE",
  },
  progressoCursoId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "progresso_curso_usuario",
      key: "id",
    },
    onDelete: "CASCADE",
  },
}, {
  tableName: "progresso_secao",
  timestamps: false,
});

// 📌 Progresso Geral do Curso por Usuário
const ProgressoCursoUsuario = sequelize.define("ProgressoCursoUsuario", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  usuarioid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "usuarios", key: "id" },
    onDelete: "CASCADE",
  },
  cursoid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: { model: "curso", key: "cursoid" },
    onDelete: "CASCADE",
  },
  data_inscricao: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  progresso_geral: { type: DataTypes.INTEGER, defaultValue: 0 },
  ultimo_acesso: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, {
  tableName: "progresso_curso_usuario",
  timestamps: false,
});

// 📌 Associações
ProgressoCursoUsuario.hasMany(ProgressoSecao, {
  foreignKey: "progressoCursoId",
  as: "secoes",
});
ProgressoSecao.belongsTo(ProgressoCursoUsuario, {
  foreignKey: "progressoCursoId",
  as: "cursoProgress",
});

ProgressoSecao.hasMany(ProgressoCapitulo, {
  foreignKey: "progressoSecaoId",
  as: "capitulos",
});
ProgressoCapitulo.belongsTo(ProgressoSecao, {
  foreignKey: "progressoSecaoId",
  as: "secaoProgress",
});

// 📌 Exporta os modelos
export {
  ProgressoCursoUsuario,
  ProgressoSecao,
  ProgressoCapitulo,
};
