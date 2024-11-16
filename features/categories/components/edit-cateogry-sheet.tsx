import { z } from 'zod';

import { Loader2 } from 'lucide-react';

import { useOpenCategory } from '@/features/categories/hooks/use-open-category';

import { CategoryForm } from '@/features/categories/components/category-form';

import {   insertCategoriesSchema } from '@/db/schema';
import { useGetCategory } from '@/features/categories/api/use-get-category';
import { useEditCategory } from '@/features/categories/api/use-edit-category';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';

import { useConfirm } from '@/hooks/use-confirm';

import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
	SheetDescription,
	SheetHeader,
} from '@/components/ui/sheet';

const formSchema = insertCategoriesSchema.pick({
	name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditCategorySheet = () => {
	const { isOpen, onClose, id } = useOpenCategory();

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure to delete this cateogry?',
		'You are about to delete this category?, this action can not be undone.'
	);

	const { data: category, isLoading: isCategoryLoading } = useGetCategory(id);
	const { mutate: editCateogry, isPending: isEditingCategoryPending } = useEditCategory(id);
	const { mutate: deleteCategory, isPending: isDeletingCategoryPending } = useDeleteCategory(id);
	
	const isPending = isEditingCategoryPending || isDeletingCategoryPending;

	const onSubmit = (values: FormValues) => {
			editCateogry(values, {
				onSuccess: () => {
				onClose();
			},
		});
	};

	const onDelete = async () => {
		const ok = await confirm();

		if (!ok) return null;

		deleteCategory(undefined, {
			onSuccess: () => {
				onClose();
			}
		});
	}

	const defaultValues = category ? { name: category.name } : { name: '' };

	return (
		<>
		<ConfirmDialog/>
		<Sheet
			open={isOpen}
			onOpenChange={onClose}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit category</SheetTitle>
					<SheetDescription>Edit an existing category.</SheetDescription>
				</SheetHeader>
				{isCategoryLoading ? (
					<div className='absolute inset-0 flex items-center justify-center'>
						<Loader2 className='size-4 text-muted-foreground animate-spin' />
					</div>
				) : (
					<CategoryForm
						id={id}
						onSubmit={onSubmit}
						disabled={isPending}
						defaultValues={defaultValues}
						onDelete={onDelete}
					/>
				)}
			</SheetContent>
			</Sheet>
			</>
	);
};
