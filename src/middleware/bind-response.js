'use strict';

export default (request, response, next) => {
  response.send = response.send.bind(response);
  response.json = response.json.bind(response);
  response.status = response.status.bind(response);
  response.sendFile = response.sendFile.bind(response);
  response.sendStatus = response.sendStatus.bind(response);
  next();
};
