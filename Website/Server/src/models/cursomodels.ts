import { DataTypes } from "sequelize";
import sequelize from "../db";

// 📌 Modelo da Categoria
const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "categorias",
  }
);

// 📌 Modelo do Curso
const Curso = sequelize.define(
  "Curso",
  {
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
    categoria_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "categorias",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    imagem: {
      type: DataTypes.TEXT,
    },
    nivel: {
      type: DataTypes.ENUM("Iniciante", "Intermediario", "Avançado"),
      allowNull: false,
    },
    estado: {
      type: DataTypes.ENUM("Rascunho", "Publicado"),
      allowNull: false,
    },
    horas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    subcategoriaid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "subcategoria",
        key: "subcategoriaid",
      },
      onDelete: "CASCADE",
    },
    enlistados: {
      type: DataTypes.INTEGER, // 🔥 Agora é um número, não um array!
      allowNull: false,
      defaultValue: 0, // Começa com 0 inscritos
    },
    criadoem: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    atualizadoem: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
    tableName: "curso",
  }
);


// 📌 Modelo da Subcategoria
const Subcategoria = sequelize.define(
  "Subcategoria",
  {
    subcategoriaid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "subcategoria",
  }
);

// 📌 Modelo da Seção
const Secao = sequelize.define(
  "Secao",
  {
    secaoid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    cursoid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "curso",
        key: "cursoid",
      },
      onDelete: "CASCADE",
    },
    secaotitulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    secaodescricao: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
    tableName: "secao",
  }
);

// 📌 Modelo do Capítulo
const Capitulo = sequelize.define(
  "Capitulo",
  {
    capituloid: {
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
    type: {
      type: DataTypes.ENUM("Teste", "Quizz", "Video"),
      allowNull: false,
    },
    capitulotitulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    conteudo: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    freepreview: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    timestamps: false,
    tableName: "capitulo",
  }
);

// 📌 Relacionamentos

// 🔹 Curso pertence a uma Categoria
Categoria.hasMany(Curso, { foreignKey: "categoria_id", as: "cursos" });
Curso.belongsTo(Categoria, { foreignKey: "categoria_id", as: "categoria" });

// 🔹 Curso pertence a uma Subcategoria
Subcategoria.hasMany(Curso, { foreignKey: "subcategoriaid", as: "cursos" });
Curso.belongsTo(Subcategoria, { foreignKey: "subcategoriaid", as: "subcategoria" });

// 🔹 Curso tem várias Seções
Curso.hasMany(Secao, { foreignKey: "cursoid", as: "secoes" });
Secao.belongsTo(Curso, { foreignKey: "cursoid", as: "curso" });

// 🔹 Seção tem vários Capítulos
Secao.hasMany(Capitulo, { foreignKey: "secaoid", as: "capitulos" });
Capitulo.belongsTo(Secao, { foreignKey: "secaoid", as: "secao" });

export { Categoria, Curso, Secao, Capitulo, Subcategoria };
