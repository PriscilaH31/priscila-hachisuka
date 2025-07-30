import PontoMonitoramento from "../models/PontoMonitoramento.js";
import Maquina from "../models/Maquina.js";
import { v4 as uuidv4 } from "uuid";

export const criarPonto = async (req, res) => {
  try {
    const { nome, sensor, maquinaId } = req.body;

    // Busca máquina para validar tipo e atualizar pontos
    const maquina = await Maquina.findById(maquinaId);
    if (!maquina)
      return res.status(400).json({ erro: "Máquina não encontrada." });

    if (maquina.tipo === "Bomba" && ["TcAg", "TcAs"].includes(sensor.modelo)) {
      return res.status(400).json({
        erro: "Sensores TcAg e TcAs não são permitidos para máquinas do tipo Bomba.",
      });
    }

    const novoPonto = new PontoMonitoramento({ nome, sensor, maquinaId });
    await novoPonto.save();

    // Atualiza a máquina para adicionar o ponto no array 'pontos'
    maquina.pontos.push(novoPonto._id);
    await maquina.save();

    res.status(201).json(novoPonto);
  } catch (error) {
    console.error("Erro ao criar ponto:", error);
    res.status(500).json({ erro: "Erro ao criar ponto." });
  }
};
export const listarPontos = async (req, res) => {
  try {
    // Pode implementar paginação, filtro e ordenação aqui:
    // Exemplo simples: pagina e limite por query params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    // Para ordenação (ex: ?sort=nome&order=asc)
    const sortField = req.query.sort || "nome";
    const sortOrder = req.query.order === "desc" ? -1 : 1;

    const total = await PontoMonitoramento.countDocuments();

    const pontos = await PontoMonitoramento.find()
      .populate("maquinaId", "nome tipo")
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      total,
      page,
      limit,
      pontos,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar pontos." });
  }
};

export const excluirPonto = async (req, res) => {
  try {
    await PontoMonitoramento.findByIdAndDelete(req.params.id);
    res.status(200).json({ mensagem: "Ponto excluído com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao excluir ponto." });
  }
};

export const atualizarPonto = async (req, res) => {
  try {
    // Não permitir atualizar sensor.id manualmente
    if (req.body.sensor?.id) {
      delete req.body.sensor.id;
    }

    const pontoAtualizado = await PontoMonitoramento.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!pontoAtualizado) {
      return res.status(404).json({ erro: "Ponto não encontrado." });
    }

    res.status(200).json(pontoAtualizado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar ponto." });
  }
};
