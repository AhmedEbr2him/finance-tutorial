'use client';

import { useGetSummary } from '@/features/summary/api/use-get-summary';
import { Chart, ChartLoading } from '@/components/chart';
import { SpendingPie, SpendingPieLoading } from '@/components/spending-pie';


export const DataCharts = () => {
  const { data: summary, isLoading: summaryIsLoading } = useGetSummary();

  if (summaryIsLoading) {
    return (
      <div>
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          <div className="col-span-1 lg:col-span-3 xl:col-span-4">
            <ChartLoading />
          </div>
          <div className="col-span-1 lg:col-span-3 xl:col-span-2">
            <SpendingPieLoading />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
      <div className="col-span-1 lg:col-span-3 xl:col-span-4">
        <Chart data={summary?.days} />
      </div>
      <div className="col-span-1 lg:col-span-3 xl:col-span-2">
        <SpendingPie data={summary?.categories} />
      </div>
    </div>
  )
}