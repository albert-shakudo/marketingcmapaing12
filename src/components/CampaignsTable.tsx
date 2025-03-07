"use client";

import { InformationCircleIcon, PencilIcon, TrashIcon, ChartBarIcon, PauseIcon, PlayIcon, ArrowUpIcon, ArrowDownIcon, MinusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { ChartData, ChartOptions } from 'chart.js';
import React from 'react';
import Image from 'next/image';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement, ChartType } from 'chart.js';
import { Chart } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';

// Dynamically import chart components with no SSR
const Line = dynamic(
  () => import('react-chartjs-2').then(mod => mod.Line),
  { ssr: false }
);

// Register chart components on client side only
const registerChartComponents = async () => {
  if (typeof window !== 'undefined') {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      Title,
      Tooltip,
      Legend,
      annotationPlugin
    );
  }
};

// Register components
registerChartComponents();

// Map channel to icon paths
const getChannelIconPath = (channel: string): string => {
  switch (channel) {
    case 'meta': return '/images/meta-icon.svg';
    case 'linkedin': return '/images/linkedin-app-icon.svg';
    case 'google': return '/images/google-ads-icon.svg';
    case 'twitter': return '/images/x-social-media-black-icon.svg';
    case 'quora': return '/images/quora-icon.svg';
    case 'reddit': return '/images/reddit-icon.svg';
    default: return '/images/x-social-media-black-icon.svg';
  }
};

interface Campaign {
  name: string;
  unitCost: number;
  mqlMeetings: number;
  hubspotMeetings: number;
  hubspotContacts: number;
  status: 'ACTIVE' | 'PAUSED';
  budget: number;
  channel: 'meta' | 'linkedin' | 'google' | 'twitter' | 'quora' | 'reddit';
  roi: number;
  trend: 'up' | 'down' | 'stable';
}

interface OptimizerParams {
  selectedCampaigns: string[];
  targetCPA: number;
  maxDailyBudget: number;
  minDailyBudget: number;
  optimizationGoal: 'conversions' | 'spend' | 'balanced';
  riskTolerance: 'low' | 'medium' | 'high';
}

interface ChartDataWithProjections {
  labels: string[];
  datasets: Array<{
    type: 'line' | 'bar';
    label: string;
    data: (number | null)[];
    borderColor?: string;
    backgroundColor?: string;
    borderWidth?: number;
    borderDash?: number[];
    tension?: number;
    yAxisID: string;
    order?: number;
  }>;
  projectedSavings: number;
  averageWithoutAiMeetings: number;
  averageWithAiMeetings: number;
}

