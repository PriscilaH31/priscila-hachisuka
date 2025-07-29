import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import maquinasRoutes from "./routes/maquinas.js";

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Rotas
app.use("/maquinas", maquinasRoutes);

// MongoDB
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
