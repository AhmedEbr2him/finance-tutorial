import { z } from 'zod';

import {useNewCategory  } from '@/features/categories/hooks/use-new-category';

import { insertCategoriesSchema } from '@/db/schema';

import { useCreateCategory } from '@/features/categories/api/use-create-category';

import { CategoryForm } from './category-form';
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

export const NewCategorySheet = () => {
	const { isOpen, onClose } = useNewCategory();

	const { mutate, isPending } = useCreateCategory();

	const onSubmit = (values: FormValues) => {
		mutate(values, {
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
					<SheetTitle>New category</SheetTitle>
					<SheetDescription>Create a new category to organize your transactions.</SheetDescription>
				</SheetHeader>
				<CategoryForm
					onSubmit={onSubmit}
					disabled={isPending}
					defaultValues={{
						name: '',
					}}
				/>
			</SheetContent>
		</Sheet>
	);
};
