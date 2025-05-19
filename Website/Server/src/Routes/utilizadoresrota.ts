import { Router } from "express";
import { createClerkClient } from "@clerk/express";
import type { User } from "@clerk/backend";

const router = Router();

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY!,
});

router.get("/admin", async (req, res) => {
  try {
    const usersRaw = await clerkClient.users.getUserList({ limit: 100 });
    console.log("Raw users response:", usersRaw);

    const users: User[] = Array.isArray(usersRaw.data) ? usersRaw.data : [];


    const validRoles = ["student", "teacher", "admin"];

console.log("🔍 USERS RAW:", users);

const formatted = users.map((u: any, i: number) => {
  console.log(`🔎 Usuário ${i}:`, u);

  const email = u.emailAddresses?.[0]?.emailAddress ?? "sem email";
  const nome = `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() || u.username;
  const role = typeof u.publicMetadata?.userType === "string" ? u.publicMetadata.userType : "student";

  const userFormatado = {
    id: u.id,
    email,
    name: nome,
    role,
  };

  console.log(`✅ Formatado ${i}:`, userFormatado);

  return userFormatado;
});

console.log("✅ Usuários formatados:", formatted);
;



    res.status(200).json(formatted);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ message: "Erro ao buscar usuários" });
  }
});



export default router;
