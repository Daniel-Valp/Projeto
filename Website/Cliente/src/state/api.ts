import { Curso } from "@/types/Cursotipos"; // Usa nome de ficheiro mais claro
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@clerk/nextjs/server"
import { Clerk } from "@clerk/clerk-js";
import { toast } from "sonner";

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOption: any
) => {
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

  try {
    const result: any = await baseQuery(args, api, extraOption);

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage = errorData?.message || result.error.status.toString() || "Um erro ocurreu mas nem sei bem como.";
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutationRequest = (args as FetchArgs).method && (args as FetchArgs).method !== "GET"

    if (isMutationRequest) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data) {
      result.data = result.data.data;
    } else if (
      result.error?.status == 204 ||
      result.meta?.response?.status === 24
     ) {
      return {data: null}
    }

    return result;
  }catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "uknown error";

    return { error: {status :"FETCH_ERROR", error: errorMessage } };
  }
}

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["cursos", "Users"],
  endpoints: (build) => ({
    
    updateUser: build.mutation<User, Partial<User> & { userId: string}>({
      query: ({ userId, ...updateUser }) => ({
        url: `users/clerk/${userId}`,
        method: "PUT",
        body: updateUser
      }),      
      invalidatesTags: ["Users"]
    }),

    getCursos: build.query<Curso[], { category?: string }>({
      query: ({ category }) => {
        const params: Record<string, string> = {};
        if (category) params.category = category;
        return { url: "cursos", params };
      },
      providesTags: ["cursos"],
    }),

    criarCurso: build.mutation<Curso, { teacherId: string; teacherName: string }>({
      query: (body) => ({
        url: `cursos`,  
        method: "POST",
        body,
      }),
      invalidatesTags: ["cursos"],  // Invalida cache para atualizar lista de cursos
    }),   
    
    apagarCurso: build.mutation<{ message: string }, string>({
      query: (cursoid) => ({
        url: `cursos/${cursoid}`,  
        method: "DELETE",
      }),
      invalidatesTags: ["cursos"],  // Atualiza lista após deletar
    }),    

    atualizarCurso: build.mutation<Curso, { cursoid: string; formData: FormData }>({
      query: ({ cursoid, formData }) => ({
        url: `cursos/${cursoid}`,  
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { cursoid }) => [
        { type: "cursos", id: cursoid },
      ],
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
} = api;
