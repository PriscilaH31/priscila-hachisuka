import mongoose from "mongoose";

const MaquinaSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  tipo: { type: String, required: true },
  data: { type: Date, required: true },
});

export default mongoose.model("Maquina", MaquinaSchema);
