type VercelRequest = {
  method?: string;
  query: Record<string, string | string[] | undefined>;
};

type VercelResponse = {
  setHeader(name: string, value: string): void;
  status(code: number): VercelResponse;
  json(body: unknown): VercelResponse;
  end(): VercelResponse;
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

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
