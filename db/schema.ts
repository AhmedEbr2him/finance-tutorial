import { z } from "zod";
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';

import { relations } from "drizzle-orm";

import {
	integer,
	pgTable,
	text,
	timestamp
} from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
	id: text('id').primaryKey(),
	plaidId: text('plaid_id'),
	name: text('name').notNull(),
	userId: text('user_Id').notNull(),
});

export const insertAccountSchema = createSelectSchema(accounts);

export const accountRelations = relations(accounts, ({ many }) => ({
	transactions: many(transactions), // One account can have many transactions
}));

export const categories = pgTable('categories', {
	id: text('id').primaryKey(),
	plaidId: text('plaid_id'),
	name: text('name').notNull(),
	userId: text('user_Id').notNull(),
});

export const insertCategoriesSchema = createSelectSchema(categories);

export const categoriesRelations = relations(categories, ({ many }) => ({
	transactions: many(transactions), // One account can have many transactions
}));



/* 
	* Why we using integers of the smallest unit of the currency?
	- We are going to use miliunits to support 3 decimals 
	- 10.50 => 10500
	- cross-language compatible	
*/
export const transactions = pgTable("transactions", {
	id: text('id').primaryKey(),
	amount: integer("amount").notNull(),
	payee: text("payee").notNull(), // ATM 
	notes: text("notes"),
	date: timestamp("date", { mode: "date" }).notNull(), // we are not gone to set any default values because user will enter they themself transactions happen in the future or happened in the past.

	// make relations with same user
	accountId: text("account_id").references(() => accounts.id, {
		onDelete: "cascade", // when delete account delete transactions also
	}).notNull(),
	categoryId: text("category_id").references(() => categories.id, {
		onDelete: "set null",
	})
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
	// each transactions can only have one account 'one to many transactions'
	account: one(accounts, {
		fields: [transactions.accountId],
		references: [accounts.id]
	}),
	categories: one(categories, {
		fields: [transactions.categoryId],
		references: [categories.id]
	}),
}));

export const insertTransactionsSchema = createInsertSchema(transactions, {
	date: z.coerce.date(),
})