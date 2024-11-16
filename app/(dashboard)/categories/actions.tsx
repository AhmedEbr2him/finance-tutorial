'use client';

import { Button } from '@/components/ui/button';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useDeleteCategory } from '@/features/categories/api/use-delete-category';
import { useOpenCategory } from '@/features/categories/hooks/use-open-category';
import { useConfirm } from '@/hooks/use-confirm';
import { EditIcon, MoreHorizontalIcon, TrashIcon } from 'lucide-react';

type ActionsProps = {
	id: string;
};

export const Actions = ({ id }: ActionsProps) => {
	const { onOpen } = useOpenCategory();

	const [ConfirmDialog, confirm] = useConfirm(
		'Are you sure to delete this category?',
		'You are about to delete this category, This action can not be undone.'
	);

	const { mutate: deleteCategory } = useDeleteCategory(id);

	const handleDelete = async () => {
		const ok = await confirm();

		if (!ok) return null;

		deleteCategory();
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
