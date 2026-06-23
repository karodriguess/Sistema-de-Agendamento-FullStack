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
      enum: [
        "agendado",
        "confirmado",
        "cancelado",
        "cancelado_cliente",
        "remarcado_cliente",
        "concluido",
      ],
      default: "confirmado",
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
