import express from "express";
import {
  criarPonto,
  listarPontos,
  excluirPonto,
  atualizarPonto,
} from "../controllers/pontoMonitoramentoController.js";

const router = express.Router();

router.post("/pontos", criarPonto);
router.get("/pontos", listarPontos);
router.delete("/pontos/:id", excluirPonto);
router.put("/pontos/:id", atualizarPonto);

export default router;
