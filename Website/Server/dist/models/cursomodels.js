import { DataTypes } from "sequelize";
import sequelize from "../db.js";
// 📌 Modelo do Curso
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
        type: DataTypes.ENUM("Beginner", "Intermediate", "Advanced"),
        allowNull: false,
    },
    estado: {
        type: DataTypes.ENUM("Draft", "Published"),
        allowNull: false,
    },
    criadoem: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    atualizadoem: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    timestamps: false,
    tableName: "curso",
});
// 📌 Modelo da Seção (Secao)
const Secao = sequelize.define("Secao", {
    secaoid: {
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
    secaotitulo: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    secaodescricao: {
        type: DataTypes.TEXT,
    },
}, {
    timestamps: false,
    tableName: "secao",
});
// 📌 Modelo do Capítulo (Capitulo)
const Capitulo = sequelize.define("Capitulo", {
    capituloid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    secaoid: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: Secao,
            key: "secaoid",
        },
        onDelete: "CASCADE",
    },
    type: {
        type: DataTypes.ENUM("Text", "Quiz", "Video"),
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
}, {
    timestamps: false,
    tableName: "capitulo",
});
// 📌 Relacionamento entre Curso e Secao
Curso.hasMany(Secao, { foreignKey: "cursoid", as: "secoes" });
Secao.belongsTo(Curso, { foreignKey: "cursoid", as: "curso" });
// 📌 Relacionamento entre Secao e Capitulo
Secao.hasMany(Capitulo, { foreignKey: "secaoid", as: "capitulos" });
Capitulo.belongsTo(Secao, { foreignKey: "secaoid", as: "secao" });
export { Curso, Secao, Capitulo };
