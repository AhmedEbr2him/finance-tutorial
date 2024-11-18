import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import toast from 'react-hot-toast';

type ResponseType = InferResponseType<typeof client.api.accounts[':id']['$delete']>;

export const useDeleteAccount = (id?: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error>({
		// JSON => WHAT WE ARE GOING TO SEND FROM OUR FORM 'TYPE SAFTY CAUSE OF RESPONSE TYPE'
		mutationFn: async () => {
			const response = await client.api.accounts[':id']['$delete']({ param: { id } });

			return await response.json();
		},
		onSuccess: () => {
			// REFETCH ALL ACOUNT EVERY TIME YOU CREATE A NEW ACCOUNT
			queryClient.invalidateQueries({ queryKey: ['account', { id }] });
			queryClient.invalidateQueries({ queryKey: ['accounts'] });
			queryClient.invalidateQueries({ queryKey: ['transactions'] });
			// TODO: INVALIDATE SUMMARY

			toast.success('Account deleted successfully!', {
				style: {
					fontSize: '12px',
				},
			});
		},

		onError: () => {
			toast.error('Faild to delete account', {
				style: {
					fontSize: '12px',
				},
			});
		},
	});

	return mutation;
};
