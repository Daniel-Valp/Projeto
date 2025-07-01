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
  LineChart,
  Line,
} from "recharts";
import { JSX, useEffect, useState } from "react";
import {
  BookOpenCheck,
  BarChart3,
  PieChart as PieIcon,
  GraduationCap,
  ListOrdered,
  FileCheck2,
  Video,
  FileText,
} from "lucide-react";

type ContentStats = {
  type: string;
  count: number;
};

export default function AdminContentGraph() {
  const [typeData, setTypeData] = useState<ContentStats[]>([]);
  const [contentCategoryData, setContentCategoryData] = useState<ContentStats[]>([]);

  // Cursos
  const [courseCategoryData, setCourseCategoryData] = useState<ContentStats[]>([]);
  const [courseSubCategoryData, setCourseSubCategoryData] = useState<ContentStats[]>([]);

  // Quizzes
  const [quizCategoryData, setQuizCategoryData] = useState<ContentStats[]>([]);
  const [quizSubCategoryData, setQuizSubCategoryData] = useState<ContentStats[]>([]);

  // Vídeos
  const [videoCategoryData, setVideoCategoryData] = useState<ContentStats[]>([]);
  const [videoSubCategoryData, setVideoSubCategoryData] = useState<ContentStats[]>([]);

  // Manuais
  const [manualCategoryData, setManualCategoryData] = useState<ContentStats[]>([]);
  const [manualSubCategoryData, setManualSubCategoryData] = useState<ContentStats[]>([]);

  const [totalContent, setTotalContent] = useState(0);

  // Estado global para alternar gráficos (barra/pizza ou linha)
  const [chartType, setChartType] = useState<"bar" | "line">("bar");

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("http://localhost:5000/api/graph");
      if (!res.ok) {
        console.error("Erro ao buscar dados:", res.statusText);
        return;
      }

      const json = await res.json();

      setTypeData(json.conteudosPorTipo || []);
      setTotalContent(json.totalConteudos || 0);
      setCourseCategoryData(json.cursosPorCategoria || []);
      setCourseSubCategoryData(json.cursosPorSubcategoria || []);
      setQuizCategoryData(json.quizzesPorCategoria || []);
      setQuizSubCategoryData(json.quizzesPorSubcategoria || []);
      setVideoCategoryData(json.videosPorCategoria || []);
      setVideoSubCategoryData(json.videosPorSubcategoria || []);
      setManualCategoryData(json.manuaisPorCategoria || []);
      setManualSubCategoryData(json.manuaisPorSubcategoria || []);
    };

    fetchData();
  }, []);

  const COLORS = ["#6366F1", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#3B82F6", "#14B8A6"];

  const renderCustomizedLabel = ({ percent }: { percent: number }) =>
    `${(percent * 100).toFixed(0)}%`;

  const LegendList = ({ entries }: { entries: ContentStats[] }) => (
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

  // Componente que renderiza barra ou linha conforme o estado global chartType
  const CustomBar = ({
    title,
    data,
    icon,
  }: {
    title: string;
    data: ContentStats[];
    icon: JSX.Element;
  }) => (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg transition hover:shadow-xl">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
        {icon} {title}
      </h3>
      {data.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">Sem dados disponíveis</p>
      ) : (
        <ResponsiveContainer width="100%" height={250}>
          {chartType === "bar" ? (
            <BarChart data={data}>
              <XAxis dataKey="type" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <LineChart data={data}>
              <XAxis dataKey="type" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#9CA3AF", fontSize: 11 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#6366F1"
                strokeWidth={3}
                dot={{ r: 4 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-300">
      <h1 className="text-3xl font-extrabold text-gray-800 dark:text-white mb-6 flex items-center gap-2">
        <BookOpenCheck className="w-6 h-6 text-indigo-500" />
        Estatísticas de Conteúdos
      </h1>

      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
        Total de conteúdos:{" "}
        <strong className="text-indigo-600 dark:text-indigo-400">{totalContent}</strong>
      </p>

      {/* Botão global para alternar todos os gráficos */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setChartType(chartType === "bar" ? "line" : "bar")}
className="px-4 py-2 text-white text-sm rounded-lg shadow transition"
  style={{ backgroundColor: '#4FA6A8' }}
  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#025E69'}
  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#4FA6A8'}        >
          Alternar para {chartType === "bar" ? "linha" : "barra/pizza"}
        </button>
      </div>

      {/* Distribuição por tipo */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg mb-12 transition hover:shadow-xl max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
          <PieIcon className="w-5 h-5 text-indigo-500" /> Distribuição por Tipo
        </h2>

        {typeData.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">Sem dados disponíveis</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {chartType === "bar" ? (
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="count"
                  nameKey="type"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={renderCustomizedLabel}
                >
                  {typeData.map((entry, index) => (
                    <Cell
                      key={`cell-type-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <LineChart data={typeData}>
                <XAxis dataKey="type" tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fill: "#9CA3AF", fontSize: 11 }} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#6366F1"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        )}

        <LegendList entries={typeData} />
      </div>

      {/* Cursos */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Cursos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CustomBar
            title="Cursos por Categoria"
            data={courseCategoryData}
            icon={<GraduationCap className="w-5 h-5 text-green-600" />}
          />
          <CustomBar
            title="Cursos por Subcategoria"
            data={courseSubCategoryData}
            icon={<ListOrdered className="w-5 h-5 text-green-400" />}
          />
        </div>
      </div>

      {/* Quizzes */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Quizzes</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CustomBar
            title="Quizzes por Categoria"
            data={quizCategoryData}
            icon={<FileCheck2 className="w-5 h-5 text-orange-500" />}
          />
          <CustomBar
            title="Quizzes por Subcategoria"
            data={quizSubCategoryData}
            icon={<ListOrdered className="w-5 h-5 text-orange-400" />}
          />
        </div>
      </div>

      {/* Vídeos */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Vídeos</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CustomBar
            title="Vídeos por Categoria"
            data={videoCategoryData}
            icon={<Video className="w-5 h-5 text-blue-600" />}
          />
          <CustomBar
            title="Vídeos por Subcategoria"
            data={videoSubCategoryData}
            icon={<ListOrdered className="w-5 h-5 text-blue-400" />}
          />
        </div>
      </div>

      {/* Manuais */}
      <div className="mt-12 mb-12">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Manuais</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CustomBar
            title="Manuais por Categoria"
            data={manualCategoryData}
            icon={<FileText className="w-5 h-5 text-purple-600" />}
          />
          <CustomBar
            title="Manuais por Subcategoria"
            data={manualSubCategoryData}
            icon={<ListOrdered className="w-5 h-5 text-purple-400" />}
          />
        </div>
      </div>
    </div>
  );
}
