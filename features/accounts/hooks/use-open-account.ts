import { create } from 'zustand';

interface NewAccountProps {
	id?: string;
	isOpen: boolean;
	onOpen: (id: string) => void;
	onClose: () => void;
}

export const useOpenAccount = create<NewAccountProps>(set => ({
	id: undefined,
	isOpen: false,
	onOpen: (id: string) => set({ isOpen: true, id }),
	onClose: () => set({ isOpen: false, id: undefined }),
}));
