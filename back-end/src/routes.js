import exprees from 'express';
import userController from './controller/userController.js';

const routes = exprees();

routes.use('/users', userController);

export default routes;