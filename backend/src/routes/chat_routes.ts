
import { Router } from "express";
import {
  iniciarConversa,
  enviarMensagem,
  obterHistorico,
  listarConversas,
} from "../controllers/chat_controller.js";

const router = Router();

router.get("/conversas", listarConversas);
router.post("/iniciar", iniciarConversa);
router.post("/mensagem", enviarMensagem);
router.get("/:sessionId/historico", obterHistorico);

export default router;
