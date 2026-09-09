This branch contains deployment helpers for Vercel.

What changed
- vercel.json: instructs Vercel to build TypeScript serverless functions under /api using @vercel/node and routes /api/* to /api/index.ts.
- api/index.ts: a thin serverless wrapper that forwards Vercel requests to the existing Express app (artifacts/api-server/src/app.ts). This avoids running a persistent server (app.listen) on Vercel.

How to redeploy on Vercel
1. In your Vercel project settings ensure the root is set to the repository root.
2. Ensure Vercel uses pnpm (the repo includes pnpm-lock.yaml). If Vercel does not auto-detect, set the "Install Command" to "pnpm install".
3. Trigger a deploy (use the vercel-deploy-fix branch or merge these changes to the branch you use for deployments).

Notes
- The wrapper imports TypeScript source from artifacts/; Vercel's @vercel/node builder bundles TypeScript with esbuild which will compile these files. If you see bundling errors, I can switch to compiling a dist build or producing CommonJS output.
- The previous entrypoint (artifacts/api-server/src/index.ts) calls `app.listen` and expects a PORT env var for a long-running server. That file is kept for local development but is not used by Vercel serverless functions.
- If you prefer to run a persistent Node server instead of serverless functions, consider deploying to Render/Railway/Heroku and I can add a Dockerfile or Procfile.
