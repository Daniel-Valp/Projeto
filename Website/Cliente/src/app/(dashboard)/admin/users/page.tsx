"use client";

import { useEffect, useState } from "react";
import { toast } from 'sonner';


type Role = "student" | "teacher" | "admin";

type User = {
  id: string;
  name: string;
  email: string;
  role: Role;
};

export default function UserAdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
  try {
    console.log("📡 Buscando usuários de http://localhost:5000/api/users/admin...");
    const res = await fetch("http://localhost:5000/api/users/admin");

    console.log("🔁 Status da resposta:", res.status);
    const data = await res.json();
    console.log("📦 Usuários carregados:", data);
    setUsers(data);
  } catch (error) {
    console.error("❌ Erro ao buscar usuários:", error);
  }
};



const updateRole = async (userId: string, role: Role) => {
  const confirmar = window.confirm("Tem a certeza que deseja alterar o estatuto deste utilizador?");
  if (!confirmar) return;

  try {
    console.log(`🔧 Atualizando papel de ${userId} para ${role}`);
    setLoading(true);

    const res = await fetch("http://localhost:5000/api/usersupdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role }),
    });

    const data = await res.json();
    console.log("🧾 Resposta da atualização:", data);

    toast.success("Utilizador atualizado com sucesso.");
    await fetchUsers();
  } catch (error) {
    console.error("❌ Erro ao atualizar papel do usuário:", error);
    toast.error("❌ Erro ao atualizar o utilizador.");
  } finally {
    setLoading(false);
  }
};


  const roleLabel: Record<Role, string> = {
    student: "Aluno",
    teacher: "Professor",
    admin: "Administrador",
  };

  useEffect(() => {
    console.log("🚀 Componente montado. Chamando fetchUsers...");
    fetchUsers();
  }, []);
          
  
  console.log("👥 Renderizando tabela com usuários:", users); // <-- fora do return


  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-white">
      <h1 className="text-2xl font-bold mb-6">Gerenciar utilizadores</h1>

      <table className="w-full table-auto border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-800 text-left">
          <tr>
            <th className="p-3">Nome</th>
            <th className="p-3">Email</th>
            <th className="p-3">Papel</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-4 text-center text-gray-500">
                Nenhum usuário encontrado.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-t border-gray-200 dark:border-gray-700">
                <td className="p-3">{user.name || "(sem nome)"}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{roleLabel[user.role]}</td>
                <td className="p-3">
                  <select
                    value={user.role}
                    onChange={(e) => updateRole(user.id, e.target.value as Role)}
                    className="bg-white dark:bg-gray-700 border rounded px-2 py-1 text-sm"
                    disabled={loading}
                  >
                    <option value="student">Aluno</option>
                    <option value="teacher">Professor</option>
                    <option value="admin">Administrador</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {loading && (
        <p className="mt-4 text-indigo-500 animate-pulse">Atualizando...</p>
      )}
    </div>
  );
}
