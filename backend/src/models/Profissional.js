import mongoose from "mongoose";

const ProfissionalSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },

    especialidade: {
      type: String,
      required: true,
    },

    ativo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Profissional =
  mongoose.models.Profissional ||
  mongoose.model("Profissional", ProfissionalSchema);

export default Profissional;
