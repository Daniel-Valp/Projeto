import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, 
  {
    host: process.env.DB_HOST, 
    dialect: "postgres", 
    port: process.env.DB_PORT || 5432, 
    logging: false, 
  }
);

(async () => {
  try {
    await sequelize.authenticate();
    console.log("🟢 Conectado ao PostgreSQL com Sequelize");
  } catch (error) {
    console.error("🔴 Erro ao conectar ao banco:", error);
  }
})();

// ✅ Exporta o Sequelize como default
export default sequelize;
