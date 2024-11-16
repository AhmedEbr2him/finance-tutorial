import { z } from 'zod';

import { useNewAccount } from '@/features/accounts/hooks/use-new-account';

import { insertAccountSchema } from '@/db/schema';

import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
	SheetDescription,
	SheetHeader,
} from '@/components/ui/sheet';
import { AccountForm } from '@/features/accounts/components/account-form';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';

const formSchema = insertAccountSchema.pick({
	name: true,
});

type FormValues = z.input<typeof formSchema>;

export const NewAccountSheet = () => {
	const { isOpen, onClose } = useNewAccount();

	const { mutate, isPending } = useCreateAccount();

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
					<SheetTitle>New account</SheetTitle>
					<SheetDescription>Create a new account to track your transactions.</SheetDescription>
				</SheetHeader>
				<AccountForm
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
