import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';
import { useSearchParams } from 'next/navigation';

export const useGetTransactions = () => {
	const params = useSearchParams();
	const from = params.get("from") || "";
	const to = params.get("to") || "";
	const accountId = params.get("accountId") || "";

	const query = useQuery({
		// TODO: CHECK IF PARAMS ARE NEEDED IN THE KEY
		queryKey: ['transactions', { from, to, accountId }],

		queryFn: async () => {
			const response = await client.api.transactions.$get({
				query: {
					from,
					to,
					accountId
				}
			});

			if (!response.ok) {
				throw new Error('Faild to fetch transactions');
			}

			const { data } = await response.json();

			return data;
		},
	});

	return query;
};