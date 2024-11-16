import { Hono } from 'hono';
import { zValidator } from '@hono/zod-validator';
import { createId } from '@paralleldrive/cuid2';

import { clerkMiddleware, getAuth } from '@hono/clerk-auth';

import { eq } from 'drizzle-orm';
import { db } from '@/db/drizzle';
import { accounts, insertAccountSchema } from '@/db/schema';
import { z } from 'zod';

const app = new Hono()
	.get(
		'/',

		clerkMiddleware(),
		async c => {
			const auth = getAuth(c);

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const data = await db
				.select({
					id: accounts.id,
					name: accounts.name,
				})
				.from(accounts)
				.where(eq(accounts.userId, auth.userId));

			return c.json({ data });
		}
	)
	.post(
		'/',

		clerkMiddleware(),
		zValidator(
			'json',
			insertAccountSchema.pick({
				name: true, // specific for frontend we don't need to pass any id to form
			})
		),

		async c => {
			const auth = getAuth(c);

			if (!auth?.userId) {
				return c.json({ error: 'Unauthorized' }, 401);
			}

			const values = c.req.valid('json');

			const [data] = await db
				.insert(accounts)
				.values({
					id: createId(),
					userId: auth.userId,
					...values,
				})
				.returning();

			return c.json({ data });
		}
	);

export default app;
