import { InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import toast from 'react-hot-toast';

type ResponseType = InferResponseType<typeof client.api.transactions[':id']['$delete']>;

export const useDeleteTransaction = (id?: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error>({
		// JSON => WHAT WE ARE GOING TO SEND FROM OUR FORM 'TYPE SAFTY CAUSE OF RESPONSE TYPE'
		mutationFn: async () => {
			const response = await client.api.transactions[':id']['$delete'](
				{
					param: { id }
				}
			);

			return await response.json();
		},
		onSuccess: () => {
			// REFETCH ALL CATEGORIES EVERY TIME YOU CREATE A NEW CATEGORY
			queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
			queryClient.invalidateQueries({ queryKey: ['transactions'] });
			// TODO: INVALIDATE SUMMARY

			toast.success('Transaction deleted successfully!', {
				style: {
					fontSize: '12px',
					fontWeight: "bold"
				},
			});
		},

		onError: () => {
			toast.error('Faild to delete transaction', {
				style: {
					fontSize: '12px',
					fontWeight: "bold"
				},
			});
		},
	});

	return mutation;
};
