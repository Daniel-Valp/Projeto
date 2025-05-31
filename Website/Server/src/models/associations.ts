// src/models/associations.ts
import Quiz from "./quizzmodels";
import QuizPergunta from "./quizzperguntasmodels";

export function setupAssociations() {
  Quiz.hasMany(QuizPergunta, { foreignKey: "quiz_id", as: "perguntas" });
  QuizPergunta.belongsTo(Quiz, { foreignKey: "quiz_id", as: "quiz" });
}
