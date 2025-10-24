import routes from './routes.js';
import exprees from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const serve = exprees();


serve.use(cors());
serve.use(exprees.json());

serve.use("/", routes);

serve.listen(3332, () => {
  console.log('Backend rodando na porta 3332 😎');
});