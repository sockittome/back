// dependencies
import * as db from './db';
import express from 'express';
import { log } from './utils.js'; // eslint-disable-line
import bodyParser from 'body-parser';
import cors from 'cors';
// import routes from '../route';
import ioServer from './io-server.js';

// state
const app = express().use(bodyParser.json()).use(cors());
const router = express.Router();
const state = {
  isOn: false,
  http: null,
};

app.use('/api/v1', router);
require('../route/route-auth')(router);
require('../route/route-truthyfalsy')(router);
require('../route/route-profile')(router);


// 404 - catch all
app.all('*', (req, res) => {
  return res.status(404).send('PATH ERROR: 404 invalid path');
});


// interface
export const start = () => {
  return new Promise((resolve, reject) => {
    if (state.isOn)
      return reject(new Error('USAGE ERROR: the server is already on'));
    state.isOn = true;
    db.start()
      .then(() => {
        state.http = app.listen(process.env.PORT, () => {
          log('__SERVER_UP__', process.env.PORT);
          resolve();
        });
        ioServer(state.http);
      })
      .catch(reject);
  });
};

export const stop = () => {
  return new Promise((resolve, reject) => {
    if (!state.isOn)
      return reject(new Error('USAGE ERROR: the server is already off'));
    return db.stop()
      .then(() => {
        state.http.close(() => {
          log('__SERVER_DOWN__');
          state.isOn = false;
          state.http = null;
          resolve();
        });
      })
      .catch(reject);
  });
};
