export const listarCursos = async (req, res) => {
    const { categoria } = req.query;
    try {
        let whereClause = {};
        if (categoria && categoria !== "all") {
            whereClause = { categoria };
        }
    }
    catch (error) {
        console.error("Erro ao buscar cursos:", error);
        res.status(500).json({ message: "Erro ao buscar cursos", error });
    }
};
