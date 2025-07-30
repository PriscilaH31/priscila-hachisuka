import React, { useEffect, useState } from "react";
import api from "../services/api";

const sensoresPermitidos = ["TcAg", "TcAs", "HF+"];

export default function PontoMonitoramentoForm({ onClose, onSaved }) {
  const [nome, setNome] = useState("");
  const [sensorModelo, setSensorModelo] = useState("");
  const [maquinaId, setMaquinaId] = useState("");
  const [maquinas, setMaquinas] = useState([]);
  const [erro, setErro] = useState("");

  // Para mostrar tipo da máquina selecionada
  const maquinaSelecionada = maquinas.find((m) => m._id === maquinaId);

  useEffect(() => {
    async function buscarMaquinas() {
      const res = await api.get("/maquinas");
      setMaquinas(res.data);
    }
    buscarMaquinas();
  }, []);

  const handleSalvar = async (e) => {
    e.preventDefault();
    setErro("");

    if (!maquinaId) {
      setErro("Máquina inválida.");
      return;
    }

    if (
      maquinaSelecionada.tipo === "Bomba" &&
      ["TcAg", "TcAs"].includes(sensorModelo)
    ) {
      setErro(
        "Sensores TcAg e TcAs não são permitidos para máquina do tipo Bomba."
      );
      return;
    }

    try {
      await api.post("/pontos", {
        nome,
        sensor: { modelo: sensorModelo },
        maquinaId,
      });
      onSaved();
    } catch (err) {
      setErro("Erro ao salvar ponto de monitoramento.");
      console.error(err);
    }
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <h3>Novo Ponto de Monitoramento</h3>
        {erro && <p style={{ color: "red" }}>{erro}</p>}
        <form onSubmit={handleSalvar}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Nome do Ponto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <select
              value={sensorModelo}
              onChange={(e) => setSensorModelo(e.target.value)}
              required
            >
              <option value="">Modelo do Sensor</option>
              {sensoresPermitidos.map((modelo) => (
                <option key={modelo} value={modelo}>
                  {modelo}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <select
              value={maquinaId}
              onChange={(e) => setMaquinaId(e.target.value)}
              required
            >
              <option value="">Selecionar Máquina</option>
              {maquinas.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.nome}
                </option>
              ))}
            </select>
          </div>

          {maquinaSelecionada && (
            <div className="form-group">
              <label>Tipo da Máquina:</label>
              <input type="text" value={maquinaSelecionada.tipo} readOnly />
            </div>
          )}

          <div className="form-actions">
            <button type="submit">Salvar</button>
            <button type="button" onClick={onClose}>
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
