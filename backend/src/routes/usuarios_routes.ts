import { Router } from "express";
import {
  criarUsuario,
  obterUsuario,
} from "../controllers/usuarios_controller.js";

const router = Router();

router.post("/", criarUsuario);
router.get("/:id", obterUsuario);

export default router;
