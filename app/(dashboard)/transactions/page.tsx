'use client';

import { Loader2, PlusIcon } from 'lucide-react';

import { transactions as transactionsSchema } from "@/db/schema";

import toast from 'react-hot-toast';
import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions';

import { columns } from './columns';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Suspense, useState } from 'react';
import { UploadButton } from './upload-button';
import { ImportCard } from './import-card';
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account';

enum VARIANTS {
	LIST = "LIST",
	IMPORT = "IMPORT"
};

const INITIAL_IMPORT_RESULT = {
	data: [],
	errors: [],
	meta: [],
};

const TransactionsPage = () => {
	const [AccountDialog, confirm] = useSelectAccount();
	const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
	const [importResults, setImportResults] = useState(INITIAL_IMPORT_RESULT);

	const onUpload = (results: typeof INITIAL_IMPORT_RESULT) => {
		console.log(results);

		setImportResults(results);
		setVariant(VARIANTS.IMPORT);
	};

	const onCancelImport = () => {
		setImportResults(INITIAL_IMPORT_RESULT);
		setVariant(VARIANTS.LIST);
	}

	const newTransaction = useNewTransaction();
	const { data: transactions, isLoading: transactionsLoading } = useGetTransactions();
	const { mutate: deleteTransactions, isPending: deleteTransactionsPending } = useBulkDeleteTransactions();
	const { mutate: createBulkTransactions } = useBulkCreateTransactions();

	const isDisabled = transactionsLoading || deleteTransactionsPending;

	const onSubmitImport = async (
		values: typeof transactionsSchema.$inferInsert[]
	) => {
		const accountId = await confirm();

		if (!accountId) {
			return toast.error("Please select an account to continue")
		}

		const data = values.map((value) => ({
			...value,
			accountId: accountId as string,
		}));

		createBulkTransactions(data, {
			onSuccess: () => {
				onCancelImport();
			}
		});

	}
	if (transactionsLoading) {
		return (
			<Card className='border-none drop-shadow-none'>
				<CardHeader>
					<Skeleton className='h-8 w-48' />
				</CardHeader>
				<CardContent className='h-[500px] w-full flex items-center justify-center'>
					<Loader2 className='size-6 text-slate-300 animate-spin' />
				</CardContent>
			</Card>
		);
	};

	if (variant === VARIANTS.IMPORT) {
		return (
			<>
				<AccountDialog />
				<ImportCard
					data={importResults.data}
					onCancel={onCancelImport}
					onSubmit={onSubmitImport}
				/>
			</>
		)
	}
	return (
		<div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
			<Card className='border-none drop-shadow-none'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='text-xl line-clamp-1'>Transactions History</CardTitle>
					<div className='flex flex-col gap-y-2 lg:flex-row items-center gap-x-2'>
						<Button
							size='sm'
							onClick={newTransaction.onOpen}
							className='w-full lg:w-auto'
						>
							<PlusIcon className='size-4 mr-2' />
							Add new
						</Button>
						<UploadButton onUpload={onUpload} />
					</div>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={transactions || []}
						filterKey='payee'
						onDelete={row => {
							const ids = row.map(r => r.original.id);
							deleteTransactions({ ids });
						}}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

export default TransactionsPage;
