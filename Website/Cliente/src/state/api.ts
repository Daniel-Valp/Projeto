import { Curso } from "@/types/Cursotipos"; // Usa nome de ficheiro mais claro
import { BaseQueryApi, createApi, FetchArgs, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@clerk/nextjs/server"

const customBaseQuery = async (
  args: string | FetchArgs,
  api: BaseQueryApi,
  extraOption: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
  });

  try {
    const result: any = await baseQuery(args, api, extraOption);

    if (result.data) {
      result.data = result.data.data;
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
        url: "users/clerk/${userId}",
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

    getCurso: build.query<Curso, string>({
      query: (id) => `cursos/${id}`,
      providesTags: (resultado, erro, id) => [{ type: "cursos", id }],
    }),
  }),
});

export const { useUpdateUserMutation, useGetCursosQuery, useGetCursoQuery } = api;
