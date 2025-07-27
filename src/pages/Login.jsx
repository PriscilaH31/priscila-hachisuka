import React from "react";
import LoginForm from "../components/LoginForm.jsx";
import "../styles/login.css";

export default function Login() {
  const handleLogin = (email, password) => {
    if (email === "admin@email.com" && password === "123456") {
      alert("Login realizado!");
    } else {
      alert("Credenciais inválidas");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form-section">
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}
