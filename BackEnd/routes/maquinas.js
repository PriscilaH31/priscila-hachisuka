import express from "express";
import {
  listarMaquinas,
  criarMaquina,
  atualizarMaquina,
  deletarMaquina,
} from "../controllers/maquinaController.js";

const router = express.Router();

router.get("/", listarMaquinas);
router.post("/", criarMaquina);
router.put("/:id", atualizarMaquina);
router.delete("/:id", deletarMaquina);

export default router;
