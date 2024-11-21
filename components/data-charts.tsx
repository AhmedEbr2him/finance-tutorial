'use client';

import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { Chart } from './chart';


export const DataCharts = () => {
  const { data: summary, isLoading: summaryIsLoading } = useGetSummary();

  if (summaryIsLoading) {
    return (
      <div className="">
        Loading...
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="col-span-1 lg:col-span-1-3 xl:col-span-4">
        <Chart data={summary?.days} />
      </div>
    </div>
  )
}