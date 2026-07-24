import { authRouter } from "./auth-router";
import { desaRouter } from "./desa-router";
import { createRouter, publicQuery } from "./middleware";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  desa: desaRouter,
});

export type AppRouter = typeof appRouter;
