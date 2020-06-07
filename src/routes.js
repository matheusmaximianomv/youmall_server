import { Router } from 'express';
import multer from 'multer';

import multerConfig from './config/multer';

import AccountController from './app/controllers/AccountController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import FileController from './app/controllers/FileController';

import Authenticated from './app/middlewares/Authenticated';
import UploadImage from './app/middlewares/UploadImage';

const routes = Router();

const upload = multer(multerConfig);

routes.get('/', (req, res) => {
  return res.status(200).json({
    name: 'Youmall',
    version: '1.0.0',
    description:
      'O projeto consiste em uma plataforma online de vendas onde os usuários poderão disponibilizar suas próprias peças de roupas e encontrar outros usuários próximos de sua localidade que sejam possíveis públicos alvos, gerando assim, uma facilidade para aqueles que querem desapegar de roupas que já não são usuais para o mesmo e aqueles que procuram por roupas semi-novas por um preço acessível.',
  });
});

routes.post('/account', AccountController.store);

routes.post('/sessions', SessionController.store);

routes.use(Authenticated);

routes.get('/products', ProductController.index);
routes.post(
  '/products',
  upload.single('file'),
  UploadImage,
  ProductController.store
);
routes.put(
  '/products/:id',
  upload.single('file'),
  UploadImage,
  ProductController.update
);

routes.get('/files/:id', FileController.show);

routes.get('*', (req, res) => {
  return res.status(404).json({
    error: 'Not Found',
  });
});

export default routes;
