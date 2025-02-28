"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon, ArrowPathIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { usePageTitle } from '@/lib/context/PageTitleContext';

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

interface ChannelConfig {
  name: string;
  displayName: string;
  connected: boolean;
  lastRefreshed: string;
  apiKey: string;
  accountId: string;
  campaignCount: number;
  status: 'healthy' | 'warning' | 'error';
}

export default function ChannelConfigPage() {
  const { setPageTitle } = usePageTitle();
  
  useEffect(() => {
    setPageTitle('Channel Configuration');
  }, [setPageTitle]);

  const [channels, setChannels] = useState<ChannelConfig[]>([
    {
      name: 'meta',
      displayName: 'Meta',
      connected: true,
      lastRefreshed: '2023-02-25T14:30:00Z',
      apiKey: '••••••••••••••••',
      accountId: '67890123456',
      campaignCount: 12,
      status: 'healthy'
    },
    {
      name: 'linkedin',
      displayName: 'LinkedIn',
      connected: true,
      lastRefreshed: '2023-02-25T12:15:00Z',
      apiKey: '••••••••••••••••',
      accountId: '45678901234',
      campaignCount: 8,
      status: 'warning'
    },
    {
      name: 'google',
      displayName: 'Google Ads',
      connected: true,
      lastRefreshed: '2023-02-25T10:45:00Z',
      apiKey: '••••••••••••••••',
      accountId: '34567890123',
      campaignCount: 15,
      status: 'healthy'
    },
    {
      name: 'twitter',
      displayName: 'Twitter',
      connected: false,
      lastRefreshed: '2023-02-24T09:20:00Z',
      apiKey: '',
      accountId: '',
      campaignCount: 0,
      status: 'error'
    },
    {
      name: 'quora',
      displayName: 'Quora',
      connected: true,
      lastRefreshed: '2023-02-25T08:30:00Z',
      apiKey: '••••••••••••••••',
      accountId: '23456789012',
      campaignCount: 5,
      status: 'healthy'
    },
    {
      name: 'reddit',
      displayName: 'Reddit',
      connected: false,
      lastRefreshed: '2023-02-23T16:10:00Z',
      apiKey: '',
      accountId: '',
      campaignCount: 0,
      status: 'error'
    }
  ]);

  const [selectedChannel, setSelectedChannel] = useState<ChannelConfig | null>(null);
  
  const refreshChannel = (channelName: string) => {
    setChannels(prevChannels => 
      prevChannels.map(channel => 
        channel.name === channelName 
          ? { ...channel, lastRefreshed: new Date().toISOString() } 
          : channel
      )
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Ad Channel Configuration</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-black rounded-md text-white">
          <ArrowPathIcon className="h-5 w-5" />
          Refresh All Channels
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {channels.map((channel) => (
          <div key={channel.name} className="bg-white rounded-lg shadow p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 relative">
                  <Image
                    src={getChannelIconPath(channel.name)}
                    alt={`${channel.displayName} logo`}
                    width={40}
                    height={40}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{channel.displayName}</h3>
                  <div className="flex items-center gap-1 mt-1">
                    {channel.connected ? (
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircleIcon className="h-4 w-4 text-red-500" />
                    )}
                    <span className="text-sm text-gray-600">
                      {channel.connected ? 'Connected' : 'Disconnected'}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`flex items-center gap-1 ${getStatusColor(channel.status)}`}>
                <div className={`h-2 w-2 rounded-full bg-current`}></div>
                <span className="capitalize text-sm">{channel.status}</span>
              </div>
            </div>

            <div className="space-y-3 text-sm mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Last refreshed:</span>
                <span>{formatDate(channel.lastRefreshed)}</span>
              </div>
              {channel.connected && (
                <>
                  <div className="flex justify-between">
                    <span className="text-gray-600">API Key:</span>
                    <span>{channel.apiKey}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account ID:</span>
                    <span>{channel.accountId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Active campaigns:</span>
                    <span>{channel.campaignCount}</span>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-between gap-2">
              <button
                className="flex items-center justify-center gap-1 flex-1 px-3 py-2 bg-gray-100 rounded-md text-gray-700 text-sm hover:bg-gray-200"
                onClick={() => refreshChannel(channel.name)}
              >
                <ArrowPathIcon className="h-4 w-4" />
                Refresh
              </button>
              <button
                className="flex items-center justify-center gap-1 flex-1 px-3 py-2 bg-gray-100 rounded-md text-gray-700 text-sm hover:bg-gray-200"
                onClick={() => setSelectedChannel(channel)}
              >
                <Cog6ToothIcon className="h-4 w-4" />
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedChannel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Configure {selectedChannel.displayName}</h2>
              <button 
                onClick={() => setSelectedChannel(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Connection Status</label>
                <div className="flex items-center mt-1">
                  <button className={`relative inline-flex h-6 w-11 items-center rounded-full ${selectedChannel.connected ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${selectedChannel.connected ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {selectedChannel.connected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700">API Key</label>
                <input
                  type="text"
                  id="apiKey"
                  value={selectedChannel.apiKey}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Enter API Key"
                />
              </div>

              <div>
                <label htmlFor="accountId" className="block text-sm font-medium text-gray-700">Account ID</label>
                <input
                  type="text"
                  id="accountId"
                  value={selectedChannel.accountId}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                  placeholder="Enter Account ID"
                />
              </div>

              <div>
                <label htmlFor="rate-limit" className="block text-sm font-medium text-gray-700">Daily API Rate Limit</label>
                <select
                  id="rate-limit"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  <option>10,000 requests</option>
                  <option>20,000 requests</option>
                  <option>50,000 requests</option>
                  <option>100,000 requests</option>
                </select>
              </div>

              <div>
                <label htmlFor="sync-frequency" className="block text-sm font-medium text-gray-700">Sync Frequency</label>
                <select
                  id="sync-frequency"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                >
                  <option>Hourly</option>
                  <option>Every 6 hours</option>
                  <option>Daily</option>
                  <option>Weekly</option>
                </select>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setSelectedChannel(null)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 