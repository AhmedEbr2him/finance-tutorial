import { z } from 'zod';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { insertAccountSchema } from '@/db/schema';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';

const formSchema = insertAccountSchema.pick({
	name: true,
});

type FormValues = z.input<typeof formSchema>;

interface AccountFormProps {
	id?: string;
	defaultValues?: FormValues;
	onSubmit: (values: FormValues) => void;
	onDelete?: () => void;
	disabled?: boolean;
}

export const AccountForm = ({
	id,
	defaultValues,
	onSubmit,
	onDelete,
	disabled,
}: AccountFormProps) => {
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
									placeholder='e.g. Cash, Bank, Credit Card'
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
					{id ? 'Save changes' : 'Create account'}
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
						Delete account
					</Button>
				)}
			</form>
		</Form>
	);
};
