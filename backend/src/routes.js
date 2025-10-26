import express from 'express';
import userController from './controller/userController.js';

const routes = express.Router();   // Router, não express()

routes.use('/users', userController);  // todas rotas do userController terão /users como prefixo

export default routes;
