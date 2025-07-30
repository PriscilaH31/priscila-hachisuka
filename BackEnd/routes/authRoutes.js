import express from "express";
import { login, cadastrarUsuario } from "../controllers/loginController.js";

const router = express.Router();

router.post("/login", login);
router.post("/cadastrar", cadastrarUsuario);

export default router;
