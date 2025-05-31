import {
  Model,
  DataTypes,
  Optional
} from "sequelize";
import sequelize from "../db";

interface QuizPerguntaAttributes {
  id: string;
  quiz_id: string;
  pergunta: string;
  resposta_a: string;
  resposta_b: string;
  resposta_c: string;
  resposta_d: string;
  resposta_correta: "A" | "B" | "C" | "D";
  criado_em?: Date;
  editado_em?: Date;
}

type QuizPerguntaCreation = Optional<
  QuizPerguntaAttributes,
  "id" | "criado_em" | "editado_em"
>;

class QuizPergunta
  extends Model<QuizPerguntaAttributes, QuizPerguntaCreation>
  implements QuizPerguntaAttributes
{
  public id!: string;
  public quiz_id!: string;
  public pergunta!: string;
  public resposta_a!: string;
  public resposta_b!: string;
  public resposta_c!: string;
  public resposta_d!: string;
  public resposta_correta!: "A" | "B" | "C" | "D";
  public criado_em?: Date;
  public editado_em?: Date;
}

QuizPergunta.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    quiz_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    pergunta: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    resposta_a: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resposta_b: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resposta_c: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resposta_d: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    resposta_correta: {
      type: DataTypes.STRING(1),
      allowNull: false,
      validate: {
        isIn: [["A", "B", "C", "D"]],
      },
    },
    criado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    editado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "QuizPergunta",
    tableName: "quiz_perguntas",
    timestamps: false,
  }
);




export default QuizPergunta;
