import dotenv from "dotenv";
import express, { type Request, type Response } from "express";

dotenv.config({ path: "../.env" });

 const app = express();

 const PORT = Number(process.env.PORT) || 3001;
 const NODE_ENV = process.env.NODE_ENV || "development";

 app.use(express.json());

 app.get("/", (_req: Request, res: Response) => {
    res.json({
        message: "API Chatbot PROCON funcionando",
    });
 });

 app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
 });

 app.listen(PORT, () => {
  console.log(
    `Backend rodando em http://localhost:${PORT} (${NODE_ENV})`
  );
});