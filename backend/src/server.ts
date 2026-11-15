import "dotenv/config";
import app from "./app.js";

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, () => {
  console.log(`Backend PROCON disponível em http://localhost:${PORT}`);
  console.log(`Status do backend: http://localhost:${PORT}/api/health`);
});
