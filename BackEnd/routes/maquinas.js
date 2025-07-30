import express from "express";
import Maquina from "../models/Maquina.js";

const router = express.Router();

// GET - todas as máquinas
router.get("/", async (req, res) => {
  const maquinas = await Maquina.find();
  res.json(maquinas);
});

// POST - nova máquina
router.post("/", async (req, res) => {
  const nova = new Maquina(req.body);
  const salva = await nova.save();
  res.status(201).json(salva);
});

// PUT - editar máquina
router.put("/:id", async (req, res) => {
  const atualizada = await Maquina.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  res.json(atualizada);
});

// DELETE - excluir máquina
router.delete("/:id", async (req, res) => {
  await Maquina.findByIdAndDelete(req.params.id);
  res.json({ mensagem: "Máquina excluída" });
});

export default router;
