import type { NextApiRequest, NextApiResponse } from "next";
import clerkClient from "@clerk/clerk-sdk-node";

type Role = "student" | "teacher" | "admin";

type UserSummary = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const users = await clerkClient.users.getUserList({ limit: 100 });

    const validRoles = ["student", "teacher", "admin"];

    const formatted: UserSummary[] = users.map((u) => {
      const rawRole = u.publicMetadata?.userType;

      const role: Role =
        typeof rawRole === "string" && validRoles.includes(rawRole)
          ? (rawRole as Role)
          : "student";

      return {
        id: u.id,
        email: u.emailAddresses[0]?.emailAddress ?? "",
        name: u.username ?? `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim(),
        role,
      };
    });

    return res.status(200).json(formatted);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    return res.status(500).json({ message: "Erro ao buscar usuários" });
  }
}
