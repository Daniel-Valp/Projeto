import {
  Model,
  DataTypes,
  Optional
} from "sequelize";
import sequelize from "../db";

interface QuizRespostaAttributes {
  id: string;
  quiz_id: string;
  aluno_email: string;
  respostas: object; // JSON object: { "1": "b", "2": "a" }
  pontuacao: number;
  criado_em?: Date;
}

type QuizRespostaCreation = Optional<QuizRespostaAttributes, "id" | "criado_em">;

class QuizResposta extends Model<QuizRespostaAttributes, QuizRespostaCreation>
  implements QuizRespostaAttributes {
  public id!: string;
  public quiz_id!: string;
  public aluno_email!: string;
  public respostas!: object;
  public pontuacao!: number;
  public criado_em?: Date;
}

QuizResposta.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    quiz_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    aluno_email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    respostas: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
    pontuacao: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    criado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "QuizResposta",
    tableName: "quiz_respostas",
    timestamps: false,
  }
);

export default QuizResposta;
