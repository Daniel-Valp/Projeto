import path from "path";

// ✅ Atualiza o vídeo num capítulo específico
export const updateCourseVideoInfo = (
  course: any,
  secaoId: string,
  capituloId: string,
  videoUrl: string
) => {
  const secao = course.secoes?.find((s: any) => s.secaoid === secaoId);
  if (!secao) {
    throw new Error(`Seção não encontrada: ${secaoId}`);
  }

  const capitulo = secao.capitulos?.find((c: any) => c.capituloid === capituloId);
  if (!capitulo) {
    throw new Error(`Capítulo não encontrado: ${capituloId}`);
  }

  capitulo.video = videoUrl;
  capitulo.type = "Video";
};

// ✅ Valida extensão dos ficheiros de vídeo
export const validateUploadedFiles = (files: any[]) => {
  const allowedExtensions = [".mp4", ".m3u8", ".mpd", ".ts", ".m4s"];
  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      throw new Error(`Tipo de ficheiro não suportado: ${ext}`);
    }
  }
};

// ✅ Retorna o content type com base na extensão
export const getContentType = (filename: string) => {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".mp4":
      return "video/mp4";
    case ".m3u8":
      return "application/vnd.apple.mpegurl";
    case ".mpd":
      return "application/dash+xml";
    case ".ts":
      return "video/MP2T";
    case ".m4s":
      return "video/iso.segment";
    default:
      return "application/octet-stream";
  }
};

// ✅ Upload de vídeos HLS/DASH
export const handleAdvancedVideoUpload = async (
  s3: any,
  files: any[],
  uniqueId: string,
  bucketName: string
) => {
  const isHLSOrDASH = files.some(
    (file) =>
      file.originalname.endsWith(".m3u8") || file.originalname.endsWith(".mpd")
  );

  if (isHLSOrDASH) {
    const uploadPromises = files.map((file) => {
      const s3Key = `videos/${uniqueId}/${file.originalname}`;
      return s3
        .upload({
          Bucket: bucketName,
          Key: s3Key,
          Body: file.buffer,
          ContentType: getContentType(file.originalname),
        })
        .promise();
    });

    await Promise.all(uploadPromises);

    const manifestFile = files.find(
      (file) =>
        file.originalname.endsWith(".m3u8") ||
        file.originalname.endsWith(".mpd")
    );

    const manifestFileName = manifestFile?.originalname || "";
    const videoType = manifestFileName.endsWith(".m3u8") ? "hls" : "dash";

    return {
      videoUrl: `${process.env.CLOUDFRONT_DOMAIN}/videos/${uniqueId}/${manifestFileName}`,
      videoType,
    };
  }

  return null;
};

// ✅ Junta secoes e capítulos — usado no update do progresso
export const mergeSections = (
  existingSections: any[],
  newSections: any[]
): any[] => {
  const existingSectionsMap = new Map<string, any>();
  for (const secao of existingSections) {
    existingSectionsMap.set(secao.secaoid, secao);
  }

  for (const newSecao of newSections) {
    const existing = existingSectionsMap.get(newSecao.secaoid);
    if (!existing) {
      existingSectionsMap.set(newSecao.secaoid, newSecao);
    } else {
      existing.capitulos = mergeChapters(existing.capitulos, newSecao.capitulos);
    }
  }

  return Array.from(existingSectionsMap.values());
};

// ✅ Junta capítulos por secao
export const mergeChapters = (
  existingChapters: any[],
  newChapters: any[]
): any[] => {
  const existingChaptersMap = new Map<string, any>();
  for (const cap of existingChapters) {
    existingChaptersMap.set(cap.capituloid, cap);
  }

  for (const newCap of newChapters) {
    existingChaptersMap.set(newCap.capituloid, {
      ...(existingChaptersMap.get(newCap.capituloid) || {}),
      ...newCap,
    });
  }

  return Array.from(existingChaptersMap.values());
};

// ✅ Calcula o progresso geral com base nos capítulos concluídos
export const calculateOverallProgress = (secoes: any[]): number => {
  let total = 0;
  let concluidos = 0;

  for (const secao of secoes) {
    const capitulos = secao.capitulos || [];
    total += capitulos.length;
    concluidos += capitulos.filter((cap: any) => cap.concluido === true).length;
  }

  return total > 0 ? (concluidos / total) * 100 : 0;
};
