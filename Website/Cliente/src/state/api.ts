import { Curso } from "@/types/Cursotipos";
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@clerk/nextjs/server";
import { toast } from "sonner";
import { Clerk } from "@clerk/clerk-js";
import { Key } from "react";

// Adicione estas interfaces para os tipos de progresso
interface SectionProgress {
  sectionId: string;
  completed: boolean;
  progress: number;
}

interface UserCourseProgress {
  userId: string;
  courseId: string;
  sections: SectionProgress[];
  overallProgress: number;
  lastAccessed?: Date;
}

interface Course {
  category: string;
  courseId: Key | null | undefined;
  id: string;
  title: string;
  // outras propriedades do curso...
}

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
  // Adicione "UserCourseProgress" aos tagTypes
  tagTypes: ["cursos", "Users", "categorias", "UserCourseProgress"],
  endpoints: (build) => ({
    // ... seus endpoints existentes ...
    
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
        return response as { id: string; nome: string }[];
      },
      providesTags: ["categorias"],
    }),
    
    getSubcategorias: build.query<{
      id: Key | null | undefined; subcategoriaid: number; nome: string 
}[], void>({
      query: () => "cursos/subcategorias",
      transformResponse: (response: unknown) => {
        return response as { subcategoriaid: number; nome: string }[];
      },
      providesTags: ["categorias"],
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

    // ===============
    // USER COURSE PROGRESS
    // =============== 
    getUserEnrolledCourses: build.query<Curso[], string>({
      query: (userId) => `users/course-progress/${userId}/enrolled-courses`,
      providesTags: ["UserCourseProgress"],
    }),

    getUserCourseProgress: build.query<
      UserCourseProgress,
      { userId: string; courseId: string }
    >({
      query: ({ userId, courseId }) =>
        `users/course-progress/${userId}/courses/${courseId}`,
      providesTags: ["UserCourseProgress"],
    }),

    updateUserCourseProgress: build.mutation<
      UserCourseProgress,
      {
        userId: string;
        courseId: string;
        progressData: {
          sections: SectionProgress[];
        };
      }
    >({
      query: ({ userId, courseId, progressData }) => ({
        url: `users/course-progress/${userId}/courses/${courseId}`,
        method: "PUT",
        body: progressData,
      }),
      invalidatesTags: ["UserCourseProgress"],
      async onQueryStarted(
        { userId, courseId, progressData },
        { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
          api.util.updateQueryData(
            "getUserCourseProgress",
            { userId, courseId },
            (draft) => {
              Object.assign(draft, {
                ...draft,
                sections: progressData.sections,
              });
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
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
  useUploadVideoMutation,
  // Adicione os novos hooks de progresso do usuário
  useGetUserEnrolledCoursesQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
} = api;