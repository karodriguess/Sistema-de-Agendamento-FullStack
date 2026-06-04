import mongoose from "mongoose";

const DisponibilidadeSchema = new mongoose.Schema(
  {
    profissionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profissional",
      required: true,
    },

    diaSemana: {
      type: Number,
      required: true,
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

const Disponibilidade =
  mongoose.models.Disponibilidade ||
  mongoose.model("Disponibilidade", DisponibilidadeSchema);

export default Disponibilidade;
