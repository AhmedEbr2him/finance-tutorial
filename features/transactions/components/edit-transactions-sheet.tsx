import { z } from 'zod';

import { Loader2 } from 'lucide-react';

import { useOpenTransactions } from '@/features/transactions/hooks/use-open-transaction';

import { insertTransactionsSchema } from '@/db/schema';
import { useGetTransaction } from '@/features/transactions/api/use-get-transaction';
import { useEditTransaction } from '@/features/transactions/api/use-edit-transaction';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
import { useCreateTransaction } from '@/features/transactions/api/use-create-transaction';
import { useCreateCategory } from '@/features/categories/api/use-create-category';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';

import { useConfirm } from '@/hooks/use-confirm';

import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
	SheetDescription,
	SheetHeader,
} from '@/components/ui/sheet';
import { TransactionForm } from './transaction-form';
import { converAmountFromMiliunits } from '@/lib/utils';

const formSchema = insertTransactionsSchema.omit({
	id: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditTransactionsSheet = () => {
	const { isOpen, onClose, id } = useOpenTransactions();

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure to delete this cateogry?',
		'You are about to delete this transaction?, this action can not be undone.'
	);

	const { data: transaction, isLoading: isTransactionLoading } = useGetTransaction(id);
	const { mutate: editTransaction, isPending: isEditingTransactionPending } = useEditTransaction(id);
	const { mutate: deleteTransaction, isPending: isDeletingTransactionPending } = useDeleteTransaction(id);



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

	const isPending =
		isEditingTransactionPending ||
		isDeletingTransactionPending ||
		isTransactionLoading ||
		isTransactionPending ||
		isCategoryPending ||
		isAccountPending;

	const isLoading =
		isCategoriesLoading ||
		isCategoriesLoading ||
		isAccountsLoading;

	const onSubmit = (values: FormValues) => {
		editTransaction(values, {
			onSuccess: () => {
				onClose();
			},
		});
	};

	const onDelete = async () => {
		const ok = await confirm();

		if (!ok) return null;

		deleteTransaction(undefined, {
			onSuccess: () => {
				onClose();
			}
		});
	}

	const defaultValues = transaction
		? {
			accountId: transaction.accountId,
			categoryId: transaction.categoryId,
			date: transaction.date
				? new Date(transaction.date)
				: new Date,
			amount: transaction.amount.toString(),
			payee: transaction.payee,
			notes: transaction.notes,
		} :
		{
			accountId: '',
			categoryId: '',
			date: new Date(),
			amount: '',
			payee: '',
			notes: '',
		};

	return (
		<>
			<ConfirmDialog />
			<Sheet
				open={isOpen}
				onOpenChange={onClose}>
				<SheetContent className='space-y-4'>
					<SheetHeader>
						<SheetTitle>Edit Transaction</SheetTitle>
						<SheetDescription>Edit an existing transaction.</SheetDescription>
					</SheetHeader>
					{isTransactionLoading ? (
						<div className='absolute inset-0 flex items-center justify-center'>
							<Loader2 className='size-4 text-muted-foreground animate-spin' />
						</div>
					) : (
						<TransactionForm
							id={id}
							defaultValues={defaultValues}
							onSubmit={onSubmit}
							onDelete={onDelete}
							disabled={isPending}
							categoryOptions={categoryOptions}
							onCreateCategory={onCreateCategory}
							accountOptions={accountOptions}
							onCreateAccount={onCreateAccount}
						/>
					)}
				</SheetContent>
			</Sheet>
		</>
	);
};
