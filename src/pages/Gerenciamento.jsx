import React, { useState } from "react";
import "../styles/gerenciamento.css";

export default function Gerenciamento() {
  const [maquinas, MaquinaGerenciada] = useState([]);
  const [edicaoId, EdicaoId] = useState(null);
  const [form, Form] = useState({ name: "", type: "" });

  const salvarMaquina = (e) => {
    e.preventDefault();
    if (edicaoId) {
      MaquinaGerenciada(
        maquinas.map((m) => (m.id === edicaoId ? { ...form, id: edicaoId } : m))
      );
      EdicaoId(null);
    } else {
      MaquinaGerenciada([...maquinas, { ...form, id: Date.now() }]);
    }
    Form({ name: "", type: "" });
  };

  const editarMaquina = (maquina) => {
    Form({ name: maquina.name, type: maquina.type });
    EdicaoId(maquina.id);
  };

  const deletarMaquina = (id) => {
    MaquinaGerenciada(maquinas.filter((m) => m.id !== id));
    if (edicaoId === id) EdicaoId(null);
  };

  return (
    <div className="maquina-container">
      <h2>Gestão de Máquinas</h2>

      <form onSubmit={salvarMaquina} className="maquina-form">
        <input
          type="text"
          placeholder="Nome da Máquina"
          value={form.name}
          onChange={(e) => Form({ ...form, name: e.target.value })}
          required
        />
        <select
          value={form.type}
          onChange={(e) => Form({ ...form, type: e.target.value })}
          required
        >
          <option value="">Tipo</option>
          <option value="Bomba">Bomba</option>
          <option value="Ventilador">Ventilador</option>
        </select>
        <button type="submit">
          {edicaoId ? "Salvar Alterações" : "Adicionar Máquina"}
        </button>
      </form>

      <ul className="lista-maquinas">
        {maquinas.map((maquina) => (
          <li key={maquina.id}>
            <div>
              <strong>{maquina.name}</strong> — {maquina.type}
            </div>
            <div className="actions">
              <button onClick={() => editarMaquina(maquina)}>Editar</button>
              <button
                onClick={() => deletarMaquina(maquina.id)}
                className="delete"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
