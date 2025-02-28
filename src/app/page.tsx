"use client";

import { useEffect } from 'react';
import { MetricsGrid } from '@/components/MetricsGrid';
import { PerformanceCharts } from '@/components/PerformanceCharts';
import { CampaignsTable } from '@/components/CampaignsTable';
import { usePageTitle } from '@/lib/context/PageTitleContext';

export default function Home() {
  const { setPageTitle } = usePageTitle();
  
  useEffect(() => {
    setPageTitle('Dashboard');
  }, [setPageTitle]);

  return (
    <div className="bg-white dark:bg-gray-900 p-4 h-full">
      <div className="flex flex-col gap-4 h-full">
        <MetricsGrid />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 flex-1">
          <div className="flex flex-col">
            <h2 className="text-lg font-semibold mb-2">Performance Charts</h2>
            <div className="flex-1">
              <PerformanceCharts />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex-1">
              <CampaignsTable />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
