// dependencies
import { extname } from 'path'; // eslint-disable-line

// interface
// export const promisify = (fn) => (...args) =>
//   new Promise((resolve, reject) =>
//     fn(...args, (err, data) => err ? reject(err) : resolve(data)));

export const log = (...args) =>
  process.env.DEBUG === 'true' ? console.log(...args) : null;

export const logError = (...args) =>
  process.env.DEBUG === 'true' ? console.error(...args) : null;

// export const daysToMilliseconds = (days) => days * 1000 * 60 * 60 * 24;

// export const map = (list, cb) =>
//   Array.prototype.map.call(list, cb);

// export const filter = (list, cb) =>
//   Array.prototype.filter.call(list, cb);

// export const reduce = (list, ...args) =>
//   Array.prototype.reduce.apply(list, args);

// export const each = (list, cb) =>
//   Array.prototype.forEach.call(list, cb);

// export const pagerCreate = (model, populate = '') => (req, query = {}) => {
//   let offset = (Number(req.query.page) - 1) || 0;
//   let itemLimit = 100;
//   let route = `${process.env.API_URL}/${model.modelName}s?page=`;
//   return model.count()
//     .then(count => {
//       let remaining = count - offset * itemLimit;
//       return model.find(query)
//         .populate(populate)
//         .skip(offset > 0 ? offset * itemLimit : 0)
//         .limit(itemLimit)
//         .then(profiles => ({
//           count: count,
//           data: profiles,
//           last: `${route}${Math.floor((count - 1) / itemLimit) + 1}`,
//           prev: offset > 0 && remaining > 0 ? `${route}${offset}` : null,
//           next: offset > -1 && remaining > itemLimit ? `${route}${offset + 2}` : null,
//         }));
//     });
// };
