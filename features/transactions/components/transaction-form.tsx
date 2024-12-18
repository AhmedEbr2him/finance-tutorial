import { z } from 'zod';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { insertTransactionsSchema } from '@/db/schema';

import { convertAmountTomiliunits } from '@/lib/utils';

import { Select } from '@/components/select';
import { DatePicker } from "@/components/date-picker";
import { AmountInput } from '@/components/amout-input';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel
} from '@/components/ui/form';

// the reason we need form schema is amount we need to keep it as string here
const formSchema = z.object({
	date: z.coerce.date(),
	accountId: z.string(),
	categoryId: z.string().nullable().optional(),
	payee: z.string(),
	amount: z.string(),
	notes: z.string().nullable().optional(),
});

const apiSchema = insertTransactionsSchema.omit({
	id: true,
});

type FormValues = z.input<typeof formSchema>;
type ApiFormValues = z.input<typeof apiSchema>;

interface TransactionFormProps {
	id?: string;
	defaultValues?: FormValues;
	onSubmit: (values: ApiFormValues) => void;
	onDelete?: () => void;
	disabled?: boolean;
	accountOptions: { label: string, value: string }[];
	categoryOptions: { label: string, value: string }[];
	onCreateCategory: (name: string) => void;
	onCreateAccount: (name: string) => void;
}

export const TransactionForm = ({
	id,
	defaultValues,
	onSubmit,
	onDelete,
	disabled,
	onCreateAccount,
	accountOptions,
	onCreateCategory,
	categoryOptions
}: TransactionFormProps) => {

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues,
	});

	const handleSubmit = (values: FormValues) => {
		const amount = parseFloat(values.amount);
		const amountInMiliunits = convertAmountTomiliunits(amount);

		onSubmit({
			...values,
			amount: amountInMiliunits,
		});
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
					name='date'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormControl>
								<DatePicker
									value={field.value}
									onChange={field.onChange}
									disable={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					name='accountId'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Account</FormLabel>
							<FormControl>
								<Select
									placeholder='Select an account'
									options={accountOptions}
									onCreate={onCreateAccount}
									value={field.value}
									onChange={field.onChange}
									disabled={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name='categoryId'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Category</FormLabel>
							<FormControl>
								<Select
									placeholder='Select an cateogry'
									options={categoryOptions}
									onCreate={onCreateCategory}
									value={field.value}
									onChange={field.onChange}
									disabled={disabled}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name='payee'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>
								Payee
							</FormLabel>
							<FormControl>
								<Input
									disabled={disabled}
									placeholder='Add a payee'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>

				<FormField
					name='amount'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Amount</FormLabel>
							<FormControl>
								<AmountInput
									disabled={disabled}
									placeholder='0.00'
									{...field}
								/>
							</FormControl>
						</FormItem>
					)}
				/>


				<FormField
					name='notes'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Notes</FormLabel>
							<FormControl>
								<Textarea
									{...field}
									value={field.value || ''}
									disabled={disabled}
									placeholder='Optional notes'
								/>
							</FormControl>
						</FormItem>
					)}
				/>


				<Button
					className='w-full'
					disabled={disabled}>
					{id ? 'Save changes' : 'Create transaction'}
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
						Delete transaction
					</Button>
				)}
			</form>
		</Form>
	);
};
