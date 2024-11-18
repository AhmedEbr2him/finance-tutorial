'use client';

import { Loader2, PlusIcon } from 'lucide-react';

import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';

import { columns } from './columns';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TransactionsPage = () => {
	const newAccount = useNewTransaction();
	const { data: transactions, isLoading: transactionsLoading } = useGetTransactions();
	const { mutate: deleteTransactions, isPending: deleteTransactionsPending } = useBulkDeleteTransactions();

	const isDisabled = transactionsLoading || deleteTransactionsPending;

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
	}
	return (
		<div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
			<Card className='border-none drop-shadow-none'>
				<CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
					<CardTitle className='text-xl line-clamp-1'>Transactions History</CardTitle>
					<Button
						size='sm'
						onClick={newAccount.onOpen}>
						<PlusIcon className='size-4 mr-2' />
						Add new
					</Button>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={transactions || []}
						filterKey='name'
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
