"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useEffect, useState } from "react";

type CourseStats = {
  type: string;
  count: number;
};

export default function AdminGraphPage() {
  const [data, setData] = useState<CourseStats[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/admin/course-stats");
      const json = await res.json();
      setData(json.stats);
      setTotalCourses(json.total);
    };
    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Estatísticas dos Cursos</h1>
      <p className="mb-4">Total de cursos: <strong>{totalCourses}</strong></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Gráfico de Barras */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Cursos por tipo (Barras)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="type" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Cursos por tipo (Pizza)</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
