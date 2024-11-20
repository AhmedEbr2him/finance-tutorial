import { Hono } from 'hono';
import { handle } from 'hono/vercel';
import accounts from '@/features/accounts/server/route';
import categories from "@/features/categories/server/route";
import transactions from "@/features/transactions/server/route";
import summary from "@/features/summary/server/route";

export const runtime = 'edge';

const app = new Hono().basePath('/api');

const routes = app
  .route("/summary", summary)
  .route('/accounts', accounts)
  .route("/categories", categories)
  .route("/transactions", transactions)

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);

export type AppType = typeof routes;
