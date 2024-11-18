'use client';

import { useMountedState } from 'react-use';

import { NewAccountSheet } from '@/features/accounts/components/new-account-sheet';
import { EditAccountSheet } from '@/features/accounts/components/edit-account-sheet';
import { NewCategorySheet } from '@/features/categories/components/new-category-sheet';
import { EditCategorySheet } from '@/features/categories/components/edit-cateogry-sheet';
import { NewTransactionSheet } from '@/features/transactions/components/new-transaction-sheet';
import { EditTransactionsSheet } from '@/features/transactions/components/edit-transactions-sheet';

export const SheetProvider = () => {
	// Make provider can only called on client not client and server like use effect
	const isMounted = useMountedState();

	if (!isMounted) return null;

	return (
		<>
			<NewAccountSheet />
			<EditAccountSheet />

			<NewCategorySheet />
			<EditCategorySheet />

			<NewTransactionSheet />
			<EditTransactionsSheet />
		</>
	);
};
