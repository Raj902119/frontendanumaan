'use client'

import { Bell, DollarSign, Globe, History, Save, Settings, Upload } from 'lucide-react'
import { useState } from 'react'

interface SettingChange {
  id: string
  user: string
  action: string
  setting: string
  oldValue: string
  newValue: string
  timestamp: string
}

const settingChanges: SettingChange[] = [
  {
    id: '1',
    user: 'admin@example.com',
    action: 'Updated',
    setting: 'Platform Name',
    oldValue: 'TradePro',
    newValue: 'TradePro Plus',
    timestamp: '2024-03-20 15:30:45'
  },
  {
    id: '2',
    user: 'system.admin@example.com',
    action: 'Modified',
    setting: 'Default Currency',
    oldValue: 'USD',
    newValue: 'INR',
    timestamp: '2024-03-20 14:25:12'
  },
  {
    id: '3',
    user: 'tech.lead@example.com',
    action: 'Enabled',
    setting: 'SMS Notifications',
    oldValue: 'Disabled',
    newValue: 'Enabled',
    timestamp: '2024-03-20 13:15:30'
  }
]

export default function PlatformSettings() {
  const [generalSettings, setGeneralSettings] = useState({
    platformName: 'TradePro Plus',
    supportEmail: 'support@tradepro.com',
    timezone: 'Asia/Kolkata',
    language: 'en',
    logo: '/logo.png'
  })

  const [currencySettings, setCurrencySettings] = useState({
    defaultFiat: 'INR',
    defaultCrypto: 'BTC',
    displayFormat: '₹###,###.##',
    exchangeRateProvider: 'CoinGecko'
  })

  const [tradingRules, setTradingRules] = useState({
    minOrderSize: 100,
    maxLeverage: 10,
    maintenanceMargin: 0.5,
    orderMatchingMode: 'price-time',
    priceTickSize: 0.01
  })

  const [notifications, setNotifications] = useState({
    enableEmailAlerts: true,
    enableSMSAlerts: true,
    enablePushNotifications: true,
    adminAlertThreshold: 'high',
    maintenanceNotices: true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Platform Settings</h1>
          <p className="text-gray-500 mt-1">Configure global platform parameters and preferences</p>
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-medium">General Settings</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Name</label>
              <input
                type="text"
                value={generalSettings.platformName}
                onChange={(e) => setGeneralSettings({...generalSettings, platformName: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Support Email</label>
              <input
                type="email"
                value={generalSettings.supportEmail}
                onChange={(e) => setGeneralSettings({...generalSettings, supportEmail: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Platform Logo</label>
              <div className="flex items-center gap-4">
                <img src={generalSettings.logo} alt="Logo" className="w-10 h-10 rounded" />
                <button className="px-3 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Upload New Logo
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <select 
                  value={generalSettings.timezone}
                  onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">America/New_York (EST)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select 
                  value={generalSettings.language}
                  onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi</option>
                  <option value="es">Spanish</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Currency Settings */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-medium">Currency Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Fiat</label>
                <select 
                  value={currencySettings.defaultFiat}
                  onChange={(e) => setCurrencySettings({...currencySettings, defaultFiat: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Crypto</label>
                <select 
                  value={currencySettings.defaultCrypto}
                  onChange={(e) => setCurrencySettings({...currencySettings, defaultCrypto: e.target.value})}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="USDT">Tether (USDT)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Display Format</label>
              <input
                type="text"
                value={currencySettings.displayFormat}
                onChange={(e) => setCurrencySettings({...currencySettings, displayFormat: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exchange Rate Provider</label>
              <select 
                value={currencySettings.exchangeRateProvider}
                onChange={(e) => setCurrencySettings({...currencySettings, exchangeRateProvider: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="CoinGecko">CoinGecko</option>
                <option value="Binance">Binance</option>
                <option value="CoinMarketCap">CoinMarketCap</option>
              </select>
            </div>
          </div>
        </div>

        {/* Trading Rules */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Globe className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-medium">Trading Rules</h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Order Size</label>
                <input
                  type="number"
                  value={tradingRules.minOrderSize}
                  onChange={(e) => setTradingRules({...tradingRules, minOrderSize: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Leverage</label>
                <input
                  type="number"
                  value={tradingRules.maxLeverage}
                  onChange={(e) => setTradingRules({...tradingRules, maxLeverage: Number(e.target.value)})}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Order Matching Mode</label>
              <select 
                value={tradingRules.orderMatchingMode}
                onChange={(e) => setTradingRules({...tradingRules, orderMatchingMode: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="price-time">Price-Time Priority</option>
                <option value="pro-rata">Pro-Rata</option>
                <option value="size-time">Size-Time Priority</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-medium">Notification Settings</h2>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">Email Alerts</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.enableEmailAlerts}
                  onChange={(e) => setNotifications({...notifications, enableEmailAlerts: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-gray-700">SMS Alerts</label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.enableSMSAlerts}
                  onChange={(e) => setNotifications({...notifications, enableSMSAlerts: e.target.checked})}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Admin Alert Threshold</label>
              <select 
                value={notifications.adminAlertThreshold}
                onChange={(e) => setNotifications({...notifications, adminAlertThreshold: e.target.value})}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="low">Low (All Events)</option>
                <option value="medium">Medium (Important Events)</option>
                <option value="high">High (Critical Events Only)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Change History */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-medium">Change History</h2>
          </div>
          <select className="px-3 py-2 border rounded-lg text-sm">
            <option value="all">All Changes</option>
            <option value="general">General Settings</option>
            <option value="currency">Currency Settings</option>
            <option value="trading">Trading Rules</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Setting</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Old Value</th>
                <th className="py-3 px-4">New Value</th>
              </tr>
            </thead>
            <tbody>
              {settingChanges.map((change) => (
                <tr key={change.id} className="border-b">
                  <td className="py-3 px-4 text-sm">{change.timestamp}</td>
                  <td className="py-3 px-4 text-sm">{change.user}</td>
                  <td className="py-3 px-4 text-sm font-medium">{change.setting}</td>
                  <td className="py-3 px-4 text-sm">{change.action}</td>
                  <td className="py-3 px-4 text-sm text-gray-500">{change.oldValue}</td>
                  <td className="py-3 px-4 text-sm text-blue-600">{change.newValue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

