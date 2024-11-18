import { create } from 'zustand';

interface NewTransactionProps {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const useNewTransaction = create<NewTransactionProps>(set => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));
