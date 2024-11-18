import { z } from 'zod';
import { Hono } from 'hono';
import { parse, subDays } from "date-fns";

import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';

import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { db } from '@/db/drizzle';
import { and, desc, eq, gte, inArray, lte, sql } from 'drizzle-orm';
import {
	transactions,
	categories,
	accounts,
	insertTransactionsSchema
} from '@/db/schema';

const app = new Hono()
	.get(
		'/',
		// Filter transactions
		zValidator("query", z.object({
			from: z.string().optional(),
			to: z.string().optional(),
			accountId: z.string().optional(),
		})),
		clerkMiddleware(),
		async c => {
			const auth = getAuth(c);
			const { from, to, accountId } = c.req.valid("query");

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			// In case we do not have any filters from and to we do not need to load entire of transactions because this will be huge of data
			// load last 30 days transactions only if there is no any filter of transactions
			const defaultTo = new Date();
			const defaultFrom = subDays(defaultTo, 30);

			const startDate = from
				? parse(from, "yyyy-MM-dd", new Date())
				: defaultFrom;

			const endDate = to
				? parse(to, "yyyy-MM-dd", new Date())
				: defaultTo;


			const data = await db
				.select({
					id: transactions.id,
					accountId: transactions.accountId,
					account: accounts.name,
					categoryId: transactions.categoryId,
					category: categories.name,
					date: transactions.date,
					payee: transactions.payee,
					amount: transactions.amount,
					notes: transactions.notes,
				})
				.from(transactions)
				.innerJoin(accounts, eq(transactions.accountId, accounts.id)) // ensuring all transactions have an account
				.leftJoin(categories, eq(transactions.categoryId, categories.id)) // optional
				.where(
					and(
						accountId ? eq(transactions.accountId, accountId) : undefined,
						eq(accounts.userId, auth.userId),
						gte(transactions.date, startDate),
						lte(transactions.date, endDate),
					)
				)
				.orderBy(desc(transactions.date));

			return c.json({ data });
		}
	)
	.get(
		'/:id',
		zValidator(
			'param',
			z.object({
				id: z.string().optional(),
			})
		),
		clerkMiddleware(),

		async c => {
			const auth = getAuth(c);
			const { id } = c.req.valid('param');

			if (!id) {
				return c.json({ error: 'Missing id' }, 400);
			}

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const [data] = await db
				.select({
					id: transactions.id,
					accountId: transactions.accountId,
					categoryId: transactions.categoryId,
					date: transactions.date,
					payee: transactions.payee,
					amount: transactions.amount,
					notes: transactions.notes,
				})
				.from(transactions)
				.innerJoin(accounts, eq(transactions.accountId, accounts.id))
				.where(
					and(
						eq(transactions.id, id),
						eq(accounts.userId, auth.userId)
					)
				);

			if (!data) {
				return c.json({ error: 'Not found' }, 404);
			}

			return c.json({ data });
		}
	)
	.post(
		'/',
		clerkMiddleware(),
		zValidator(
			'json',
			insertTransactionsSchema.omit({
				id: true,
			})
		),
		async c => {
			const auth = getAuth(c);

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const values = c.req.valid('json');

			const [data] = await db
				.insert(transactions)
				.values({
					id: createId(),
					...values,
				})
				.returning();

			return c.json({ data });
		}
	)
	.post(
		"/bulk-create",
		clerkMiddleware(),
		zValidator("json",
			z.array(
				insertTransactionsSchema.omit({
					id: true,
				})
			)
		),

		async c => {
			const auth = getAuth(c);
			const values = c.req.valid("json");

			if (!auth?.userId) {
				return c.json({ error: "Unauthorized" }, 401);
			};

			const data = await db
				.insert(transactions)
				.values(
					values.map((value) => ({
						id: createId(),
						...value
					}))
				)
				.returning();

			return c.json({ data });

		}
	)
	.post(
		'/bulk-delete',

		clerkMiddleware(),

		zValidator('json', z.object({ ids: z.array(z.string()) })),

		async c => {
			const auth = getAuth(c);
			const values = c.req.valid('json');

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const transactionsToDelete = db.$with("transactions_to_delete").as(
				db.select({ id: transactions.id })
					.from(transactions)
					.innerJoin(accounts, eq(transactions.accountId, accounts.id)) // join all the accounts width transactions that have accounts
					.where(
						and(
							inArray(transactions.id, values.ids),
							eq(accounts.userId, auth.userId)
						)
					)
			);

			const data = await db
				.with(transactionsToDelete)
				.delete(transactions)
				.where(
					inArray(transactions.id, sql`(select id from ${transactionsToDelete})`)
				)
				.returning({
					id: transactions.id
				});


			return c.json({ data });
		}
	)
	.patch(
		'/:id',
		clerkMiddleware(),

		zValidator(
			'param',
			z.object({
				id: z.string().optional(),
			})
		),
		zValidator(
			'json',
			insertTransactionsSchema.omit({
				id: true,
			})
		),

		async c => {
			const auth = getAuth(c);

			const { id } = c.req.valid('param');
			const values = c.req.valid('json');

			if (!id) {
				return c.json({ error: 'Missing id' }, 400);
			}

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const transactionsToUpdate = db.$with("transactions_to_update").as(
				db.select({ id: transactions.id })
					.from(transactions)
					.innerJoin(accounts, eq(transactions.accountId, accounts.id)) // join all the accounts width transactions that have accounts
					.where(
						and(
							eq(transactions.id, id),
							eq(accounts.userId, auth.userId)
						)
					)
			);

			const [data] = await db
				.with(transactionsToUpdate)
				.update(transactions)
				.set(values)
				.where(
					inArray(transactions.id, sql`(select id from ${transactionsToUpdate})`)
				)
				.returning();




			if (!data) {
				return c.json({ error: 'Not found' }, 404);
			}

			return c.json({ data });
		}
	)
	.delete(
		'/:id',
		clerkMiddleware(),

		zValidator(
			'param',
			z.object({
				id: z.string().optional(),
			})
		),

		async c => {
			const auth = getAuth(c);

			const { id } = c.req.valid('param');


			if (!id) {
				return c.json({ error: 'Missing id' }, 400);
			}

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const transactionsToDelete = db.$with("transactions_to_delete").as(
				db.select({ id: transactions.id })
					.from(transactions)
					.innerJoin(accounts, eq(transactions.accountId, accounts.id)) // join all the accounts width transactions that have accounts
					.where(
						and(
							eq(transactions.id, id),
							eq(accounts.userId, auth.userId)
						)
					)
			);

			const [data] = await db
				.with(transactionsToDelete)
				.delete(transactions)
				.where(
					inArray(
						transactions.id,
						sql`(select id from ${transactionsToDelete})`
					)
				)
				.returning({
					id: transactions.id
				});

			if (!data) {
				return c.json({ error: 'Not found' }, 404);
			}

			return c.json({ data });
		}
	);

export default app;
