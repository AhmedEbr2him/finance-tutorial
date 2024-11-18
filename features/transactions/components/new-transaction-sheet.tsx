import { z } from 'zod';

import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';

import { insertTransactionsSchema } from '@/db/schema';

import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';

import { TransactionForm } from '@/features/transactions/components/transaction-form';


import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetDescription,
	SheetHeader,
} from '@/components/ui/sheet';
import { Loader2 } from 'lucide-react';

const formSchema = insertTransactionsSchema.omit({
	id: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewTransactionSheet = () => {
	const { isOpen, onClose } = useNewTransaction();

	const { mutate: createTransaction, isPending: isTransactionPending } = useCreateTransaction();
	const { mutate: createCategory, isPending: isCategoryPending } = useCreateCategory();
	const { mutate: createAccount, isPending: isAccountPending } = useCreateAccount();

	const { data: categories, isLoading: isCategoriesLoading } = useGetCategories();
	const { data: accounts, isLoading: isAccountsLoading } = useGetAccounts();

	const onCreateCategory = (name: string) => createCategory({ name });
	const categoryOptions = (categories ?? []).map((category) => ({
		label: category.name,
		value: category.id,
	}));

	const onCreateAccount = (name: string) => createAccount({ name });
	const accountOptions = (accounts ?? []).map((account) => ({
		label: account.name,
		value: account.id,
	}));

	const isPending = isTransactionPending || isCategoryPending || isAccountPending;

	const isLoading = isCategoriesLoading || isAccountsLoading;


	const onSubmit = (values: FormValues) => {
		createTransaction(values, {
			onSuccess: () => {
				onClose();
			},
		});
	};

	return (
		<Sheet
			open={isOpen}
			onOpenChange={onClose}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>New Transaction</SheetTitle>
					<SheetDescription>Add a new transaction</SheetDescription>
				</SheetHeader>
				{
					isLoading
						?
						(
							<div className='absolute inset-0 flex items-center justify-center'>
								<Loader2
									className="size-4 text-muted-foreground animate-spin"
								/>
							</div>
						)
						:
						(
							<TransactionForm
								onSubmit={onSubmit}
								disabled={isPending}
								categoryOptions={categoryOptions}
								onCreateCategory={onCreateCategory}
								accountOptions={accountOptions}
								onCreateAccount={onCreateAccount}
							/>
						)
				}

			</SheetContent>
		</Sheet>
	);
};