const sampleData: Campaign[] = [
  {
    name: 'us-dr-crm-cloud-enterprise',
    unitCost: 425.00,
    mqlMeetings: 245,
    hubspotMeetings: 180,
    hubspotContacts: 892,
    status: 'ACTIVE',
    budget: 12500.00,
    channel: 'twitter',
    roi: 3.2,
    trend: 'up'
  },
  {
    name: 'global-brand-sf-dreamforce-cxo',
    unitCost: 850.00,
    mqlMeetings: 520,
    hubspotMeetings: 380,
    hubspotContacts: 1450,
    status: 'ACTIVE',
    budget: 45000.00,
    channel: 'linkedin',
    roi: 2.8,
    trend: 'stable'
  },
  {
    name: 'emea-dr-sales-cloud-finserv',
    unitCost: 380.00,
    mqlMeetings: 180,
    hubspotMeetings: 120,
    hubspotContacts: 640,
    status: 'ACTIVE',
    budget: 8500.00,
    channel: 'google',
    roi: 2.1,
    trend: 'up'
  },
  {
    name: 'apac-dr-service-cloud-retail',
    unitCost: 290.00,
    mqlMeetings: 145,
    hubspotMeetings: 95,
    hubspotContacts: 420,
    status: 'ACTIVE',
    budget: 6800.00,
    channel: 'linkedin',
    roi: 1.9,
    trend: 'down'
  },
  {
    name: 'us-content-mkt-cloud-commerce',
    unitCost: 175.00,
    mqlMeetings: 85,
    hubspotMeetings: 45,
    hubspotContacts: 320,
    status: 'PAUSED',
    budget: 4200.00,
    channel: 'twitter',
    roi: 1.5,
    trend: 'stable'
  },
  {
    name: 'latam-dr-analytics-cloud-tech',
    unitCost: 210.00,
    mqlMeetings: 95,
    hubspotMeetings: 65,
    hubspotContacts: 280,
    status: 'ACTIVE',
    budget: 5500.00,
    channel: 'quora',
    roi: 2.3,
    trend: 'up'
  },
  {
    name: 'global-event-tableau-summit-it',
    unitCost: 620.00,
    mqlMeetings: 340,
    hubspotMeetings: 260,
    hubspotContacts: 980,
    status: 'ACTIVE',
    budget: 28000.00,
    channel: 'meta',
    roi: 3.7,
    trend: 'up'
  },
  {
    name: 'us-dr-slack-enterprise-collab',
    unitCost: 310.00,
    mqlMeetings: 165,
    hubspotMeetings: 120,
    hubspotContacts: 580,
    status: 'ACTIVE',
    budget: 7800.00,
    channel: 'reddit',
    roi: 2.5,
    trend: 'stable'
  },
  {
    name: 'emea-content-mulesoft-api-dev',
    unitCost: 280.00,
    mqlMeetings: 125,
    hubspotMeetings: 85,
    hubspotContacts: 420,
    status: 'PAUSED',
    budget: 6200.00,
    channel: 'google',
    roi: 1.8,
    trend: 'down'
  },
  {
    name: 'us-brand-net0-cloud-sustain',
    unitCost: 390.00,
    mqlMeetings: 190,
    hubspotMeetings: 140,
    hubspotContacts: 680,
    status: 'ACTIVE',
    budget: 9500.00,
    channel: 'linkedin',
    roi: 2.6,
    trend: 'stable'
  },
  {
    name: 'global-dr-genie-ai-platform',
    unitCost: 580.00,
    mqlMeetings: 280,
    hubspotMeetings: 210,
    hubspotContacts: 920,
    status: 'ACTIVE',
    budget: 18500.00,
    channel: 'meta',
    roi: 3.1,
    trend: 'up'
  }
];

