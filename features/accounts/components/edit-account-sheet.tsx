import { z } from 'zod';

import { Loader2 } from 'lucide-react';

import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
import { AccountForm } from '@/features/accounts/components/account-form';

import { insertAccountSchema } from '@/db/schema';
import { useGetAccount } from '@/features/accounts/api/use-get-account';
import { useEditAccount } from '@/features/accounts/api/use-edit-account';
import { useDeleteAccount } from '@/features/accounts/api/use-delete-account';

import { useConfirm } from '@/hooks/use-confirm';

import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetTrigger,
	SheetDescription,
	SheetHeader,
} from '@/components/ui/sheet';

const formSchema = insertAccountSchema.pick({
	name: true,
});

type FormValues = z.input<typeof formSchema>;

export const EditAccountSheet = () => {
	const { isOpen, onClose, id } = useOpenAccount();

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure to delete this account?',
		'You are about to delete this account?, this action can not be undone'
	);

	const { data: account, isLoading: isAccountLoading } = useGetAccount(id);
	const { mutate: editAccount, isPending: isEditingAccountPending } = useEditAccount(id);
	const { mutate: deleteAccount, isPending: isDeletingAccountPending } = useDeleteAccount(id);
	
	const isPending = isEditingAccountPending || isDeletingAccountPending;

	const onSubmit = (values: FormValues) => {
			editAccount(values, {
				onSuccess: () => {
				onClose();
			},
		});
	};

	const onDelete = async () => {
		const ok = await confirm();

		if (!ok) return null;

		deleteAccount(undefined, {
			onSuccess: () => {
				onClose();
			}
		});
	}

 
 

	const defaultValues = account ? { name: account.name } : { name: '' };

	return (
		<>
		<ConfirmDialog/>
		<Sheet
			open={isOpen}
			onOpenChange={onClose}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit account</SheetTitle>
					<SheetDescription>Edit an existing account.</SheetDescription>
				</SheetHeader>
				{isAccountLoading ? (
					<div className='absolute inset-0 flex items-center justify-center'>
						<Loader2 className='size-4 text-muted-foreground animate-spin' />
					</div>
				) : (
					<AccountForm
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
