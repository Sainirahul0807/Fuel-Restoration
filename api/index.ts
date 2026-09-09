import app from "../artifacts/api-server/src/app";

// Vercel's Node builder will call the default export with (req, res).
// We forward the request to the existing Express app so your existing routes work.

export default function handler(req: any, res: any) {
  return app(req, res as any);
}
