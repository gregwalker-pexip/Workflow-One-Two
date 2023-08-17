import pino, { type Logger } from 'pino';

export const getLogger = (name: string): Logger => {
  const logger = pino({
    name,
    level: 'info'
  });
  return logger;
};
