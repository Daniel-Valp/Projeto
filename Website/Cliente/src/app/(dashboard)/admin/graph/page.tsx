"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LabelList,
} from "recharts";
import { useEffect, useState } from "react";
import { BarChart3, PieChart as PieIcon, LayoutDashboard } from "lucide-react";

type CourseStats = {
  type: string;
  count: number;
};

export default function AdminGraphPage() {
  const [data, setData] = useState<CourseStats[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [subcatData, setSubcatData] = useState<CourseStats[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:5000/api/graph");
      if (!res.ok) {
        console.error("Erro ao buscar dados:", res.statusText);
        return;
      }
      const json = await res.json();

      const stats = json.cursosPorCategoria.map((c: { nome: string; total: number }) => ({
        type: c.nome,
        count: c.total,
      }));

      const subcatStats = json.cursosPorSubcategoria.map((s: { nome: string; total: number }) => ({
        type: s.nome,
        count: s.total,
      }));

      setData(stats);
      setTotalCourses(json.totalCursos);
      setSubcatData(subcatStats);
    };
    fetchData();
  }, []);

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#3B82F6", "#14B8A6"];

  const renderCustomizedLabel = ({
    percent,
  }: {
    percent: number;
  }) => `${(percent * 100).toFixed(0)}%`;

  const LegendList = ({ entries }: { entries: CourseStats[] }) => (
    <ul className="mt-4 space-y-1 text-sm">
      {entries.map((entry, index) => (
        <li key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS[index % COLORS.length] }}
          />
          <span className="text-gray-700 dark:text-gray-200">{entry.type}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
        <LayoutDashboard className="w-6 h-6 text-indigo-500" /> Estatísticas dos Cursos
      </h1>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-8">
        Total de cursos: <strong className="text-indigo-600 dark:text-indigo-400">{totalCourses}</strong>
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de Barras */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-500" /> Cursos por Categoria (Barras)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="type" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#9CA3AF", fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#6366F1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico de Pizza por Categoria */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition hover:shadow-xl">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-500" /> Cursos por Categoria (Pizza)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={renderCustomizedLabel}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <LegendList entries={data} />
        </div>

        {/* Gráfico de Pizza por Subcategoria */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg transition hover:shadow-xl col-span-1 lg:col-span-2">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
            <PieIcon className="w-5 h-5 text-indigo-500" /> Cursos por Subcategoria (Pizza)
          </h2>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={subcatData}
                dataKey="count"
                nameKey="type"
                cx="50%"
                cy="50%"
                outerRadius={120}
                label={renderCustomizedLabel}
              >
                {subcatData.map((entry, index) => (
                  <Cell key={`cell-subcat-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <LegendList entries={subcatData} />
        </div>
      </div>
    </div>
  );
}
