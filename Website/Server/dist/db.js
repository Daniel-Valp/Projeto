import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();
const sequelize = new Sequelize(process.env.DB_NAME, // Nome do banco de dados
process.env.DB_USER, // Usuário
process.env.DB_PASS, // Senha
{
    host: process.env.DB_HOST, // Host do banco
    dialect: "postgres", // Define o banco como PostgreSQL
    port: process.env.DB_PORT || 5432, // Porta do banco
    logging: false, // Desativa logs no console (opcional)
});
// Teste de conexão
(async () => {
    try {
        await sequelize.authenticate();
        console.log("🟢 Conectado ao PostgreSQL com Sequelize");
    }
    catch (error) {
        console.error("🔴 Erro ao conectar ao banco:", error);
    }
})();
// ✅ Exporta o Sequelize como default
export default sequelize;
