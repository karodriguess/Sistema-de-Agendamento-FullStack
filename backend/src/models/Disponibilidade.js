import mongoose from "mongoose";

const DisponibilidadeSchema = new mongoose.Schema(
  {
    profissionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profissional",
      required: true,
    },

    data: {
      type: String,
      required: true, // formato "YYYY-MM-DD", ex: "2026-06-25"
    },

    horarios: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

DisponibilidadeSchema.index({ profissionalId: 1, data: 1 }, { unique: true });

// Força re-registro do modelo para o Next.js dev hot-reload não usar schema antigo em cache
delete mongoose.models["Disponibilidade"];
const Disponibilidade = mongoose.model("Disponibilidade", DisponibilidadeSchema);

export default Disponibilidade;
