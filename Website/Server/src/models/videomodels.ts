import sequelize from "../db"; // ou onde definiste a instância do Sequelize

export async function getAllVideos() {
  const [rows] = await sequelize.query(`
    SELECT 
      v.*,
      c.nome AS categoria_nome,
      s.nome AS subcategoria_nome
    FROM videos v
    LEFT JOIN categorias c ON v.category_id = c.id
    LEFT JOIN subcategoria s ON v.subcategory_id = s.subcategoriaid
    ORDER BY v.created_at DESC
  `);
  return rows;
}


export async function getVideoById(id: number) {
  const [rows]: any = await sequelize.query(`
    SELECT 
      v.*,
      c.nome AS categoria_nome,
      s.nome AS subcategoria_nome
    FROM videos v
    LEFT JOIN categorias c ON v.category_id = c.id
    LEFT JOIN subcategoria s ON v.subcategory_id = s.subcategoriaid
    WHERE v.id = ?
  `, {
    replacements: [id],
  });
  return rows[0];
}


export async function createVideo(video: {
  title: string;
  url: string;
  category_id: number;
  subcategory_id?: number;
  status?: string;
  professor_id: string; // 👈 correto
}) {
  const {
    title,
    url,
    category_id,
    subcategory_id,
    status,
    professor_id, // 👈 faltava adicionar aqui também
  } = video;

  const [rows]: any = await sequelize.query(
    `INSERT INTO videos (title, url, category_id, subcategory_id, status, professor_id)
     VALUES (?, ?, ?, ?, ?, ?) RETURNING *`, // 👈 adicionaste professor_id na SQL
    {
      replacements: [
        title,
        url,
        category_id,
        subcategory_id ?? null,
        status ?? "rascunho",
        professor_id, // 👈 aqui estava o erro — estava fora da destructuring
      ],
    }
  );

  return rows[0];
}


export async function updateVideo(id: number, video: Partial<{ title: string; url: string; status: string; category_id: number; subcategory_id: number }>) {
  const fields = [];
  const values: any[] = [];

  for (const key in video) {
    fields.push(`${key} = ?`);
    values.push((video as any)[key]);
  }
  values.push(id);

  const [rows]: any = await sequelize.query(
    `UPDATE videos SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP WHERE id = ? RETURNING *`,
    { replacements: values }
  );

  return rows[0];
}

export async function deleteVideo(id: number) {
  await sequelize.query("DELETE FROM videos WHERE id = ?", {
    replacements: [id],
  });
}
