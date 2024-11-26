import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import toast from 'react-hot-toast';

type ResponseType = InferResponseType<(typeof client.api.categories)['bulk-delete']['$post']>;
type RequestType = InferRequestType<(typeof client.api.categories)['bulk-delete']['$post']>['json']; // ENDPOINT EXCEPTED VALUES

export const useBulkDeleteCategories = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		// JSON => WHAT WE ARE GOING TO SEND FROM OUR FORM 'TYPE SAFTY CAUSE OF RESPONSE TYPE'
		mutationFn: async json => {
			const response = await client.api.categories['bulk-delete']['$post']({ json });

			return await response.json();
		},
		onSuccess: () => {
			// REFETCH ALL CATEGORIES EVERY TIME YOU CREATE A NEW CATEGORY
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			queryClient.invalidateQueries({ queryKey: ['summary'] });

			toast.success('Categories deleted successfully!', {
				style: {
					fontSize: '12px',
				},
			});
		},

		onError: () => {
			toast.error('Faild to delete category', {
				style: {
					fontSize: '12px',
				},
			});
		},
	});

	return mutation;
};
