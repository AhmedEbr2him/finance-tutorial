import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import toast from 'react-hot-toast';

type ResponseType = InferResponseType<typeof client.api.categories.$post>;
type RequestType = InferRequestType<typeof client.api.categories.$post>['json']; // ENDPOINT EXCEPTED VALUES

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		// JSON => WHAT WE ARE GOING TO SEND FROM OUR FORM 'TYPE SAFTY CAUSE OF RESPONSE TYPE'
		mutationFn: async json => {
			const response = await client.api.categories.$post({ json });

			return await response.json();
		},
		onSuccess: () => {
			// REFETCH ALL CATEGORIES EVERY TIME YOU CREATE A NEW CATEGORIES
			queryClient.invalidateQueries({ queryKey: ['categories'] });

			toast.success('New category created successfully! 🎉', {
				style: {
					fontSize: '12px',
					fontWeight: "bold"
				},
			});
		},

		onError: () => {
			toast.error('Faild to create new category', {
				style: {
					fontSize: '12px',
					fontWeight:"bold",
				},
			});
		},
	});

	return mutation;
};
