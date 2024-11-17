import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import toast from 'react-hot-toast';

type ResponseType = InferResponseType<typeof client.api.transactions[':id']['$patch']>;
type RequestType = InferRequestType<typeof client.api.transactions[':id']['$patch']>['json']; // ENDPOINT EXCEPTED VALUES

export const useEditTransaction = (id?: string) => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		// JSON => WHAT WE ARE GOING TO SEND FROM OUR FORM 'TYPE SAFTY CAUSE OF RESPONSE TYPE'
		mutationFn: async json => {
			const response = await client.api.transactions[':id']['$patch']({
				param: { id },
				json,
			});

			return await response.json();
		},
		onSuccess: () => {
			// REFETCH ALL ACOUNT EVERY TIME YOU CREATE A NEW CATEGORIES
			queryClient.invalidateQueries({ queryKey: ['transaction', { id }] });
			queryClient.invalidateQueries({ queryKey: ['transactions'] });
			// TODO: INVALIDATE SUMMARY 

			toast.success('Trasnaction edited successfully!', {
				style: {
					fontSize: '12px',
					fontWeight: "bold"
				},
			});
		},

		onError: () => {
			toast.error('Faild to edit transaction', {
				style: {
					fontSize: '12px',
					fontWeight: "bold"
				},
			});
		},
	});

	return mutation;
};
