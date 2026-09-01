import express, { type Request, type Response } from "express";
 const app = express();

 const PORT = Number(process.env.PORT) || 3001;

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
    console.log(`Backend rodando em http://localhost:${PORT}`);
 });