import { Router } from 'express';
import cors from 'cors';
import bindResponse from '../middleware/bind-response';
import routerAuth from './route-auth';
// import routerProfile from './route-profile';
// import routerGames from './route-games';
// import errorHandler from '../middleware/error-handler';

export default new Router()
  .use([
    cors({
      origin: process.env.CORS_ORIGIN,
      credentials: true,
    }),
    bindResponse,
    // routerAuth,
    // routerGames,
    // routerProfile,
    // errorHandler,
  ]);
