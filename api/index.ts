/**
 * Vercel serverless entry-point for the API server.
 * Vercel invokes this file for every request matched by the
 * `/api/(.*)` rewrite in vercel.json and passes the raw
 * IncomingMessage / ServerResponse to the Express app.
 */
import app from '../artifacts/api-server/src/app';

export default app;
