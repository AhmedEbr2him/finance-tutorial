'use client';

import { Loader2, PlusIcon } from 'lucide-react';

import { useNewCategory } from '@/features/categories/hooks/use-new-category';

import { useGetCategories } from '@/features/categories/api/use-get-categories';

import { useBulkDeleteCategories } from '@/features/categories/api/use-bulk-delete-categories';

import { columns } from './columns';

import { DataTable } from '@/components/data-table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CategoriesPage = () => {
	const newCategory = useNewCategory();
	const { data: categories, isLoading: categoriesLoading } = useGetCategories();
	const { mutate: deleteCategories, isPending: deleteCategoriesPending } = useBulkDeleteCategories();

	const isDisabled = deleteCategoriesPending || categoriesLoading;

	if (categoriesLoading) {
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
					<CardTitle className='text-xl line-clamp-1'>Categories Page</CardTitle>
					<Button
						size='sm'
						onClick={newCategory.onOpen}>
						<PlusIcon className='size-4 mr-2' />
						Add new
					</Button>
				</CardHeader>
				<CardContent>
					<DataTable
						columns={columns}
						data={categories || []}
						filterKey='name'
						onDelete={row => {
							const ids = row.map(r => r.original.id);
							deleteCategories({ ids });
						}}
						disabled={isDisabled}
					/>
				</CardContent>
			</Card>
		</div>
	);
};

export default CategoriesPage;
