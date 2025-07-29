import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Gerenciamento from "../pages/Gerenciamento";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/gerenciamento" element={<Gerenciamento />} />
      </Routes>
    </BrowserRouter>
  );
}
