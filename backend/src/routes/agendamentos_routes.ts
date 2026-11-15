import { Router } from "express";
import {
  criarAgendamento,
  listarAgendamentosUsuario,
  listarTodosAgendamentos,
  cancelarAgendamento,
} from "../controllers/agendamentos_controller.js";

const router = Router();

router.get("/", listarTodosAgendamentos);
router.post("/", criarAgendamento);
router.get("/usuario/:usuarioId", listarAgendamentosUsuario);
router.patch("/:id/cancelar", cancelarAgendamento);

export default router;
