import { InferRequestType, InferResponseType } from 'hono';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { client } from '@/lib/rpc';
import toast from 'react-hot-toast';

type ResponseType = InferResponseType<typeof client.api.transactions.$post>;
type RequestType = InferRequestType<typeof client.api.transactions.$post>['json']; // ENDPOINT EXCEPTED VALUES

export const useCreateTransaction = () => {
	const queryClient = useQueryClient();

	const mutation = useMutation<ResponseType, Error, RequestType>({
		// JSON => WHAT WE ARE GOING TO SEND FROM OUR FORM 'TYPE SAFTY CAUSE OF RESPONSE TYPE'
		mutationFn: async json => {
			const response = await client.api.transactions.$post({ json });

			return await response.json();
		},

		onSuccess: () => {

			toast.success('New transaction created successfully! 🎉', {
				style: {
					fontSize: '12px',
					fontWeight: "bold"
				},
			});

			// REFETCH ALL CATEGORIES EVERY TIME YOU CREATE A NEW CATEGORIES
			queryClient.invalidateQueries({ queryKey: ['transactions'] });
			// TODO: INVALIDATE SUMMARY
		},

		onError: () => {
			toast.error('Faild to create new transaction', {
				style: {
					fontSize: '12px',
					fontWeight: "bold",
				},
			});
		},
	});

	return mutation;
};
