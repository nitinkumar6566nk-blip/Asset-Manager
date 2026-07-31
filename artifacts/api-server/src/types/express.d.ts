import type { Logger } from 'pino';

// Augment Express's Request type so pino-http's req.log is recognised by TypeScript.
declare global {
  namespace Express {
    interface Request {
      log: Logger;
    }
  }
}
