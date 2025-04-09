'use client'

import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import { AlertTriangle, Lock, MapPin, RefreshCw, Search, Shield } from 'lucide-react'
import { useState } from 'react'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const users = [
  { 
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    twoFactorEnabled: true,
    method: 'Google Authenticator',
    lastUsed: '2024-03-20 15:30:45',
    status: 'active'
  },
  { 
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    twoFactorEnabled: true,
    method: 'SMS',
    lastUsed: '2024-03-20 14:25:12',
    status: 'active'
  },
  { 
    id: 3,
    name: 'Mike Johnson',
    email: 'mike@example.com',
    twoFactorEnabled: false,
    method: 'None',
    lastUsed: 'Never',
    status: 'pending'
  }
]

const suspiciousLogins = [
  { 
    id: 1,
    user: 'john@example.com',
    timestamp: '2024-03-20 15:30:45',
    location: 'Mumbai, India',
    device: 'iPhone 12',
    ip: '192.168.1.100',
    status: 'blocked'
  },
  { 
    id: 2,
    user: 'jane@example.com',
    timestamp: '2024-03-20 14:25:12',
    location: 'London, UK',
    device: 'Chrome Windows',
    ip: '192.168.1.101',
    status: 'allowed'
  }
]

export default function TwoFactorAuthentication() {
  const [enforce2FA, setEnforce2FA] = useState(true)
  const [defaultMethod, setDefaultMethod] = useState('google')
  const [searchTerm, setSearchTerm] = useState('')
  const [settings, setSettings] = useState({
    requireForLogin: true,
    requireForWithdrawal: true,
    requireForTrading: false,
    requireForSettings: true,
    allowMultipleMethods: true
  })
  const [securityAlerts, setSecurityAlerts] = useState({
    newDevice: true,
    unusualLocation: true,
    failedAttempts: true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Two-Factor Authentication</h1>
          <p className="text-gray-500 mt-1">Manage 2FA settings and user authentication methods</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Enforce 2FA</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={enforce2FA}
                onChange={(e) => setEnforce2FA(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* 2FA Configuration */}
        <div className="col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-medium">2FA Methods</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Method</label>
                <select 
                  value={defaultMethod}
                  onChange={(e) => setDefaultMethod(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="google">Google Authenticator</option>
                  <option value="sms">SMS Authentication</option>
                  <option value="email">Email OTP</option>
                  <option value="security_key">Security Key</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">Required For</label>
                {Object.entries(settings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setSettings({...settings, [key]: e.target.checked})}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <h2 className="text-lg font-medium">Security Alerts</h2>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">New Device Login</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityAlerts.newDevice}
                    onChange={(e) => setSecurityAlerts({...securityAlerts, newDevice: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Unusual Location</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityAlerts.unusualLocation}
                    onChange={(e) => setSecurityAlerts({...securityAlerts, unusualLocation: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Failed Attempts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={securityAlerts.failedAttempts}
                    onChange={(e) => setSecurityAlerts({...securityAlerts, failedAttempts: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* User 2FA Status */}
        <div className="col-span-2 bg-white p-6 rounded-lg border">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-green-500" />
              <h2 className="text-lg font-medium">User 2FA Status</h2>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 pr-4 py-1.5 border rounded-lg text-sm"
                />
              </div>
              <select className="px-3 py-1.5 border rounded-lg text-sm">
                <option value="all">All Status</option>
                <option value="enabled">2FA Enabled</option>
                <option value="disabled">2FA Disabled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">2FA Status</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Last Used</th>
                  <th className="py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="py-3 px-4">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        user.twoFactorEnabled 
                          ? 'bg-green-50 text-green-600' 
                          : 'bg-red-50 text-red-600'
                      }`}>
                        {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{user.method}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{user.lastUsed}</td>
                    <td className="py-3 px-4">
                      <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2">
                        <RefreshCw className="w-4 h-4" />
                        Reset 2FA
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Suspicious Logins */}
        <div className="col-span-3 bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-red-500" />
            <h2 className="text-lg font-medium">Suspicious Login Attempts</h2>
          </div>

          <div className="space-y-3">
            {suspiciousLogins.map((login) => (
              <div key={login.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-4">
                  <AlertTriangle className={`w-5 h-5 ${
                    login.status === 'blocked' ? 'text-red-500' : 'text-yellow-500'
                  }`} />
                  <div>
                    <div className="font-medium">{login.user}</div>
                    <div className="text-sm text-gray-500">
                      {login.device} • {login.location} • {login.ip}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">{login.timestamp}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    login.status === 'blocked' 
                      ? 'bg-red-50 text-red-600' 
                      : 'bg-green-50 text-green-600'
                  }`}>
                    {login.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
