// dependencies
import { log } from './utils.js';
import mongoose from 'mongoose';
mongoose.Promise = Promise;

// state
const state = { isOn: false };

// interface
export const start = () => {
  log('__DB_CONNECTED__', process.env.MONGO_URI);
  if (state.isOn)
    return Promise.reject(new Error('USER ERROR: db is already connected'));
  state.isOn = true;
  return mongoose.connect(process.env.MONGO_URI);
};

export const stop = () => {
  log('__DB_DISCONNECTED__');
  if (!state.isOn)
    return Promise.reject(new Error('USER ERROR: db is already disconnected'));
  state.isOn = false;
  return mongoose.disconnect();
};
