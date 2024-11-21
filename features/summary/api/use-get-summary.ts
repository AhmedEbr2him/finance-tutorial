import { useQuery } from '@tanstack/react-query';

import { client } from '@/lib/rpc';
import { useSearchParams } from 'next/navigation';
import { converAmountFromMiliunits } from '@/lib/utils';

export const useGetSummary = () => {
	const params = useSearchParams();
	const from = params.get("from") || "";
	const to = params.get("to") || "";
	const accountId = params.get("accountId") || "";

	const query = useQuery({
		// TODO: CHECK IF PARAMS ARE NEEDED IN THE KEY
		queryKey: ['summary', { from, to, accountId }],

		queryFn: async () => {
			const response = await client.api.summary.$get({
				query: {
					from,
					to,
					accountId
				}
			});

			if (!response.ok) {
				throw new Error('Faild to fetch summary');
			}

			const { data } = await response.json();

			return ({
				...data,
				incomeAmount: converAmountFromMiliunits(data.incomeAmount),
				expensesAmount: converAmountFromMiliunits(data.expensesAmount),
				remainingAmount: converAmountFromMiliunits(data.remainingAmount),
				categories: data.categories.map((category) => ({
					...category,
					value: converAmountFromMiliunits(category.value),
				})),
				days: data.days.map((day) => ({
					...day,
					income: converAmountFromMiliunits(day.income),
					expenses: converAmountFromMiliunits(day.expenses)
				}))
			})
		},
	});

	return query;
};
