import { createLogger } from 'redux-logger';

let middlewares = [];
if (process.env.NODE_ENV === 'development') {
  const logger = createLogger({
    collapsed: true,
  });

  middlewares = [logger];
}

export default middlewares;
