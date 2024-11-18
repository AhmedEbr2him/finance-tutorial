import { create } from 'zustand';

interface OpenTransactionsProps {
	id?: string;
	isOpen: boolean;
	onOpen: (id: string) => void;
	onClose: () => void;
}

export const useOpenTransactions = create<OpenTransactionsProps>(set => ({
	id: undefined,
	isOpen: false,
	onOpen: (id: string) => set({ isOpen: true, id }),
	onClose: () => set({ isOpen: false, id: undefined }),
}));
