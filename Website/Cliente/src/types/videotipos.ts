// types/Videotipos.ts
export type Video = {
  id: number;
  title: string;
  url: string;
  status: string;
  inscritos: number;
  categoria?: {
    nome: string;
  };
};
