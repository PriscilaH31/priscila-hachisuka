import PontoMonitoramento from "../models/PontoMonitoramento.js";
import Maquina from "../models/Maquina.js";
import { v4 as uuidv4 } from "uuid";

export const criarPonto = async (req, res) => {
  try {
    const { nome, sensor, maquinaId, temperatura } = req.body;

    const maquina = await Maquina.findById(maquinaId);
    if (!maquina) {
      return res.status(400).json({ erro: "Máquina não encontrada." });
    }

    // Exemplo de validação específica para sensores TcAg e TcAs
    if (maquina.tipo === "Bomba" && ["TcAg", "TcAs"].includes(sensor.modelo)) {
      return res.status(400).json({
        erro: "Sensores TcAg e TcAs não são permitidos para máquinas do tipo Bomba.",
      });
    }

    // Cria novo ponto, inclui temperatura se for enviada
    const novoPonto = new PontoMonitoramento({
      nome,
      sensor: {
        modelo: sensor.modelo,
        id: uuidv4(), // id gerado no backend para o sensor
      },
      maquinaId,
      temperatura: temperatura !== undefined ? temperatura : 0, // padrão 0 se não enviado
    });

    await novoPonto.save();

    // Adiciona o ponto à máquina (supondo que máquina tem array pontos)
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
    const pontos = await PontoMonitoramento.find().populate("maquinaId");

    const pontosFiltrados = pontos.map((ponto) => ({
      id: ponto._id,
      nome: ponto.nome,
      temperatura: ponto.temperatura ?? 0,
      maquinaId: ponto.maquinaId?._id,
      maquinaNome: ponto.maquinaId?.nome,
      tipoMaquina: ponto.maquinaId?.tipo,
      sensorModelo: ponto.sensor.modelo,
    }));

    res.json(pontosFiltrados);
  } catch (error) {
    console.error("Erro ao listar pontos:", error);
    res.status(500).json({ erro: "Erro ao listar pontos." });
  }
};

export const atualizarPonto = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, sensor, temperatura } = req.body;

    const ponto = await PontoMonitoramento.findById(id);
    if (!ponto) {
      return res.status(404).json({ erro: "Ponto não encontrado." });
    }

    if (nome) ponto.nome = nome;
    if (sensor && sensor.modelo) ponto.sensor.modelo = sensor.modelo;
    if (temperatura !== undefined) ponto.temperatura = temperatura;

    await ponto.save();
    res.json(ponto);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao atualizar ponto." });
  }
};

export const excluirPonto = async (req, res) => {
  try {
    const { id } = req.params;

    const ponto = await PontoMonitoramento.findByIdAndDelete(id);
    if (!ponto) {
      return res.status(404).json({ erro: "Ponto não encontrado." });
    }

    // Remover ponto da máquina também
    await Maquina.findByIdAndUpdate(ponto.maquinaId, {
      $pull: { pontos: ponto._id },
    });

    res.json({ mensagem: "Ponto excluído com sucesso." });
  } catch (error) {
    console.error("Erro ao excluir ponto:", error);
    res.status(500).json({ erro: "Erro ao excluir ponto." });
  }
};
