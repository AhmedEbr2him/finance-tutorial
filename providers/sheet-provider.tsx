'use client';

import { useMountedState } from 'react-use';

import { NewAccountSheet } from '@/features/accounts/components/new-account-sheet';

export const SheetProvider = () => {
	// Make provider can only called on client not client and server like use effect
	const isMounted = useMountedState();

	if (!isMounted) return null;

	return (
		<>
			<NewAccountSheet />
		</>
	);
};
