import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../db.js";
import { Curso } from "./cursomodels.js"; // Importa o modelo do curso

// 📌 Interface para o ProgressoCapitulo
interface ProgressoCapituloAttributes {
  id: string;
  progressoSecaoId: string;
  capituloid: string;
  concluido: boolean;
}

// Omitindo 'id' ao criar um novo progresso capitulo
interface ProgressoCapituloCreationAttributes extends Optional<ProgressoCapituloAttributes, 'id'> {}

// 📌 Definindo o Modelo do ProgressoCapitulo
class ProgressoCapitulo extends Model<ProgressoCapituloAttributes, ProgressoCapituloCreationAttributes> implements ProgressoCapituloAttributes {
  public id!: string;
  public progressoSecaoId!: string;
  public capituloid!: string;
  public concluido!: boolean;
}

ProgressoCapitulo.init(
  {
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
  },
  {
    sequelize,
    tableName: "progresso_capitulo",
    timestamps: false,
  }
);

// 📌 Interface para o ProgressoSecao
interface ProgressoSecaoAttributes {
  id: string;
  secaoid: string;
  progressoCursoId: string;
}

interface ProgressoSecaoCreationAttributes extends Optional<ProgressoSecaoAttributes, 'id'> {}

// 📌 Definindo o Modelo do ProgressoSecao
class ProgressoSecao extends Model<ProgressoSecaoAttributes, ProgressoSecaoCreationAttributes> implements ProgressoSecaoAttributes {
  public id!: string;
  public secaoid!: string;
  public progressoCursoId!: string;
}

ProgressoSecao.init(
  {
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
  },
  {
    sequelize,
    tableName: "progresso_secao",
    timestamps: false,
  }
);

// 📌 Interface para o ProgressoCursoUsuario
interface ProgressoCursoUsuarioAttributes {
  id: string;
  usuarioid: string;
  cursoid: string;
  data_inscricao: Date;
  progresso_geral: number;
  ultimo_acesso: Date;
}

interface ProgressoCursoUsuarioCreationAttributes extends Optional<ProgressoCursoUsuarioAttributes, 'id'> {}

// 📌 Definindo o Modelo do ProgressoCursoUsuario
class ProgressoCursoUsuario extends Model<ProgressoCursoUsuarioAttributes, ProgressoCursoUsuarioCreationAttributes> implements ProgressoCursoUsuarioAttributes {
  public id!: string;
  public usuarioid!: string;
  public cursoid!: string;
  public data_inscricao!: Date;
  public progresso_geral!: number;
  public ultimo_acesso!: Date;
}

ProgressoCursoUsuario.init(
  {
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
    data_inscricao: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    progresso_geral: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    ultimo_acesso: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "progresso_curso_usuario",
    timestamps: false,
  }
);

// 📌 Relacionamentos
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

ProgressoCursoUsuario.belongsTo(Curso, {
  foreignKey: "cursoid",
  as: "curso",
});

export { ProgressoCursoUsuario, ProgressoSecao, ProgressoCapitulo };
