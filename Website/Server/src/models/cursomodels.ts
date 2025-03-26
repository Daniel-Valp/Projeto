import { DataTypes } from "sequelize";
import sequelize from "../db.js";

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
    categoria: {
      type: DataTypes.STRING,
      allowNull: false,
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
      type: DataTypes.INTEGER, // Número de horas que o curso demora
      allowNull: false,
      defaultValue: 0,
    },
    subcategoriaid: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "subcategoria", // Nome da tabela de subcategorias
        key: "subcategoriaid",
      },
      onDelete: "CASCADE",
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


// 📌 Modelo da Seção (Secao)
const Secao = sequelize.define("Secao", {
  secaoid: {  // 🔥 Mudei para ficar igual ao banco de dados
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  cursoid: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Curso,
      key: "cursoid",
    },
    onDelete: "CASCADE",
  },
  secaotitulo: {  // 🔥 Mudei para bater com o SQL
    type: DataTypes.STRING,
    allowNull: false,
  },
  secaodescricao: {  // 🔥 Mudei para bater com o SQL
    type: DataTypes.TEXT,
  },
}, {
  timestamps: false,
  tableName: "secao",
});

// 📌 Modelo do Capítulo (Capitulo)
const Capitulo = sequelize.define("Capitulo", {
  capituloid: {  // 🔥 Mudei para bater com o SQL
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  secaoid: {  // 🔥 Mudei para bater com o SQL
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: Secao,
      key: "secaoid",
    },
    onDelete: "CASCADE",
  },
  type: {
    type: DataTypes.ENUM("Teste", "Quizz", "Video"),
    allowNull: false,
  },
  capitulotitulo: {  // 🔥 Mudei para bater com o SQL
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
}, {
  timestamps: false,
  tableName: "capitulo",
});

// 📌 Relacionamento entre Curso e Subcategoria
Subcategoria.hasMany(Curso, { foreignKey: "subcategoriaid", as: "cursos" });
Curso.belongsTo(Subcategoria, { foreignKey: "subcategoriaid", as: "subcategoria" });

// 📌 Relacionamento entre Curso e Secao
Curso.hasMany(Secao, { foreignKey: "cursoid", as: "secoes" });
Secao.belongsTo(Curso, { foreignKey: "cursoid", as: "curso" });

// 📌 Relacionamento entre Secao e Capitulo
Secao.hasMany(Capitulo, { foreignKey: "secaoid", as: "capitulos" });
Capitulo.belongsTo(Secao, { foreignKey: "secaoid", as: "secao" });




export { Curso, Secao, Capitulo, Subcategoria };
