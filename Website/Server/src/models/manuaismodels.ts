import {
  Model,
  DataTypes,
  Optional,
  Sequelize,
} from "sequelize";
import sequelize from "../db";
import { ManualAttributes } from "../utils/manual";

// Campos opcionais ao criar
type ManualCreationAttributes = Optional<ManualAttributes, "id" | "imagem_capa_url" | "arquivo_pdf_url" | "criado_em">;

class Manual extends Model<ManualAttributes, ManualCreationAttributes>
  implements ManualAttributes {
  public id!: number;
  public titulo!: string;
  public descricao!: string;
  public imagem_capa_url?: string;
  public arquivo_pdf_url?: string;
  public categoria_id!: string;
  public subcategoria_id!: number;
  public criado_em?: Date;
  public status!: string;

}

Manual.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descricao: {
      type: DataTypes.TEXT,
    },
    imagem_capa_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    arquivo_pdf_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    categoria_id: {
      type: DataTypes.UUID,
    },
    subcategoria_id: {
      type: DataTypes.INTEGER,
    },
    criado_em: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "rascunho",
    },
  },
  {
    sequelize,
    modelName: "Manual",
    tableName: "manuais",
    timestamps: false,
  }
);

export default Manual;
