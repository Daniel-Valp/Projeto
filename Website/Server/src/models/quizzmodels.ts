import {
  Model,
  DataTypes,
  Optional,
} from "sequelize";
import sequelize from "../db";

export interface QuizAttributes {
  id: string;
  titulo: string;
  descricao: string;
  status: "rascunho" | "publicado";
  inscritos: number;
  criado_em?: Date;
  editado_em?: Date;
  categoria_id: string;
  subcategoria_id: number;
  professor_email: string;
}

type QuizCreationAttributes = Optional<QuizAttributes, "id" | "inscritos" | "criado_em" | "editado_em">;

class Quiz extends Model<QuizAttributes, QuizCreationAttributes> implements QuizAttributes {
  public id!: string;
  public titulo!: string;
  public descricao!: string;
  public status!: "rascunho" | "publicado";
  public inscritos!: number;
  public criado_em?: Date;
  public editado_em?: Date;
  public categoria_id!: string;
  public subcategoria_id!: number;
  public professor_email!: string;
}

Quiz.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "rascunho",
    },
    inscritos: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    criado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    editado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    categoria_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    subcategoria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    professor_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Quiz",
    tableName: "quizzes",
    timestamps: false,
  }
);

export default Quiz;
