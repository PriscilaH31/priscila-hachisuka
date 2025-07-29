import Maquina from "../models/Maquina.js";

export const listarMaquinas = async (req, res) => {
  try {
    const filtro = {};
    const { nome, tipo, dataInicial, dataFinal } = req.query;

    if (nome) filtro.nome = new RegExp(nome, "i");
    if (tipo) filtro.tipo = tipo;
    if (dataInicial || dataFinal) {
      filtro.data = {};
      if (dataInicial) filtro.data.$gte = new Date(dataInicial);
      if (dataFinal) filtro.data.$lte = new Date(dataFinal);
    }

    const maquinas = await Maquina.find(filtro);
    res.json(maquinas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const criarMaquina = async (req, res) => {
  try {
    const nova = new Maquina(req.body);
    const salva = await nova.save();
    res.status(201).json(salva);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const atualizarMaquina = async (req, res) => {
  try {
    const atualizada = await Maquina.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(atualizada);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deletarMaquina = async (req, res) => {
  try {
    await Maquina.findByIdAndDelete(req.params.id);
    res.json({ mensagem: "Máquina deletada com sucesso" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
