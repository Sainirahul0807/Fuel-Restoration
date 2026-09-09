import express, { type Express, type Request, type Response } from "express";
import cors from "cors";
import pinoHttpPkg from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

// pino-http's types can vary depending on module interop. Normalize the import
// so we can call it regardless of whether it's a default export or CommonJS.
const pinoHttp = (pinoHttpPkg as any)?.default ?? (pinoHttpPkg as any);

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      // Explicitly type parameters to avoid implicit any errors during TS compile.
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
