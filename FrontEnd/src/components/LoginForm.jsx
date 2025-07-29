import React, { useState } from "react";
import meuVideo from "../assets/meu-video.mp4";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = (e) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <div className="login-box">
          <h3>Bem-vindo!</h3>
          <h2>Acesso a Conta</h2>
          <form onSubmit={submitLogin} className="login-form">
            <input
              type="email"
              placeholder="E-mail"
              className="login-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              className="login-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" className="login-button">
              Entrar
            </button>
            <h1>Esqueci minha senha</h1>
          </form>
        </div>
      </div>

      {/* VÍDEO no lado direito */}
      <div className="login-video-section">
        <video
          src={meuVideo}
          autoPlay
          muted
          loop
          playsInline
          className="login-video"
        />
      </div>
    </div>
  );
}
