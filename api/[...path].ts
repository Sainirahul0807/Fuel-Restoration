import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    return res.status(204).end();
  }

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store');

  const path = Array.isArray(req.query.path)
    ? req.query.path.join('/')
    : String(req.query.path ?? '');

  if (req.method === 'GET' && (path === '' || path === 'healthz' || path === 'health')) {
    return res.status(200).json({
      status: 'ok',
      service: 'fuel-restoration-api',
      timestamp: new Date().toISOString(),
    });
  }

  return res.status(404).json({
    error: 'Not Found',
    path: `/api/${path}`,
  });
}
