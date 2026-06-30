import mongoose from "mongoose";

export const STATUS_CANCELADOS = ["cancelado", "cancelado_cliente"];

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
      enum: ["agendado", "cancelado", "cancelado_cliente", "remarcado_cliente"],
      default: "agendado",
    },

    dataAnterior: {
      type: String,
    },

    horarioAnterior: {
      type: String,
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
