"use client";

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { usePageTitle } from '@/lib/context/PageTitleContext';
import dynamic from 'next/dynamic';
// Import Heroicons
import { 
  Cog6ToothIcon, 
  ArrowPathIcon, 
  AdjustmentsHorizontalIcon, 
  EyeIcon, 
  DocumentChartBarIcon,
  ScaleIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowDownTrayIcon,
  ClockIcon,
  InformationCircleIcon,
  BellAlertIcon,
  WrenchScrewdriverIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { 
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center text-gray-500 dark:text-gray-400">
        <p>Loading visualization...</p>
      </div>
    </div>
  )
});

// Custom styles to hide scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

export default function LeadRoutingDashboard() {
  const { setPageTitle } = usePageTitle();
  const [dateRange, setDateRange] = useState('Last 30 days');
  const [isMounted, setIsMounted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  useEffect(() => {
    setPageTitle('Lead Routing Dashboard');
    setIsMounted(true);
    
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    
    // Listen for theme changes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          const isDark = document.documentElement.classList.contains('dark');
          setIsDarkMode(isDark);
        }
      });
    });
    
    observer.observe(document.documentElement, { attributes: true });
    
    return () => observer.disconnect();
  }, [setPageTitle]);

  // Define Sankey diagram data
  const sankeyData = [{
    type: "sankey",
    orientation: "h",
    arrangement: "snap",
    node: {
      pad: 10,
      thickness: 15,
      line: {
        color: isDarkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)",
        width: 0.5
      },
      label: [
        "LinkedIn Ads", "Google Search", "Email Campaigns", "Referral Partners", 
        "Content Marketing", "MQLs", "SQLs", "Opportunities", "Closed Won", "Closed Lost"
      ],
      color: [
        "#4f46e5", "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", 
        "#ec4899", "#f43f5e", "#10b981", "#16a34a", "#ef4444"
      ],
      hoverlabel: {
        bgcolor: isDarkMode ? '#1f2937' : '#ffffff',
        bordercolor: isDarkMode ? '#374151' : '#e5e7eb',
        font: {
          color: isDarkMode ? '#f3f4f6' : '#1f2937',
          size: 10
        }
      }
    },
    link: {
      source: [
        // Sources to MQLs
        0, 1, 2, 3, 4,
        // MQLs to SQLs
        5, 5, 5,
        // SQLs to Opportunities
        6, 6,
        // Opportunities to Closed Won/Lost
        7, 7
      ],
      target: [
        // To MQLs
        5, 5, 5, 5, 5,
        // To SQLs
        6, 9, 9,
        // To Opportunities
        7, 9,
        // To Closed Won/Lost
        8, 9
      ],
      value: [
        // Lead volumes by source to MQLs
        320, 250, 180, 90, 120,
        // MQLs to SQLs and disqualified
        580, 230, 150,
        // SQLs to Opportunities and disqualified
        430, 150,
        // Opportunities to Closed Won/Lost
        280, 150
      ],
      color: [
        // Colors for links matching their source with transparency
        "rgba(79, 70, 229, 0.6)", "rgba(59, 130, 246, 0.6)", "rgba(99, 102, 241, 0.6)", 
        "rgba(139, 92, 246, 0.6)", "rgba(168, 85, 247, 0.6)",
        "rgba(236, 72, 153, 0.6)", "rgba(236, 72, 153, 0.4)", "rgba(236, 72, 153, 0.4)",
        "rgba(244, 63, 94, 0.6)", "rgba(244, 63, 94, 0.4)",
        "rgba(16, 185, 129, 0.6)", "rgba(16, 185, 129, 0.4)"
      ],
      hoverinfo: "all",
      hovertemplate: 
        "<b>%{source.label}</b> → <b>%{target.label}</b><br>" +
        "Volume: <b>%{value}</b> leads<br>" +
        "<extra></extra>"
    }
  }];

  // Layout configuration for the Sankey diagram
  const sankeyLayout = {
    title: "",
    font: {
      size: 10,
      family: "Inter, system-ui, sans-serif",
      color: isDarkMode ? "#e5e7eb" : "#4b5563"
    },
    autosize: true,
    margin: {
      l: 5,
      r: 5,
      b: 5,
      t: 5,
      pad: 0
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    hoverlabel: {
      bgcolor: isDarkMode ? '#1f2937' : '#ffffff',
      bordercolor: isDarkMode ? '#374151' : '#e5e7eb',
      font: {
        family: "Inter, system-ui, sans-serif",
      }
    }
  };

  // Configuration for the plot
  const sankeyConfig = {
    displayModeBar: false,
    responsive: true,
    staticPlot: false
  };

  return (
    <div className="bg-white dark:bg-gray-900 p-2 h-full w-full flex flex-col gap-2 overflow-y-auto text-xs">
      {/* Add style for scrollbar hiding */}
      <style jsx global>{scrollbarHideStyles}</style>
      
      {/* Fixed-height container to avoid ticker from expanding */}
      <div className="flex-shrink-0">
        {/* New Ticker-Style Band */}
        <div className="bg-black text-white h-7 rounded flex items-center overflow-hidden mb-1 w-full">
          {/* Inline heading */}
          <div className="bg-gray-800 h-full px-2 flex items-center whitespace-nowrap shrink-0">
            <span className="font-semibold text-xs">Recent Lead Routing</span>
          </div>
          
          <div className="flex-1 overflow-x-auto whitespace-nowrap scrollbar-hide px-2 min-w-0 max-w-full">
            <div className="inline-flex items-center gap-4 w-max">
              <div className="flex items-center gap-1 shrink-0">
                <ClockIcon className="w-3 h-3 text-blue-400" />
                <span className="font-medium">Acme Corp</span>
                <span className="text-gray-400">→ Sarah Johnson (just now)</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ClockIcon className="w-3 h-3 text-indigo-400" />
                <span className="font-medium">TechGrowth Inc</span>
                <span className="text-gray-400">→ Mike Reynolds (23m ago)</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ClockIcon className="w-3 h-3 text-purple-400" />
                <span className="font-medium">Global Solutions</span>
                <span className="text-gray-400">→ Lisa Chen (1h ago)</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ClockIcon className="w-3 h-3 text-green-400" />
                <span className="font-medium">Quantum Dynamics</span>
                <span className="text-gray-400">→ John Smith (2h ago)</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <ClockIcon className="w-3 h-3 text-yellow-400" />
                <span className="font-medium">Stellar Systems</span>
                <span className="text-gray-400">→ Alex Torres (3h ago)</span>
              </div>
            </div>
          </div>
          
          <div className="shrink-0 flex items-center bg-gray-800 h-full px-3">
            <Link href="#" className="text-blue-400 hover:text-blue-300 text-[10px] font-medium flex items-center">
              See All
              <ChevronRightIcon className="w-3 h-3 ml-0.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Top Section - Combined Header with KPI Cards */}
      <div className="bg-gray-50 dark:bg-gray-800 p-2 rounded-lg shadow flex-shrink-0">
        <div className="flex flex-wrap justify-between items-center mb-2">
          {/* Date Range Selector */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-600 dark:text-gray-400">Period:</span>
            <select 
              value={dateRange} 
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-0.5 text-xs focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last quarter">Last quarter</option>
              <option value="Year to date">Year to date</option>
              <option value="Custom">Custom</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="px-1.5 py-0.5 rounded bg-black text-white text-xs border border-gray-600 hover:bg-gray-800">
              Export Data
            </button>
            <button className="px-1.5 py-0.5 rounded bg-gray-300 text-gray-700 text-xs border border-gray-400 hover:bg-gray-400">
              Schedule Report
            </button>
          </div>
        </div>
        
        {/* KPI Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Routed Leads with Sparkline */}
          <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow transition-shadow hover:shadow-md">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">Routed Leads</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">1,824</span>
              <div className="h-5 w-10 shrink-0 bg-gray-100 dark:bg-gray-600 rounded flex items-end">
                {/* Simplified sparkline */}
                <div className="h-1 bg-gray-500 w-1.5 mx-px rounded-sm"></div>
                <div className="h-2 bg-gray-500 w-1.5 mx-px rounded-sm"></div>
                <div className="h-3 bg-gray-500 w-1.5 mx-px rounded-sm"></div>
                <div className="h-2 bg-gray-500 w-1.5 mx-px rounded-sm"></div>
                <div className="h-4 bg-gray-500 w-1.5 mx-px rounded-sm"></div>
                <div className="h-5 bg-gray-500 w-1.5 mx-px rounded-sm"></div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">+12.5%</p>
          </div>
          
          {/* Avg Response Time with Gauge */}
          <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow transition-shadow hover:shadow-md">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">Avg Response Time</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">3.2h</span>
              <div className="relative h-5 w-10 shrink-0 bg-gray-100 dark:bg-gray-600 rounded-full overflow-hidden">
                <div className="absolute top-0 left-0 bottom-0 w-2/3 bg-gray-500 rounded-full"></div>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">-0.8h from goal</p>
          </div>
          
          {/* Pipeline Impact */}
          <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow transition-shadow hover:shadow-md">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">Pipeline Impact</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">$2.4M</span>
              <div className="text-gray-500 dark:text-gray-400 font-bold">↑ 18%</div>
            </div>
            <p className="text-gray-600 dark:text-gray-400">142% of target</p>
          </div>
          
          {/* Attribution Coverage with Radial Progress */}
          <div className="bg-white dark:bg-gray-700 p-2 rounded-lg shadow transition-shadow hover:shadow-md">
            <h3 className="text-gray-500 dark:text-gray-400 font-medium">Attribution Coverage</h3>
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold">86%</span>
              <div className="relative h-6 w-6">
                <div className="absolute inset-0 rounded-full border-3 border-gray-200 dark:border-gray-600"></div>
                <div className="absolute inset-0 rounded-full border-3 border-gray-500 border-r-transparent border-b-transparent" style={{ transform: 'rotate(45deg)' }}></div>
              </div>

            </div>
            <p className="text-gray-600 dark:text-gray-400">+6% MoM</p>
          </div>
        </div>
      </div>
      
      {/* Center Section (2/3 - 1/3 split) */}
      <div className="flex flex-col lg:flex-row gap-2 min-h-0 flex-1 overflow-hidden">
        {/* Left (2/3) */}
        <div className="w-full lg:w-2/3 min-w-0 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg shadow flex flex-col overflow-hidden">
          {/* Interactive filter bar */}
          <div className="flex flex-wrap gap-1 mb-1">
            <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-0.5 text-xs">
              <option>All Campaigns</option>
              <option>Email Campaigns</option>
              <option>Social Campaigns</option>
              <option>PPC Campaigns</option>
            </select>
            <select className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-0.5 text-xs">
              <option>All Teams</option>
              <option>Enterprise</option>
              <option>Mid-Market</option>
              <option>SMB</option>
            </select>
            <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-0.5 text-xs hover:bg-gray-100 dark:hover:bg-gray-600">
              More Filters
            </button>
          </div>
          
          {/* Sankey Flow Diagram */}
          <div className="bg-white dark:bg-gray-700 p-2 rounded-lg mb-1 h-64 overflow-hidden">
            <div className="flex justify-between items-center mb-2">
              <p className="font-medium text-sm text-gray-600 dark:text-gray-300">
                Campaign Source → Closed Deals Flow
              </p>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                Showing {dateRange.toLowerCase()} data • 960 total leads
              </div>
            </div>
            {isMounted && (
              <div className="h-52 w-full overflow-hidden">
                <Plot
                  data={sankeyData}
                  layout={sankeyLayout}
                  config={sankeyConfig}
                  useResizeHandler={true}
                  style={{ width: '100%', height: '100%' }}
                  className="w-full h-full"
                />
              </div>
            )}
          </div>
          
          {/* Campaign Performance Data Table */}
          <div className="flex-1 bg-white dark:bg-gray-700 rounded-lg overflow-hidden min-h-0">
            <div className="overflow-y-auto overflow-x-hidden h-full">
              <table className="w-full divide-y divide-gray-200 dark:divide-gray-600 table-fixed">
                <thead className="bg-gray-50 dark:bg-gray-800 sticky top-0">
                  <tr>
                    <th scope="col" className="px-3 py-1 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Campaign</th>
                    <th scope="col" className="px-3 py-1 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Spend</th>
                    <th scope="col" className="px-3 py-1 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Leads</th>
                    <th scope="col" className="px-3 py-1 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Conv.</th>
                    <th scope="col" className="px-3 py-1 text-left font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">ROAS</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
                    <td className="px-3 py-1 whitespace-nowrap font-medium overflow-hidden text-ellipsis">Q2 Product Launch</td>
                    <td className="px-3 py-1 whitespace-nowrap">$34,500</td>
                    <td className="px-3 py-1 whitespace-nowrap">345</td>
                    <td className="px-3 py-1 whitespace-nowrap">18.2%</td>
                    <td className="px-3 py-1 whitespace-nowrap text-green-600 dark:text-green-400">3.8x</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
                    <td className="px-3 py-1 whitespace-nowrap font-medium overflow-hidden text-ellipsis">Enterprise Email Sequence</td>
                    <td className="px-3 py-1 whitespace-nowrap">$12,800</td>
                    <td className="px-3 py-1 whitespace-nowrap">215</td>
                    <td className="px-3 py-1 whitespace-nowrap">9.4%</td>
                    <td className="px-3 py-1 whitespace-nowrap text-green-600 dark:text-green-400">2.1x</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
                    <td className="px-3 py-1 whitespace-nowrap font-medium overflow-hidden text-ellipsis">LinkedIn Ads - Decision Makers</td>
                    <td className="px-3 py-1 whitespace-nowrap">$28,900</td>
                    <td className="px-3 py-1 whitespace-nowrap">182</td>
                    <td className="px-3 py-1 whitespace-nowrap">12.1%</td>
                    <td className="px-3 py-1 whitespace-nowrap text-green-600 dark:text-green-400">2.6x</td>
                  </tr>
                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
                    <td className="px-3 py-1 whitespace-nowrap font-medium overflow-hidden text-ellipsis">Partner Co-Marketing</td>
                    <td className="px-3 py-1 whitespace-nowrap">$8,500</td>
                    <td className="px-3 py-1 whitespace-nowrap">94</td>
                    <td className="px-3 py-1 whitespace-nowrap">22.3%</td>
                    <td className="px-3 py-1 whitespace-nowrap text-green-600 dark:text-green-400">4.2x</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Right (1/3) */}
        <div className="w-full lg:w-1/3 min-w-0 bg-gray-50 dark:bg-gray-800 p-2 rounded-lg shadow flex flex-col gap-2 overflow-hidden">
          {/* Right Panel Header */}
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-sm text-gray-700 dark:text-gray-300">Routing & Insights</h2>
            <div className="flex gap-1">
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Settings">
                <Cog6ToothIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
              <button className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors" title="Refresh Data">
                <ArrowPathIcon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Quick Actions Strip */}
          <div className="flex gap-1 mb-1">
            <button className="flex-1 text-gray-700 dark:text-gray-400 p-1.5 rounded flex items-center justify-center gap-1 transition-colors border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" title="Configure Routing Rules">
              <AdjustmentsHorizontalIcon className="w-3.5 h-3.5" />
              <span className="text-xs">Rules</span>
            </button>
            <button className="flex-1 text-gray-700 dark:text-gray-400 p-1.5 rounded flex items-center justify-center gap-1 transition-colors border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" title="Review Pending Leads">
              <EyeIcon className="w-3.5 h-3.5" />
              <span className="text-xs">Review</span>
              <span className="bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200 px-1 rounded-full text-[10px]">12</span>
            </button>
            <button className="flex-1 text-gray-700 dark:text-gray-400 p-1.5 rounded flex items-center justify-center gap-1 transition-colors border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700" title="Generate Report">
              <DocumentChartBarIcon className="w-3.5 h-3.5" />
              <span className="text-xs">Report</span>
            </button>
          </div>

          {/* Content Tabs */}
          <div className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600 flex-1 min-w-0">
            <div className="flex border-b border-gray-200 dark:border-gray-600 px-2 pt-2 gap-2">
              <button className="px-2 py-1 text-xs font-medium border-b-2 border-black text-black dark:text-black">
                Overview
              </button>
              <button className="px-2 py-1 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                Details
              </button>
            </div>

            <div className="p-2 overflow-y-auto">
              {/* Lead Routing Rules Status Card */}
              <div className="mb-3">
                <h3 className="text-xs font-medium mb-1.5 text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <ScaleIcon className="w-3.5 h-3.5" />
                  Lead Routing Rules
                </h3>
                <div className="grid grid-cols-2 gap-1">
                  <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Territory</span>
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Industry</span>
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Round-robin</span>
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800 p-1.5 rounded">
                    <div className="flex justify-between items-center">
                      <span className="text-xs">Lead scoring</span>
                      <span className="h-2 w-2 rounded-full bg-red-500"></span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Team Response Heatmap */}
              <div>
                <h3 className="text-xs font-medium mb-1.5 text-gray-600 dark:text-gray-300 flex items-center gap-1">
                  <ChartBarIcon className="w-3.5 h-3.5" />
                  Response Time by Team
                </h3>
                <div className="flex flex-col gap-1.5 min-w-0">
                  {/* Simplified heatmap visualization */}
                  <div className="flex items-center text-gray-600 dark:text-gray-400 min-w-0">
                    <span className="w-16 shrink-0 text-xs">Enterprise</span>
                    <div className="flex-1 grid grid-cols-7 gap-0.5 min-w-0">
                      <div className="h-4 bg-green-300 dark:bg-green-600 rounded"></div>
                      <div className="h-4 bg-green-400 dark:bg-green-700 rounded"></div>
                      <div className="h-4 bg-green-500 dark:bg-green-800 rounded"></div>
                      <div className="h-4 bg-yellow-400 dark:bg-yellow-600 rounded"></div>
                      <div className="h-4 bg-yellow-500 dark:bg-yellow-700 rounded"></div>
                      <div className="h-4 bg-red-400 dark:bg-red-600 rounded"></div>
                      <div className="h-4 bg-red-500 dark:bg-red-700 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 min-w-0">
                    <span className="w-16 shrink-0 text-xs">Mid-Market</span>
                    <div className="flex-1 grid grid-cols-7 gap-0.5 min-w-0">
                      <div className="h-4 bg-green-300 dark:bg-green-600 rounded"></div>
                      <div className="h-4 bg-green-400 dark:bg-green-700 rounded"></div>
                      <div className="h-4 bg-yellow-400 dark:bg-yellow-600 rounded"></div>
                      <div className="h-4 bg-yellow-500 dark:bg-yellow-700 rounded"></div>
                      <div className="h-4 bg-yellow-400 dark:bg-yellow-600 rounded"></div>
                      <div className="h-4 bg-green-400 dark:bg-green-700 rounded"></div>
                      <div className="h-4 bg-green-300 dark:bg-green-600 rounded"></div>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 min-w-0">
                    <span className="w-16 shrink-0 text-xs">SMB</span>
                    <div className="flex-1 grid grid-cols-7 gap-0.5 min-w-0">
                      <div className="h-4 bg-yellow-400 dark:bg-yellow-600 rounded"></div>
                      <div className="h-4 bg-green-300 dark:bg-green-600 rounded"></div>
                      <div className="h-4 bg-green-400 dark:bg-green-700 rounded"></div>
                      <div className="h-4 bg-green-500 dark:bg-green-800 rounded"></div>
                      <div className="h-4 bg-green-400 dark:bg-green-700 rounded"></div>
                      <div className="h-4 bg-yellow-400 dark:bg-yellow-600 rounded"></div>
                      <div className="h-4 bg-red-400 dark:bg-red-600 rounded"></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-gray-500 dark:text-gray-400 text-[9px]">
                    <span>Mon</span>
                    <span>Tue</span>
                    <span>Wed</span>
                    <span>Thu</span>
                    <span>Fri</span>
                    <span>Sat</span>
                    <span>Sun</span>
                  </div>
                </div>
              </div>

              {/* Key Statistics */}
              <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800/20 rounded-lg">
                <div className="flex justify-between items-center text-gray-800 dark:text-gray-300">
                  <div className="text-xs font-medium">Today's pending:</div>
                  <div className="font-bold">12 leads</div>
                </div>
                <div className="text-[10px] text-gray-600 dark:text-gray-400">Avg. age: 3.2 hours • Auto-route at 6pm</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 