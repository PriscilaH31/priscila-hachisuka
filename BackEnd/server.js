import express from "express";
import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import cors from "cors";
import maquinasRoutes from "./routes/maquinas.js";
import pontoMonitoramentoRoutes from "./routes/pontoMonitoramentoRoutes.js";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/api/maquinas", maquinasRoutes);
app.use("/api/pontos", pontoMonitoramentoRoutes);
mongoose
  .connect("mongodb://localhost:27017/gerenciamento", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB conectado");
    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => console.error(err));
