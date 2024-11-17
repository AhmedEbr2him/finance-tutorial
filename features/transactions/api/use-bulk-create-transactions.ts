import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import toast from 'react-hot-toast';

type ResponseType = InferResponseType<typeof client.api.transactions['bulk-create']['$post']>;
type RequestType = InferRequestType<typeof client.api.transactions['bulk-create']['$post']>['json']; // ENDPOINT EXCEPTED VALUES

export const useBulkDeleteTransactions = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		// JSON => WHAT WE ARE GOING TO SEND FROM OUR FORM 'TYPE SAFTY CAUSE OF RESPONSE TYPE'
		mutationFn: async json => {
			const response = await client.api.transactions['bulk-create']['$post']({ json });

			return await response.json();
		},
		onSuccess: () => {
			// REFETCH ALL CATEGORIES EVERY TIME YOU CREATE A NEW CATEGORY
			queryClient.invalidateQueries({ queryKey: ['transactions'] });
			// TODO: ALSO INVALIDATE SUMMARY
			toast.success('Transactions created successfully!', {
				style: {
					fontSize: '12px',
				},
			});
		},

		onError: () => {
			toast.error('Faild to create transactions', {
				style: {
					fontSize: '12px',
				},
			});
		},
	});

	return mutation;
};
