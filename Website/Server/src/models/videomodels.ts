import sequelize from "../db"; // ou onde definiste a instância do Sequelize

export async function getAllVideos() {
  const [rows] = await sequelize.query("SELECT * FROM videos ORDER BY created_at DESC");
  return rows;
}

export async function getVideoById(id: number) {
  const [rows]: any = await sequelize.query("SELECT * FROM videos WHERE id = ?", {
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
}) {
  const { title, url, category_id, subcategory_id, status } = video;
  const [rows]: any = await sequelize.query(
    `INSERT INTO videos (title, url, category_id, subcategory_id, status)
     VALUES (?, ?, ?, ?, ?) RETURNING *`,
    {
      replacements: [title, url, category_id, subcategory_id ?? null, status ?? "rascunho"],
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
