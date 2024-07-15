import pino from 'pino';
import { getDate_yyyymmdd, getDate_yyyymmddhhmmss } from './utils';

const date = new Date();


const fileTransport = pino.transport({
    target: 'pino/file',
    options: { 
        destination: `${__dirname}/logs/app_${getDate_yyyymmdd(date)}.log`,
        mkdir: true,
        translateTime: 'UTC:yyyy-mm-dd HH:MM:ss.l o',
    },
  });

export const logger =  pino({
    level: process.env.PINO_LOG_LEVEL || 'info',
    formatters: {
      level: (label) => {
        return { level: label.toUpperCase() };
      },
    },
    timestamp: () => `,"time":"${getDate_yyyymmddhhmmss(date)}"`
   // timestamp: pino.stdTimeFunctions.isoTime,
  },
  fileTransport
);


console.log(getDate_yyyymmddhhmmss(date))

// https://betterstack.com/community/guides/logging/how-to-install-setup-and-use-pino-to-log-node-js-applications/