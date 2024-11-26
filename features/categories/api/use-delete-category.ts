import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import toast from 'react-hot-toast';

type ResponseType = InferResponseType<typeof client.api.categories[':id']['$delete']>;

export const useDeleteCategory = (id?: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error>({
		// JSON => WHAT WE ARE GOING TO SEND FROM OUR FORM 'TYPE SAFTY CAUSE OF RESPONSE TYPE'
		mutationFn: async () => {
			const response = await client.api.categories[':id']['$delete']({ param: { id } });

			return await response.json();
		},
		onSuccess: () => {
			// REFETCH ALL CATEGORIES EVERY TIME YOU CREATE A NEW CATEGORY
			queryClient.invalidateQueries({ queryKey: ['category', { id }] });
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			queryClient.invalidateQueries({ queryKey: ['transactions'] });
			queryClient.invalidateQueries({ queryKey: ['summary'] });


			toast.success('Category deleted successfully!', {
				style: {
					fontSize: '12px',
					fontWeight: "bold"
				},
			});
		},

		onError: () => {
			toast.error('Faild to delete category', {
				style: {
					fontSize: '12px',
					fontWeight: "bold"
				},
			});
		},
	});

	return mutation;
};
