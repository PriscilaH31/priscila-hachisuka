import Usuario from "../models/Usuario.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ error: "Email ou senha incorretos" });
    }

    const token = jwt.sign(
      { id: usuario._id, email: usuario.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      usuario: { id: usuario._id, email: usuario.email, nome: usuario.nome },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
