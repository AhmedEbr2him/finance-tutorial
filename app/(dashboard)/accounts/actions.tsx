'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteAccount } from '@/features/accounts/api/use-delete-account';
import { useOpenAccount } from '@/features/accounts/hooks/use-open-account';
import { useConfirm } from '@/hooks/use-confirm';
import { EditIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react';

type ActionsProps = {
	id: string;
};

export const Actions = ({ id }: ActionsProps) => {
	const { onOpen } = useOpenAccount();

	const [ ConfirmDialog,confirm ] = useConfirm('Are you sure to delete this account?','You are about to delete this transaction');

	const { mutate: deleteAccount } = useDeleteAccount(id);

	const handleDelete = async () => {
		const ok = await confirm();

		if (!ok) return null;

		deleteAccount();
	}
	return (
		<>
		<ConfirmDialog/>
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					className='size-8 p-0'>
					<MoreHorizontalIcon className='size-4' />
				</Button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align='end'>
				<DropdownMenuItem
					disabled={false}
					onClick={() => onOpen(id)}
					className='cursor-pointer'>
					<EditIcon className='size-4 mr-2' />
					Edit
				</DropdownMenuItem>
				<DropdownMenuItem
					disabled={false}
					onClick={handleDelete}
					className='cursor-pointer'>
					<TrashIcon className='size-4 mr-2' />
					Delete
				</DropdownMenuItem>
			</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};
