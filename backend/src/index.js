import express from 'express';
import routes from './routes.js';
import cors from 'cors';
import { checkInternetConnection } from './utils/checkConnection.js';
import dotenv from 'dotenv';

dotenv.config();

const serve = express();
serve.use(cors());
serve.use(express.json());

let conectado = true;
async function monitorarConexao() {
  const online = await checkInternetConnection();
  if (!online && conectado) {
    conectado = false;
    console.log("🚨 Sem conexão com a internet!");
  } else if (online && !conectado) {
    conectado = true;
    console.log("✅ Conexão com a internet restaurada!");
  }
}
setInterval(monitorarConexao, 10000);

serve.use(async (req, res, next) => {
  const online = await checkInternetConnection();
  if (!online) return res.status(503).send({ error: "Servidor sem conexão com a internet" });
  next();
});

// rotas
serve.use("/", routes);

serve.listen(3332, () => console.log('Backend rodando na porta 3332 😎'));
