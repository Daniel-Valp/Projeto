import express from "express";
import cors from "cors";
import CursoRoutes from "./Routes/CursoRoutes"; 
import userClerkRoutes from "./Routes/userClerkRoutes";
import userCourseProgressRoutes from "./Routes/usercourseprogress";
import graphRoutes from "./Routes/graphroutes"; // ✅ CERTO

import { clerkMiddleware, createClerkClient, requireAuth } from "@clerk/express";
import utilizadoresrota from "./Routes/utilizadoresrota";
import { clerkClient } from "./utils/clerk";

import path from "path";

import { setupAssociations } from "./models/associations";

setupAssociations();


const app = express();
app.use(express.json());
app.use(cors());
app.use(clerkMiddleware());

// Rota inicial
app.get("/", (req, res) => {
  res.send("Servidor rodando!");
});

// Rotas
app.use("/cursos", CursoRoutes);
app.use("/users/clerk", requireAuth(), userClerkRoutes);
app.use("/api/progresso", userCourseProgressRoutes);
app.use("/api", graphRoutes);
app.use("/api/users", utilizadoresrota);


import updateUserRouter from "./Routes/utilizadoresupdaterota";
app.use("/api/usersupdate", updateUserRouter); // ✅


import videoRoutes from "./Routes/videoRoutes";
app.use("/api/videos", videoRoutes);


import manualRoutes from "./Routes/manualrota";
app.use("/api", manualRoutes);



app.use(
  "/uploads",
  express.static(path.join(__dirname, "..", "uploads"), {
    setHeaders: (res, filePath) => {
      if (filePath.endsWith(".pdf")) {
        res.setHeader("Content-Type", "application/pdf");

        // ⚠️ Não força o "inline" nem "attachment" aqui — deixa o navegador decidir baseado no `download` ou não no front.
      }
    },
  })
);


import quizRoutes from "./Routes/quizzroutes";
import quizPerguntasRoutes from "./Routes/quizzperguntasroutes";
import quizRespostasRoutes from "./Routes/quizzrespostasroutes";

app.use("/api/quizzes", quizRoutes);
app.use("/api/quizzes", quizPerguntasRoutes);
app.use("/api/quizzes", quizRespostasRoutes);




// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
