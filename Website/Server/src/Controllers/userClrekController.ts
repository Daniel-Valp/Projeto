import { Request, Response } from "express";
import { clerkClient } from "../utils/clerk"; // ajusta o caminho conforme a estrutura

export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  const userData = req.body;
  try {
    const user = await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        userType: userData.publicMetadata.userType,
        settings: userData.publicMetadata.settings,
      },
    });

    res.json({ message: "Utilizador atualizado com sucesso", data: user });
    }
    catch (error) {
        res.status(500).json({ message: "Erro a atualizar", error });
    }
};