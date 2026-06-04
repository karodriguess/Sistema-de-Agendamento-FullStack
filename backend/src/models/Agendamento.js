import mongoose from "mongoose";

const AgendamentoSchema = new mongoose.Schema(
  {
    clienteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    profissionalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profissional",
      required: true,
    },

    servicoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Servico",
      required: true,
    },

    data: {
      type: String,
      required: true,
    },

    horario: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["agendado", "cancelado", "concluido"],
      default: "agendado",
    },
  },
  {
    timestamps: true,
  }
);

const Agendamento =
  mongoose.models.Agendamento ||
  mongoose.model("Agendamento", AgendamentoSchema);

export default Agendamento;
