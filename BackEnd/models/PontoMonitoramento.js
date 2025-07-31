import mongoose from "mongoose";

const pontoMonitoramentoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sensor: {
    modelo: {
      type: String,
      enum: ["TcAg", "TcAs", "HF+"],
      required: true,
    },
    id: { type: String, required: true, unique: true },
  },

  maquinaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Maquina",
    required: true,
  },

  temperatura: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model("PontoMonitoramento", pontoMonitoramentoSchema);
