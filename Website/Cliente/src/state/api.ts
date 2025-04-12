import { Curso } from "@/types/Cursotipos";
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@clerk/nextjs/server";
import { toast } from "sonner";
import { Clerk } from "@clerk/clerk-js";


// 🔹 Define o `fetchBaseQuery` apenas uma vez
const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  prepareHeaders: async (headers) => {
    const token = await window.Clerk?.session?.getToken();
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

// 🔹 Função personalizada para tratar erros e mensagens
const customBaseQuery: typeof baseQuery = async (args, api, extraOptions) => {
  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage = errorData?.message || result.error.status?.toString() || "Erro desconhecido.";
      toast.error(`Erro: ${errorMessage}`);
    }

    const isMutationRequest =
      (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data; // 🔥 Transforma resposta para pegar só os dados
    } else if (
      result.error?.status === 204 ||
      result.meta?.response?.status === 204
    ) {
      return { data: null };
    }

    return result;
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido";
    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["cursos", "Users", "categorias"],
  endpoints: (build) => ({
    
    updateUser: build.mutation<User, Partial<User> & { userId: string }>({
      query: ({ userId, ...updateUser }) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updateUser
      }),      
      invalidatesTags: ["Users"]
    }),

    getCategorias: build.query<{ id: string; nome: string }[], void>({
      query: () => "cursos/categorias", 
      transformResponse: (response: unknown) => {
        //console.log("🎯 Resposta bruta da API:", response);
        return response as { id: string; nome: string }[]; // 🔥 Faz um cast para um array
      },
      providesTags: ["categorias"],
    }),
    
    
    getSubcategorias: build.query<{ subcategoriaid: number; nome: string }[], void>({
      query: () => "cursos/subcategorias", // Ajusta este endpoint conforme o que a tua API realmente usa
      transformResponse: (response: unknown) => {
        //console.log("📦 Subcategorias brutas da API:", response);
        return response as { subcategoriaid: number; nome: string }[];
      },
      providesTags: ["categorias"], // Opcional: usa um tag se quiseres invalidar em mutações
    }),
    
    

    getCursos: build.query<Curso[], { category?: string }>({
      query: ({ category }) => {
        const params: Record<string, string> = {};
        if (category) params.category = category;
        return { url: "cursos", params };
      },
      providesTags: ["cursos"],
    }),

      criarCurso: build.mutation<
    Curso, 
    { professorid: string; professornome: string; categoria_id: number; subcategoriaid: number }
  >({
    query: (body) => ({
      url: `cursos`,
      method: "POST",
      body,
    }),
    invalidatesTags: ["cursos"],
  }),

    
    
    apagarCurso: build.mutation<{ message: string }, string>({
      query: (cursoid) => ({
        url: `cursos/${cursoid}`,  
        method: "DELETE",
      }),
      invalidatesTags: ["cursos"],
    }),    

    atualizarCurso: build.mutation<Curso, { cursoid: string; formData: FormData }>({
      query: ({ cursoid, formData }) => ({
        url: `cursos/${cursoid}`,  
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: ["cursos"],
    }),    

    uploadVideo: build.mutation<any, { cursoId: string, secaoId: string, capituloId: string, nomeArquivo: string, tipoArquivo: string }>({
      query: ({ cursoId, secaoId, capituloId, nomeArquivo, tipoArquivo }) => ({
        url: `/cursos/${cursoId}/secoes/${secaoId}/capitulos/${capituloId}/upload`,
        method: "POST",
        body: {
          nomeArquivo,
          tipoArquivo,
        },
      }),
    }),
    

    getCurso: build.query<Curso, string>({
      query: (id) => `cursos/${id}`,
      providesTags: (resultado, erro, id) => [{ type: "cursos", id }],
    }),
  }),
});



export const { 
  useUpdateUserMutation, 
  useGetCursosQuery, 
  useGetCursoQuery,
  useCriarCursoMutation,
  useAtualizarCursoMutation,
  useApagarCursoMutation,
  useGetCategoriasQuery,
  useGetSubcategoriasQuery,
  useUploadVideoMutation,  // Aqui você adiciona o hook de upload de vídeo
} = api;
