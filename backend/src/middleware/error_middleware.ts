import type {
  ErrorRequestHandler,
  Request,
  Response,
  NextFunction,
} from "express";

interface ErroComStatus extends Error {
  statusCode?: number;
}

export const errorMiddleware: ErrorRequestHandler = (
  erro: ErroComStatus,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  console.error("Erro na API:", erro);

  const status =
    typeof erro.statusCode === "number" &&
    erro.statusCode >= 400 &&
    erro.statusCode < 600
      ? erro.statusCode
      : 500;

  const mensagem =
    status === 500
      ? "Ocorreu um erro interno no servidor."
      : erro.message;

  res.status(status).json({
    erro: mensagem,
  });
};
