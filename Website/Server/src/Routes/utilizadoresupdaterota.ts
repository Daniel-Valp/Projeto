// src/Routes/utilizadoresupdaterota.ts
import { Router, Request, Response } from "express";
import { clerkClient } from "../utils/clerk";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    console.log("Requisição recebida:", req.body); // 👈 log

    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ message: "userId e role são obrigatórios." });
    }

    const result = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { userType: role },
    });

    console.log("Resultado Clerk:", result); // 👈 log

    return res.status(200).json({ message: "Papel do usuário atualizado com sucesso." });
  } catch (error: any) {
    console.error("❌ Erro ao atualizar papel do usuário:", error);

    // Tente enviar o erro como JSON, mesmo se vier como string
    return res.status(500).json({
      message: "Erro interno no servidor.",
      error: error.message || String(error),
    });
  }
});


export default router;
