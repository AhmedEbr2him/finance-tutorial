import { create } from 'zustand';

interface NewCategoryProps {
	isOpen: boolean;
	onOpen: () => void;
	onClose: () => void;
}

export const useNewCategory = create<NewCategoryProps>(set => ({
	isOpen: false,
	onOpen: () => set({ isOpen: true }),
	onClose: () => set({ isOpen: false }),
}));