const AIBudgetOptimizer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [step, setStep] = useState<'params' | 'results'>('params');
  const [params, setParams] = useState<OptimizerParams>({
    selectedCampaigns: [],
    targetCPA: 500,
    maxDailyBudget: 50000,
    minDailyBudget: 1000,
    optimizationGoal: 'balanced',
    riskTolerance: 'medium',
  });

  const generateChartData = (): ChartDataWithProjections => {
    const dates: string[] = [];
    const historicalSpend: (number | null)[] = [];
    const historicalMeetings: (number | null)[] = [];
    const withoutAiSpend: (number | null)[] = [];
    const withoutAiMeetings: (number | null)[] = [];
    const withAiSpend: (number | null)[] = [];
    const withAiMeetings: (number | null)[] = [];
    
    // Generate past 8 weeks of data (weekly intervals)
    for (let i = 8; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      dates.push(new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date));
      
      // Historical data with some realistic variation
      const baseSpend = 25000 + (Math.sin(i / 2) * 5000);
      const baseMeetings = 75 + (Math.sin(i / 2) * 15);
      
      historicalSpend.push(baseSpend);
      historicalMeetings.push(Math.round(baseMeetings));
      withoutAiSpend.push(null);
      withoutAiMeetings.push(null);
      withAiSpend.push(null);
      withAiMeetings.push(null);
    }

    // Generate future 4 weeks predictions
    const lastHistoricalSpend = historicalSpend[historicalSpend.length - 1] ?? 0;
    const lastHistoricalMeetings = historicalMeetings[historicalMeetings.length - 1] ?? 0;

    for (let i = 1; i <= 4; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i * 7));
      dates.push(new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date));
      
      // Without AI: spending increases but meetings stay relatively flat
      const withoutAiDailySpend = lastHistoricalSpend * (1 + (i * 0.05)); // 5% increase per week
      const withoutAiDailyMeetings = lastHistoricalMeetings * (1 + (i * 0.01)); // 1% increase per week
      
      // With AI: spending decreases but meetings increase slightly
      const withAiDailySpend = lastHistoricalSpend * (1 - (i * 0.03)); // 3% decrease per week
      const withAiDailyMeetings = lastHistoricalMeetings * (1 + (i * 0.02)); // 2% increase per week
      
      historicalSpend.push(null);
      historicalMeetings.push(null);
      withoutAiSpend.push(withoutAiDailySpend);
      withoutAiMeetings.push(Math.round(withoutAiDailyMeetings));
      withAiSpend.push(withAiDailySpend);
      withAiMeetings.push(Math.round(withAiDailyMeetings));
    }

    // Calculate projected savings with explicit number conversion
    const totalWithoutAiSpend = Number(withoutAiSpend.reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0));
    const totalWithAiSpend = Number(withAiSpend.reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0));
    const projectedSavings = totalWithoutAiSpend - totalWithAiSpend;
    const averageWithoutAiMeetings = Number(withoutAiMeetings.reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0)) / 4;
    const averageWithAiMeetings = Number(withAiMeetings.reduce((sum, val) => (sum ?? 0) + (val ?? 0), 0)) / 4;

    return {
      labels: dates,
      datasets: [
        {
          type: 'line',
          label: 'Historical Spend',
          data: historicalSpend,
          borderColor: 'rgb(75, 85, 99)',
          borderWidth: 2,
          tension: 0.3,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'Without AI Spend',
          data: withoutAiSpend,
          borderColor: 'rgb(239, 68, 68)',
          borderWidth: 2,
          borderDash: [5, 5],
          tension: 0.3,
          yAxisID: 'y',
        },
        {
          type: 'line',
          label: 'With AI Spend',
          data: withAiSpend,
          borderColor: 'rgb(34, 197, 94)',
          borderWidth: 2,
          tension: 0.3,
          yAxisID: 'y',
        },
        {
          type: 'bar',
          label: 'Historical Meetings',
          data: historicalMeetings,
          backgroundColor: 'rgba(75, 85, 99, 0.5)',
          yAxisID: 'y1',
          order: 4
        },
        {
          type: 'bar',
          label: 'Without AI Meetings',
          data: withoutAiMeetings,
          backgroundColor: 'rgba(239, 68, 68, 0.2)',
          yAxisID: 'y1',
          order: 5
        },
        {
          type: 'bar',
          label: 'With AI Meetings',
          data: withAiMeetings,
          backgroundColor: 'rgba(34, 197, 94, 0.5)',
          yAxisID: 'y1',
          order: 6
        }
      ],
      projectedSavings,
      averageWithoutAiMeetings,
      averageWithAiMeetings,
    };
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index',
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 13, // Show all data points (8 historical + 4 future)
          maxRotation: 0,
          font: {
            size: 11
          }
        },
      },
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Weekly Ad Spend ($)',
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: (value) => '$' + (Number(value) / 1000).toFixed(0) + 'k'
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Weekly Meetings (#)',
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        align: 'start',
        labels: {
          boxWidth: 12,
          padding: 15,
          usePointStyle: true,
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        titleColor: 'white',
        bodyColor: 'white',
        bodySpacing: 8,
        mode: 'index',
        intersect: false,
        callbacks: {
          label: (context) => {
            const value = context.raw as number;
            if (context.dataset.yAxisID === 'y') {
              return `${context.dataset.label}: $${(value / 1000).toFixed(1)}k`;
            }
            return `${context.dataset.label}: ${Math.round(value)}`;
          }
        }
      },
      annotation: {
        annotations: {
          todayLine: {
            type: 'line',
            xMin: 8,
            xMax: 8,
            borderColor: 'rgba(0, 0, 0, 0.5)',
            borderWidth: 2,
            borderDash: [2, 2],
            label: {
              display: true,
              content: 'Today',
              position: 'start'
            }
          }
        }
      }
    },
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            AI Budget Optimizer
          </h2>
          <div className="flex items-center gap-3">
            <div className="text-xs px-2 py-1 bg-gray-100 rounded-full">
              {step === 'params' ? 'Step 1: Configure' : 'Step 2: Results'}
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 p-1"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-4">
          {step === 'params' ? (
            <div className="grid grid-cols-12 gap-4">
              {/* Left column - Campaign selection */}
              <div className="col-span-5 border-r border-gray-200 dark:border-gray-700 pr-4">
                <div className="mb-3">
                  <label className="block text-sm font-medium mb-1">Select Campaigns to Optimize</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search campaigns..." 
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 mb-2"
                    />
                  </div>
                  <div className="h-[280px] overflow-y-auto border border-gray-200 rounded-md p-2">
                    <div className="flex justify-between mb-2 px-1">
                      <button className="text-xs text-gray-500 hover:text-black">Select All</button>
                      <button className="text-xs text-gray-500 hover:text-black">Clear</button>
                    </div>
                    <div className="space-y-1">
                      {sampleData.map((campaign) => (
                        <label key={campaign.name} className="flex items-center text-sm p-1 hover:bg-gray-50 rounded">
                          <input
                            type="checkbox"
                            className="mr-2 h-3.5 w-3.5 rounded border-gray-300 text-black focus:ring-gray-500"
                            checked={params.selectedCampaigns.includes(campaign.name)}
                            onChange={(e) => {
                              setParams(prev => ({
                                ...prev,
                                selectedCampaigns: e.target.checked
                                  ? [...prev.selectedCampaigns, campaign.name]
                                  : prev.selectedCampaigns.filter(name => name !== campaign.name)
                              }));
                            }}
                          />
                          <div className="flex items-center space-x-2 relative">
                            <div className="relative w-6 h-6 mr-2 flex-shrink-0">
                              <Image 
                                src={getChannelIconPath(campaign.channel)}
                                alt={campaign.channel}
                                width={16}
                                height={16}
                                className="object-contain"
                              />
                            </div>
                            <span className="truncate">{campaign.name}</span>
                          </div>
                          <span className="ml-auto text-xs text-gray-500">${campaign.budget.toFixed(0)}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right column - Parameters */}
              <div className="col-span-7 pl-2">
                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Optimization Strategy</label>
                    <div className="grid grid-cols-3 gap-2">
                      <button 
                        className={`text-sm py-2 px-3 rounded-md border ${params.optimizationGoal === 'conversions' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'}`}
                        onClick={() => setParams(prev => ({ ...prev, optimizationGoal: 'conversions' }))}
                      >
                        Max Conversions
                      </button>
                      <button 
                        className={`text-sm py-2 px-3 rounded-md border ${params.optimizationGoal === 'spend' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'}`}
                        onClick={() => setParams(prev => ({ ...prev, optimizationGoal: 'spend' }))}
                      >
                        Min Spend
                      </button>
                      <button 
                        className={`text-sm py-2 px-3 rounded-md border ${params.optimizationGoal === 'balanced' ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'}`}
                        onClick={() => setParams(prev => ({ ...prev, optimizationGoal: 'balanced' }))}
                      >
                        Balanced
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Target CPA ($)</label>
                    <input
                      type="number"
                      value={params.targetCPA}
                      onChange={(e) => setParams(prev => ({ ...prev, targetCPA: Number(e.target.value) }))}
                      className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Risk Tolerance</label>
                    <div className="relative">
                      <select
                        value={params.riskTolerance}
                        onChange={(e) => setParams(prev => ({ ...prev, riskTolerance: e.target.value as 'low' | 'medium' | 'high' }))}
                        className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 appearance-none"
                      >
                        <option value="low">Conservative (Low)</option>
                        <option value="medium">Moderate (Medium)</option>
                        <option value="high">Aggressive (High)</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Daily Budget Range ($)</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">Min</span>
                        <input
                          type="number"
                          value={params.minDailyBudget}
                          onChange={(e) => setParams(prev => ({ ...prev, minDailyBudget: Number(e.target.value) }))}
                          className="w-full pl-12 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 text-sm">Max</span>
                        <input
                          type="number"
                          value={params.maxDailyBudget}
                          onChange={(e) => setParams(prev => ({ ...prev, maxDailyBudget: Number(e.target.value) }))}
                          className="w-full pl-12 pr-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium mb-1">Advanced Options</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="weekendAdjustment"
                          className="h-3.5 w-3.5 rounded border-gray-300 text-black focus:ring-gray-500"
                        />
                        <label htmlFor="weekendAdjustment" className="ml-2 text-sm text-gray-700">Weekend Adjustment</label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="seasonalTrends"
                          className="h-3.5 w-3.5 rounded border-gray-300 text-black focus:ring-gray-500"
                        />
                        <label htmlFor="seasonalTrends" className="ml-2 text-sm text-gray-700">Seasonal Trends</label>
                      </div>
                    </div>
                  </div>

                  <div className="col-span-2 mt-2">
                    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Selected Campaigns</div>
                        <div className="text-sm font-medium">{params.selectedCampaigns.length} of {sampleData.length}</div>
                      </div>
                      <div className="mt-1 text-xs text-gray-500">
                        Total Current Budget: ${sampleData
                          .filter(c => params.selectedCampaigns.includes(c.name))
                          .reduce((sum, c) => sum + c.budget, 0).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8">
                <div className="h-[300px] relative">
                  <Chart
                    // @ts-expect-error - Chart.js typing issue with mixed chart types
                    type="mixed"
                    data={generateChartData() as unknown as ChartData<'line', number[], string>}
                    options={chartOptions}
                  />
                  {/* Add floating tooltip with projected savings */}
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-gray-800/90 p-2 rounded-md shadow-sm border border-gray-200 text-xs">
                    <div className="font-medium">Projected 30-day Impact:</div>
                    <div className="text-green-600">Save ${(generateChartData().projectedSavings / 1000).toFixed(1)}k</div>
                    <div className="text-blue-600">Maintain {Math.round(generateChartData().averageWithAiMeetings)} meetings/day</div>
                  </div>
                </div>
              </div>
              
              <div className="col-span-4 flex flex-col gap-3">
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm mb-2">Projected Improvements</h3>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    <li className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                      23% increase in conversions
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                      15% reduction in CPA
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      18% better budget utilization
                    </li>
                  </ul>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm mb-2">AI Recommendations</h3>
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    <li className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Reallocate budget from underperforming campaigns
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Increase spend during high-converting time periods
                    </li>
                    <li className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Adjust bid strategies for optimal performance
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-span-12">
                <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
                  <h3 className="font-bold text-gray-800 text-sm mb-2">Campaign-Specific Recommendations</h3>
                  <div className="grid grid-cols-3 gap-3 mt-2">
                    {params.selectedCampaigns.slice(0, 3).map(name => {
                      const campaign = sampleData.find(c => c.name === name);
                      return (
                        <div key={name} className="bg-white p-2 rounded border border-gray-200 text-xs">
                          <div className="font-medium truncate">{name}</div>
                          <div className="mt-1 flex justify-between">
                            <span>Current: ${campaign?.budget.toFixed(0) || '0'}</span>
                            <span className="font-medium">→</span>
                            <span>Recommended: ${campaign ? (campaign.budget * 1.2).toFixed(0) : '0'}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex justify-between">
            {step === 'params' ? (
              <>
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setStep('results')}
                  className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors flex items-center gap-1"
                >
                  <span>Run AI Optimization</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setStep('params')}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 flex items-center gap-1"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Back to Parameters</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-black text-white rounded-md text-sm hover:bg-gray-800 transition-colors"
                >
                  Apply Recommendations
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export function CampaignsTable() {
  const [isOptimizerOpen, setIsOptimizerOpen] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState<string>('all');
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const filteredData = selectedChannel === 'all' 
    ? sampleData 
    : sampleData.filter(campaign => campaign.channel === selectedChannel);

  const channels = ['all', ...Array.from(new Set(sampleData.map(c => c.channel)))];

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Campaign Overview</h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <label htmlFor="channel-filter" className="text-sm mr-2 text-gray-600">Filter by Channel:</label>
            <select
              id="channel-filter"
              value={selectedChannel}
              onChange={(e) => setSelectedChannel(e.target.value)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500"
            >
              {channels.map(channel => (
                <option key={channel} value={channel}>{channel === 'all' ? 'All Channels' : channel.charAt(0).toUpperCase() + channel.slice(1)}</option>
              ))}
            </select>
          </div>
          <button
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors flex items-center gap-2 text-sm whitespace-nowrap"
            onClick={() => setIsOptimizerOpen(true)}
          >
            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="flex-shrink-0">AI Budget Optimizer</span>
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider w-10">
                  
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Channel
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Campaign Name
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Unit Cost
                  <InformationCircleIcon className="inline-block w-3 h-3 ml-1" />
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  MQL Meetings
                  <InformationCircleIcon className="inline-block w-3 h-3 ml-1" />
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  HubSpot Meetings
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  HubSpot Contacts
                  <InformationCircleIcon className="inline-block w-3 h-3 ml-1" />
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Current Daily Budget
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  ROI
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Trend
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredData.map((campaign, idx) => (
                <tr key={idx} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-3 py-2 whitespace-nowrap text-xs">
                    <div className="flex justify-center">
                      <div className="relative w-4 h-4">
                        <Image 
                          src={getChannelIconPath(campaign.channel)}
                          alt={campaign.channel}
                          width={16}
                          height={16}
                          className="object-contain"
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    <span className="capitalize text-gray-600">{campaign.channel}</span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs font-medium text-gray-900 dark:text-white">
                    {campaign.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    ${campaign.unitCost.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {campaign.mqlMeetings}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {campaign.hubspotMeetings}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    {campaign.hubspotContacts}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    <span className={`px-2 py-1 inline-flex text-xs leading-4 font-semibold rounded-full ${
                      campaign.status === 'ACTIVE' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs text-gray-500 dark:text-gray-400">
                    ${campaign.budget.toFixed(2)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    <span className={`font-medium ${campaign.roi >= 3 ? 'text-green-600' : campaign.roi >= 2 ? 'text-blue-600' : 'text-gray-600'}`}>
                      {campaign.roi.toFixed(1)}x
                    </span>
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    {campaign.trend === 'up' ? (
                      <div className="flex items-center text-green-600">
                        <ArrowUpIcon className="w-3 h-3 mr-1" />
                        <span>Up</span>
                      </div>
                    ) : campaign.trend === 'down' ? (
                      <div className="flex items-center text-red-600">
                        <ArrowDownIcon className="w-3 h-3 mr-1" />
                        <span>Down</span>
                      </div>
                    ) : (
                      <div className="flex items-center text-gray-600">
                        <MinusIcon className="w-3 h-3 mr-1" />
                        <span>Stable</span>
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-xs">
                    <div className="flex items-center space-x-2 relative">
                      <button 
                        className="text-gray-500 hover:text-blue-600 transition-colors" 
                        title="Edit Campaign"
                        onMouseEnter={() => setHoveredAction(`edit-${idx}`)}
                        onMouseLeave={() => setHoveredAction(null)}
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      {hoveredAction === `edit-${idx}` && (
                        <div className="absolute z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 left-0 -top-8 whitespace-nowrap">
                          Edit Campaign
                        </div>
                      )}
                      
                      <button 
                        className="text-gray-500 hover:text-green-600 transition-colors" 
                        title="View Analytics"
                        onMouseEnter={() => setHoveredAction(`analytics-${idx}`)}
                        onMouseLeave={() => setHoveredAction(null)}
                      >
                        <ChartBarIcon className="w-4 h-4" />
                      </button>
                      {hoveredAction === `analytics-${idx}` && (
                        <div className="absolute z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 left-8 -top-8 whitespace-nowrap">
                          View Analytics
                        </div>
                      )}
                      
                      {campaign.status === 'ACTIVE' ? (
                        <button 
                          className="text-gray-500 hover:text-yellow-600 transition-colors" 
                          title="Pause Campaign"
                          onMouseEnter={() => setHoveredAction(`pause-${idx}`)}
                          onMouseLeave={() => setHoveredAction(null)}
                        >
                          <PauseIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <button 
                          className="text-gray-500 hover:text-green-600 transition-colors" 
                          title="Activate Campaign"
                          onMouseEnter={() => setHoveredAction(`play-${idx}`)}
                          onMouseLeave={() => setHoveredAction(null)}
                        >
                          <PlayIcon className="w-4 h-4" />
                        </button>
                      )}
                      {hoveredAction === `pause-${idx}` && (
                        <div className="absolute z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 left-16 -top-8 whitespace-nowrap">
                          Pause Campaign
                        </div>
                      )}
                      {hoveredAction === `play-${idx}` && (
                        <div className="absolute z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 left-16 -top-8 whitespace-nowrap">
                          Activate Campaign
                        </div>
                      )}
                      
                      <button 
                        className="text-gray-500 hover:text-red-600 transition-colors" 
                        title="Delete Campaign"
                        onMouseEnter={() => setHoveredAction(`delete-${idx}`)}
                        onMouseLeave={() => setHoveredAction(null)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                      {hoveredAction === `delete-${idx}` && (
                        <div className="absolute z-10 bg-gray-800 text-white text-xs rounded py-1 px-2 left-24 -top-8 whitespace-nowrap">
                          Delete Campaign
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AIBudgetOptimizer
        isOpen={isOptimizerOpen}
        onClose={() => setIsOptimizerOpen(false)}
      />
    </div>
  );
} 