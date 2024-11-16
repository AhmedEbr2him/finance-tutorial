import { z } from 'zod';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { insertCategoriesSchema } from '@/db/schema';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const formSchema = insertCategoriesSchema.pick({
	name: true,
});

type FormValues = z.input<typeof formSchema>;

interface CategoryFormProps {
	id?: string;
	defaultValues?: FormValues;
	onSubmit: (values: FormValues) => void;
	onDelete?: () => void;
	disabled?: boolean;
}

export const CategoryForm = ({
	id,
	defaultValues,
	onSubmit,
	onDelete,
	disabled,
}: CategoryFormProps) => {
	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues,
	});

	const handleSubmit = (values: FormValues) => {
		onSubmit(values);
	};

	const handleDelete = () => {
		onDelete?.();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handleSubmit)}
				className='space-y-2 pt-4'>
				<FormField
					name='name'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input
									disabled={disabled}
									placeholder='e.g. Food, Travel, Sport, etc.'
									required
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<Button
					className='w-full'
					disabled={disabled}>
					{id ? 'Save changes' : 'Create category'}
				</Button>

				{/*!! => turn "id" like boolean */}
				{!!id && (
					<Button
						type='button'
						disabled={disabled}
						variant='outline'
						size='default'
						onClick={handleDelete}
						className='w-full hover:bg-red-600 hover:text-white'>
						<Trash className='size-4 mr-2' />
						Delete category
					</Button>
				)}
			</form>
		</Form>
	);
};
