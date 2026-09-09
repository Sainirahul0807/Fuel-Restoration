import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttpPkg from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

// Normalize pino-http import so it works whether it's a default ESM export or CommonJS.
const pinoHttp = (pinoHttpPkg as any)?.default ?? (pinoHttpPkg as any);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      // Explicitly typed serializer params to avoid implicit any errors
      req: (req: Request & { id?: string }) => ({
        id: (req as any).id,
        method: req.method,
        url: req.url?.split("?")[0],
      }),
      res: (res: Response) => ({
        statusCode: res.statusCode,
      }),
    },
  }),
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", router);

export default app;
