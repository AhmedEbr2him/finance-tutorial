import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';

import { useGetAccounts } from '@/features/accounts/api/use-get-accounts';
import { useCreateAccount } from '@/features/accounts/api/use-create-account';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogFooter,
} from '@/components/ui/dialog';
import { Select } from '@/components/select';

export const useSelectAccount = ():
	[() => JSX.Element, () => Promise<unknown>] => {
	const { data: accounts, isLoading: accountsIsLoading } = useGetAccounts();
	const { mutate: createAccount, isPending: createAccountIsPending } = useCreateAccount();

	const onCreateAccount = (name: string) => createAccount({ name });

	const accountOptions = (accounts ?? []).map((account) => ({
		label: account.name,
		value: account.id,
	}));

	const [promise, setPromise] = useState<{
		resolve: (value: string | undefined) => void
	} | null>(null);

	// We use ref instead of using state beacuse  changing the state causes this hook
	// to rerender which it cause the flashing effect over this dialog
	const selectValue = useRef<string>();

	const confirm = () =>
		new Promise(resolve => {
			setPromise({ resolve });
		});

	const handleClose = () => {
		setPromise(null);
	};

	const handleConfirm = () => {
		promise?.resolve(selectValue.current);
		handleClose();
	};

	const handleCancel = () => {
		promise?.resolve(undefined);
		handleClose();
	};

	const ConfirmDialog = () => (
		<Dialog
			open={promise !== null}
			onOpenChange={handleClose}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>
						Select Account
					</DialogTitle>
					<DialogDescription>
						Please select an account to continue
					</DialogDescription>
				</DialogHeader>

				<Select
					placeholder='Select an account'
					options={accountOptions}
					onCreate={onCreateAccount}
					onChange={(value) => selectValue.current = value}
					disabled={accountsIsLoading || createAccountIsPending}
				/>
				<DialogFooter className='pt-2 flex flex-col gap-y-2'>
					<Button
						variant='outline'
						onClick={handleCancel}>
						Cancel
					</Button>
					<Button onClick={handleConfirm}>Confirm</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);

	return [ConfirmDialog, confirm];
};
