import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import toast from 'react-hot-toast';

type ResponseType = InferResponseType<(typeof client.api.accounts)['bulk-delete']['$post']>;
type RequestType = InferRequestType<(typeof client.api.accounts)['bulk-delete']['$post']>['json']; // ENDPOINT EXCEPTED VALUES

export const useBulkDeletAccount = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		// JSON => WHAT WE ARE GOING TO SEND FROM OUR FORM 'TYPE SAFTY CAUSE OF RESPONSE TYPE'
		mutationFn: async json => {
			const response = await client.api.accounts['bulk-delete']['$post']({ json });

			return await response.json();
		},
		onSuccess: () => {
			// REFETCH ALL ACOUNT EVERY TIME YOU CREATE A NEW ACCOUNT
			queryClient.invalidateQueries({ queryKey: ['accounts'] });
			// TODO: ALSO INVALIDATE SUMMARY
			toast.success('Accounts deleted successfully!', {
				style: {
					fontSize: '12px',
				},
			});
		},

		onError: () => {
			toast.error('Faild to delete accounts', {
				style: {
					fontSize: '12px',
				},
			});
		},
	});

	return mutation;
};
