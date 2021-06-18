import { Router } from 'express';
import UserController from './controllers/User.controller';

const routes = new Router();

routes.post('/user', UserController.create);

routes.get('/users', UserController.index);

routes.get('/user/:id', UserController.show);

routes.put('/user/:id', UserController.update);

routes.delete('/user/:id', UserController.destroy);

export default routes;
