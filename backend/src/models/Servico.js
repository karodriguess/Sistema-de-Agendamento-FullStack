import mongoose from "mongoose";

const ServicoSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
    },

    duracao: {
      type: Number,
      required: true,
    },

    preco: {
      type: Number,
      required: true,
    },

    ativo: {
      type: Boolean,
      default: true,
    },

    profissionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profissional",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Servico =
  mongoose.models.Servico || mongoose.model("Servico", ServicoSchema);

export default Servico;
