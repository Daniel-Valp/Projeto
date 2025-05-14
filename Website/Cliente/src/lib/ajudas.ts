import { Secao } from "@/types/Secçõestipo";
import { Categoria, CursoFormData, Subcategoria } from "@/types/Cursotipos";
import { Capitulo } from "@/types/Secçõestipo";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export const criarCursoFormData = (
  data: CursoFormData,
  secoes: Secao[]
): FormData => {
  const formData = new FormData();

  formData.append("titulo", data.cursotitulo);
  formData.append("descricao", data.cursodescricao);
  formData.append("categoria_id", data.cursocategoria);
  formData.append("subcategoriaid", data.cursosubcategoria);
  formData.append("horas", data.cursohoras);
  formData.append("estado", data.cursoestado ? "Publicado" : "Rascunho");

  // Adicionar imagem, se existir
  if (data.cursoimagem instanceof File) {
    formData.append("imagem", data.cursoimagem);
  }

  formData.append("secoes", JSON.stringify(secoes));

  return formData;
};



export const fazerUploadVideos = async (
  secoesLocais: Secao[],
  cursoId: string,
  getUploadVideoUrl: any
): Promise<Secao[]> => {
  const secoesAtualizadas = [...secoesLocais];

  for (let i = 0; i < secoesAtualizadas.length; i++) {
    for (let j = 0; j < secoesAtualizadas[i].capitulos.length; j++) {
      const capitulo = secoesAtualizadas[i].capitulos[j];

      if (capitulo.video && typeof capitulo.video !== "string" && capitulo.video instanceof File && capitulo.video.type === "video/mp4") {
        try {
          const capituloAtualizado = await subirVideo(
            capitulo,
            cursoId,
            secoesAtualizadas[i].secaoid,
            getUploadVideoUrl
          );

          secoesAtualizadas[i].capitulos[j] = capituloAtualizado;
        } catch (error) {
          console.error(
            `Erro ao fazer upload do vídeo do capítulo ${capitulo.capituloid}:`,
            error
          );
        }
      }
    }
  }

  return secoesAtualizadas;
};

export const useCategorias = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await fetch('http://localhost:5000/cursos/categorias');
        const data = await response.json();

        if (data?.data) {
          setCategorias(data.data);
        } else {
          toast.error("Erro ao carregar categorias");
        }
      } catch (err) {
        setError("Erro ao carregar categorias");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategorias();
  }, []);

  return { categorias, loading, error };
};

export const useSubcategorias = () => {
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const fetchSubcategorias = async () => {
      try {
        const response = await fetch('http://localhost:5000/cursos/subcategorias');
        const data = await response.json();

        if (data?.data) {
          setSubcategorias(data.data);
        } else {
          toast.error("Erro ao carregar subcategorias");
        }
      } catch (err) {
        setError("Erro ao carregar subcategorias");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSubcategorias();
  }, []);

  return { subcategorias, loading, error };
};

const subirVideo = async (
  capitulo: Capitulo,
  cursoId: string,
  secaoId: string,
  getUploadVideoUrl: any
) => {
  const arquivo = capitulo.video as File;

  try {
    const { uploadUrl, videoUrl } = await getUploadVideoUrl({
      cursoId,
      secaoId,
      capituloId: capitulo.capituloid,
      nomeArquivo: arquivo.name,
      tipoArquivo: arquivo.type,
    }).unwrap();

    await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": arquivo.type,
      },
      body: arquivo,
    });

    toast.success(`Vídeo do capítulo ${capitulo.capituloid} enviado com sucesso`);

    return { ...capitulo, video: videoUrl };
  } catch (error) {
    console.error(`Erro ao enviar vídeo para capítulo ${capitulo.capituloid}:`, error);
    throw error;
  }
};
