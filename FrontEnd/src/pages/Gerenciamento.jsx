import React, { useState, useEffect } from "react";
import api from "../services/api";
import "../styles/gerenciamento.css";
import PontoMonitoramentoForm from "../components/PontoMonitoramentoForm";

const tiposMaquina = ["Bomba", "Ventilador"];
const sensoresMaquina = ["TcAg", "TcAs", "HF+", "HF-"];

export default function Gerenciamento() {
  const [maquinas, setMaquinas] = useState([]);
  const [filtro, setFiltro] = useState({
    nome: "",
    tipo: "",
    dataInicial: "",
    dataFinal: "",
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(null);
  const [form, setForm] = useState({
    nome: "",
    data: new Date().toISOString().slice(0, 10),
    tipo: "",
    sensor: "",
  });
  const [erro, setErro] = useState(null);

  const buscarMaquinas = async () => {
    try {
      const params = {};
      if (filtro.nome) params.nome = filtro.nome;
      if (filtro.tipo) params.tipo = filtro.tipo;
      if (filtro.dataInicial) params.dataInicial = filtro.dataInicial;
      if (filtro.dataFinal) params.dataFinal = filtro.dataFinal;

      const res = await api.get("/maquinas", { params });
      setMaquinas(res.data);
      setErro(null);
    } catch (error) {
      setErro("Erro ao buscar máquinas.");
      console.error(error);
    }
  };

  useEffect(() => {
    buscarMaquinas();
  }, []);

  const abrirModal = (maquina = null) => {
    if (maquina) {
      setModoEdicao(maquina._id);
      setForm({
        nome: maquina.nome,
        data: maquina.data.slice(0, 10),
        tipo: maquina.tipo,
        sensor: maquina.sensor,
      });
    } else {
      setModoEdicao(null);
      setForm({
        nome: "",
        data: new Date().toISOString().slice(0, 10),
        tipo: "",
        sensor: "",
      });
    }
    setModalAberto(true);
    setErro(null);
  };

  const salvarMaquina = async (e) => {
    e.preventDefault();

    try {
      if (modoEdicao) {
        await api.put(`/maquinas/${modoEdicao}`, form);
      } else {
        await api.post("/maquinas", form);
      }
      setModalAberto(false);
      buscarMaquinas();
    } catch (error) {
      setErro("Erro ao salvar máquina.");
      console.error(error);
    }
  };

  const excluirMaquina = async (id) => {
    if (!window.confirm("Confirma exclusão da máquina?")) return;
    try {
      await api.delete(`/maquinas/${id}`);
      buscarMaquinas();
    } catch (error) {
      setErro("Erro ao excluir máquina.");
      console.error(error);
    }
  };

  const [modalPontoAberta, setModalPontoAberta] = useState(false);
  const [maquinaSelecionada, setMaquinaSelecionada] = useState(null);

  return (
    <div className="gerenciamento-container">
      <h2>Gestão de Máquina</h2>

      {/* Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Nome"
          value={filtro.nome}
          onChange={(e) => setFiltro({ ...filtro, nome: e.target.value })}
        />

        <select
          value={filtro.tipo}
          onChange={(e) => setFiltro({ ...filtro, tipo: e.target.value })}
        >
          <option value="">Tipo</option>
          {tiposMaquina.map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipo}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filtro.dataInicial}
          onChange={(e) =>
            setFiltro({ ...filtro, dataInicial: e.target.value })
          }
        />

        <input
          type="date"
          value={filtro.dataFinal}
          onChange={(e) => setFiltro({ ...filtro, dataFinal: e.target.value })}
        />

        <button onClick={buscarMaquinas}>Pesquisar</button>
      </div>

      <div className="btn-wrapper">
        <button onClick={() => abrirModal()}>Cadastrar Máquina</button>
        <button
          onClick={() => {
            setModalPontoAberta(true);
            setMaquinaSelecionada(null); // ponto avulso sem máquina
          }}
          style={{ marginLeft: "10px", background: "#44c", color: "#fff" }}
        >
          Cadastrar Ponto de Monitoramento
        </button>
      </div>

      {erro && <p className="erro">{erro}</p>}

      <div className="container-tabela">
        <table className="tabela-maquinas">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Data</th>
              <th>Tipo</th>
              <th>Sensor</th>
              <th>Ponto Monitoramento</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {maquinas.length === 0 && (
              <tr>
                <td colSpan="7">Nenhuma máquina encontrada.</td>
              </tr>
            )}
            {maquinas.map((m) => (
              <tr key={m._id}>
                <td>{m.nome}</td>
                <td>{new Date(m.data).toLocaleDateString()}</td>
                <td>{m.tipo}</td>
                <td>{m.sensor}</td>
                <td>{m.pontos?.map((p) => p.nome).join(", ") || "—"}</td>
                <td>
                  <button onClick={() => abrirModal(m)} className="editar">
                    ✏️
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => excluirMaquina(m._id)}
                    className="excluir"
                  >
                    ❌
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalAberto && (
        <div className="modal">
          <div className="modal-content">
            <h3>{modoEdicao ? "Editar Máquina" : "Cadastrar Máquina"}</h3>

            <form onSubmit={salvarMaquina}>
              <div className="form-group">
                <input
                  type="text"
                  placeholder="Nome"
                  value={form.nome}
                  onChange={(e) => setForm({ ...form, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <input
                  type="date"
                  value={form.data}
                  onChange={(e) => setForm({ ...form, data: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <select
                  value={form.tipo}
                  onChange={(e) => setForm({ ...form, tipo: e.target.value })}
                  required
                >
                  <option value="">Tipo</option>
                  {tiposMaquina.map((tipo) => (
                    <option key={tipo} value={tipo}>
                      {tipo}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <select
                  value={form.sensor}
                  onChange={(e) => setForm({ ...form, sensor: e.target.value })}
                  required
                >
                  <option value="">Sensor</option>
                  {sensoresMaquina.map((sensor) => (
                    <option key={sensor} value={sensor}>
                      {sensor}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="submit">Salvar</button>
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="cancelar"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalPontoAberta && (
        <PontoMonitoramentoForm
          maquina={maquinaSelecionada}
          onClose={() => setModalPontoAberta(false)}
          onSaved={() => {
            setModalPontoAberta(false);
            buscarMaquinas(); // Atualiza a lista com pontos novos
          }}
        />
      )}
    </div>
  );
}
