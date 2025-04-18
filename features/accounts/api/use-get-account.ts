import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';

export const useGetAccount = (id?: string) => {
	const query = useQuery({
		enabled: !!id,
		queryKey: ['account', { id }],
		queryFn: async () => {
			const response = await client.api.accounts[':id'].$get({ param: { id } });

			if (!response.ok) {
				throw new Error('Faild to fetch account');
			}

			const { data } = await response.json();

			return data;
		},
	});

	return query;
};
