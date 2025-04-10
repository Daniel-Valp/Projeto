import { Secao } from "@/types/Secçõestipo";
import { CursoFormData } from "@/types/Cursotipos";
import { Capitulo } from "@/types/Secçõestipo";
import { toast } from "sonner";

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
