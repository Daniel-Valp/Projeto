import { DataTypes, Model } from "sequelize";
import sequelize from "../db.js";
import { Curso } from "./cursomodels.js"; // Importa o modelo do curso
// 📌 Definindo o Modelo do ProgressoCapitulo
class ProgressoCapitulo extends Model {
    id;
    progressoSecaoId;
    capituloid;
    concluido;
}
ProgressoCapitulo.init({
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
    sequelize,
    tableName: "progresso_capitulo",
    timestamps: false,
});
// 📌 Definindo o Modelo do ProgressoSecao
class ProgressoSecao extends Model {
    id;
    secaoid;
    progressoCursoId;
}
ProgressoSecao.init({
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
    sequelize,
    tableName: "progresso_secao",
    timestamps: false,
});
// 📌 Definindo o Modelo do ProgressoCursoUsuario
class ProgressoCursoUsuario extends Model {
    id;
    usuarioid;
    cursoid;
    data_inscricao;
    progresso_geral;
    ultimo_acesso;
}
ProgressoCursoUsuario.init({
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
}, {
    sequelize,
    tableName: "progresso_curso_usuario",
    timestamps: false,
});
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
