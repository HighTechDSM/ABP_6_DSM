import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { errorMiddleware } from "./middleware/error_middleware.js";
import chatRoutes from "./routes/chat_routes.js";
import usuariosRoutes from "./routes/usuarios_routes.js";
import agendamentosRoutes from "./routes/agendamentos_routes.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
    ],
  })
);


app.use(express.json());

// Disponibiliza os arquivos da pasta backend/public.
app.use(express.static(path.resolve(__dirname, "../public")));

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API do chatbot PROCON funcionando!",
  });
});

// Rotas principais da aplicação.
app.use("/api/chat", chatRoutes);
app.use("/api/usuarios", usuariosRoutes);
app.use("/api/agendamentos", agendamentosRoutes);

// Middleware de erros deve ficar depois das rotas.
app.use(errorMiddleware);

export default app;