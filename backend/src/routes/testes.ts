import { Router } from "express";

const router = Router();

router.post("/", (req, res) => {
  const { mensagem } = req.body;

  if (typeof mensagem !== "string" || !mensagem.trim()) {
    res.status(400).json({
      erro: "Envie uma mensagem válida.",
    });
    return;
  }

  res.status(200).json({
    resposta: `Backend recebeu sua mensagem: ${mensagem}`,
  });
});

export default router;