import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import toast from 'react-hot-toast';

type ResponseType = InferResponseType<typeof client.api.categories[':id']['$patch']>;
type RequestType = InferRequestType<typeof client.api.categories[':id']['$patch']>['json']; // ENDPOINT EXCEPTED VALUES

export const useEditCategory = (id?: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		// JSON => WHAT WE ARE GOING TO SEND FROM OUR FORM 'TYPE SAFTY CAUSE OF RESPONSE TYPE'
		mutationFn: async json => {
			const response = await client.api.categories[':id']['$patch']({
				param: { id },
				json,
			});

			return await response.json();
		},
		onSuccess: () => {
			// REFETCH ALL ACOUNT EVERY TIME YOU CREATE A NEW CATEGORIES
			queryClient.invalidateQueries({ queryKey: ['category', { id }] });
			queryClient.invalidateQueries({ queryKey: ['categories'] });
			queryClient.invalidateQueries({ queryKey: ['transactions'] });

			// TODO: INVALIDATE SUMMARY

			toast.success('Category edited successfully!', {
				style: {
					fontSize: '12px',
					fontWeight: "bold"
				},
			});
		},

		onError: () => {
			toast.error('Faild to edit category', {
				style: {
					fontSize: '12px',
					fontWeight: "bold"
				},
			});
		},
	});

	return mutation;
};
