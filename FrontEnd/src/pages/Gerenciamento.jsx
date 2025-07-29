// src/pages/Gerenciamento.jsx
import React, { useState } from "react";
import "../styles/gerenciamento.css";
import { data } from "react-router-dom";

const tiposMaquina = ["Bomba", "Ventilador"];

export default function Gerenciamento() {
  const [maquinas, setMaquinas] = useState([]);
  const [filtro, setFiltro] = useState({
    nome: "",
    tipo: "",
    dataInicial: "",
    dataFinal: "",
  });
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState({ nome: "", data: "", tipo: "" });
  const [modoEdicao, setModoEdicao] = useState(null);
  const sensorMaquina = [
    "Sensor de Temperatura",
    "Sensor de Pressão",
    "Sensor de Umidade",
  ];

  const filtrarMaquinas = () => {
    return maquinas.filter(
      (m) =>
        m.nome.toLowerCase().includes(filtro.nome.toLowerCase()) &&
        (filtro.tipo === "" || m.tipo === filtro.tipo)
    );
  };

  const abrirModal = (maquina = null) => {
    setModoEdicao(maquina?.id || null);
    setForm(
      maquina || {
        nome: "",
        data: new Date().toISOString().slice(0, 10),
        tipo: "",
        sensor: "",
      }
    );
    setModalAberto(true);
  };

  const salvarMaquina = (e) => {
    e.preventDefault();
    if (modoEdicao) {
      setMaquinas(
        maquinas.map((m) =>
          m.id === modoEdicao ? { ...form, id: modoEdicao } : m
        )
      );
    } else {
      setMaquinas([...maquinas, { ...form, id: Date.now() }]);
    }
    setModalAberto(false);
  };

  const excluirMaquina = (id) => {
    setMaquinas(maquinas.filter((m) => m.id !== id));
  };

  return (
    <div className="gerenciamento-container">
      <h2>GESTÃO DE MÁQUINA</h2>
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

        {/* Campo de Data Inicial */}
        <input
          type="date"
          value={filtro.dataInicial || ""}
          onChange={(e) =>
            setFiltro({ ...filtro, dataInicial: e.target.value })
          }
        />

        {/* Campo de Data Final */}
        <input
          type="date"
          value={filtro.dataFinal || ""}
          onChange={(e) => setFiltro({ ...filtro, dataFinal: e.target.value })}
        />

        <button onClick={filtrarMaquinas}>Pesquisar</button>
      </div>

      <div className="btn-wrapper">
        <button onClick={() => abrirModal()}>Cadastrar</button>
      </div>

      <div className="container-tabela">
        <table className="tabela-maquinas">
          <thead>
            <tr>
              <th>Nome da Máquina</th>
              <th>Data Cadastro</th>
              <th>Tipo</th>
              <th>Sensor</th>
              <th>Editar</th>
              <th>Excluir</th>
            </tr>
          </thead>
          <tbody>
            {filtrarMaquinas().map((m) => (
              <tr key={m.id}>
                <td>{m.nome}</td>
                <td>{m.data}</td>
                <td>{m.tipo}</td>
                <td>
                  <span
                    className={`sensor ${
                      m.tipo === "Bomba"
                        ? "verde"
                        : m.tipo === "Ventilador"
                        ? "amarelo"
                        : "vermelho"
                    }`}
                  ></span>
                </td>
                <td>
                  <button onClick={() => abrirModal(m)} className="editar">
                    ✏️
                  </button>
                </td>
                <td>
                  <button
                    onClick={() => excluirMaquina(m.id)}
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
                  value={form.sensor}
                  onChange={(e) => setForm({ ...form, sensor: e.target.value })}
                  required
                >
                  <option value="">Sensor</option>
                  {sensorMaquina.map((sensor) => (
                    <option key={sensor} value={sensor}>
                      {sensor}
                    </option>
                  ))}
                </select>
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

              <div className="form-actions">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setModalAberto(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
