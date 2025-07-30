import React, { useState } from "react";

export default function CadastroForm({ fecharModal }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // sua lógica para enviar cadastro ao backend
    // após sucesso, fecha modal:
    fecharModal();
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
        required
      />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
