'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DollarSign, RefreshCw, Search, TrendingUp } from 'lucide-react'
import { useState } from 'react'

interface Currency {
  code: string
  name: string
  type: 'fiat'
  symbol: string
  exchangeRate: number
  lastUpdated: string
  status: 'active' | 'disabled'
  depositLimit: {
    min: number
    max: number
  }
  withdrawalLimit: {
    min: number
    max: number
  }
  processingFee: {
    percentage: number
    fixed: number
  }
  balance: number
  volume24h: number
  paymentMethods: {
    name: string
    status: 'active' | 'disabled'
    processingTime: string
    minAmount: number
    maxAmount: number
    fee: {
      percentage: number
      fixed: number
    }
  }[]
}

const sampleCurrencies: Currency[] = [
  {
    code: 'INR',
    name: 'Indian Rupee',
    type: 'fiat',
    symbol: '₹',
    exchangeRate: 1,
    lastUpdated: '2024-03-26 15:30',
    status: 'active',
    depositLimit: { min: 100, max: 1000000 },
    withdrawalLimit: { min: 1000, max: 500000 },
    processingFee: { percentage: 1.5, fixed: 20 },
    balance: 15000000,
    volume24h: 2500000,
    paymentMethods: [
      {
        name: 'UPI',
        status: 'active',
        processingTime: 'Instant',
        minAmount: 100,
        maxAmount: 100000,
        fee: { percentage: 0.5, fixed: 0 }
      },
      {
        name: 'NEFT',
        status: 'active',
        processingTime: '2-4 hours',
        minAmount: 10000,
        maxAmount: 1000000,
        fee: { percentage: 0, fixed: 10 }
      },
      {
        name: 'IMPS',
        status: 'active',
        processingTime: 'Instant',
        minAmount: 1000,
        maxAmount: 500000,
        fee: { percentage: 0.2, fixed: 5 }
      },
      {
        name: 'Net Banking',
        status: 'active',
        processingTime: 'Instant',
        minAmount: 1000,
        maxAmount: 500000,
        fee: { percentage: 1, fixed: 0 }
      }
    ]
  }
]

export default function MultiCurrencyManagement() {
  const [currencies, setCurrencies] = useState<Currency[]>(sampleCurrencies)
  const [searchQuery, setSearchQuery] = useState('')
  const [editedCurrency, setEditedCurrency] = useState<Currency | null>(null)
  const [showUpdateRates, setShowUpdateRates] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const [showCurrencySettings, setShowCurrencySettings] = useState(false)
  const [showAddCurrency, setShowAddCurrency] = useState(false)

  const handleUpdateCurrency = (updatedCurrency: Currency) => {
    setCurrencies(prevCurrencies => 
      prevCurrencies.map(currency => 
        currency.code === updatedCurrency.code ? updatedCurrency : currency
      )
    )
    setShowCurrencySettings(false)
  }

  const handleUpdateRates = async () => {
    setShowUpdateRates(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      setCurrencies(prevCurrencies => 
        prevCurrencies.map(currency => ({
          ...currency,
          lastUpdated: new Date().toISOString().slice(0, 16).replace('T', ' ')
        }))
      )
    } finally {
      setShowUpdateRates(false)
    }
  }

  const getFilteredCurrencies = () => {
    return currencies.filter(currency => 
      currency.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      currency.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  const handlePaymentMethodUpdate = (
    methodName: string, 
    updates: Partial<Currency['paymentMethods'][0]>
  ) => {
    if (!editedCurrency) return

    setEditedCurrency({
      ...editedCurrency,
      paymentMethods: editedCurrency.paymentMethods.map(method =>
        method.name === methodName ? { ...method, ...updates } : method
      )
    })
  }

  const handleSaveChanges = () => {
    if (!editedCurrency) return
    setCurrencies(prevCurrencies =>
      prevCurrencies.map(currency =>
        currency.code === editedCurrency.code ? editedCurrency : currency
      )
    )
    setShowCurrencySettings(false)
    setEditedCurrency(null)
  }

  const handleSettingsOpen = (currency: Currency) => {
    setSelectedCurrency(currency)
    setEditedCurrency(currency)
    setShowCurrencySettings(true)
  }

  const AddCurrencyDialog = () => (
    <Dialog open={showAddCurrency} onOpenChange={setShowAddCurrency}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle>Add New Currency</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Currency Code</label>
              <input 
                type="text"
                placeholder="e.g. USD"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-gray-600">Currency Name</label>
              <input 
                type="text"
                placeholder="e.g. US Dollar"
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button 
              onClick={() => setShowAddCurrency(false)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Currency
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Multi-Currency Management</h1>
        <p className="text-gray-500 mt-1">Manage currencies, exchange rates, and limits</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Total Currencies</div>
          <div className="text-2xl font-bold text-blue-600 mt-1">15</div>
          <div className="text-xs text-gray-600 flex items-center gap-1 mt-1">
            <span>8 Fiat</span>
            <span>•</span>
            <span>7 Crypto</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">24h Volume (in INR)</div>
          <div className="text-2xl font-bold text-green-600 mt-1">₹25.8M</div>
          <div className="text-xs text-green-600 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            +12.5% from yesterday
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Active Wallets</div>
          <div className="text-2xl font-bold text-purple-600 mt-1">5,234</div>
        </div>
        <div className="bg-white p-4 rounded-lg border">
          <div className="text-sm text-gray-500">Pending Conversions</div>
          <div className="text-2xl font-bold text-orange-600 mt-1">28</div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="bg-white p-4 rounded-lg border space-y-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="search"
              placeholder="Search currencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <button 
            onClick={() => setShowAddCurrency(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            Add Currency
          </button>
          <button 
            onClick={handleUpdateRates}
            disabled={showUpdateRates}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${showUpdateRates ? 'animate-spin' : ''}`} />
            {showUpdateRates ? 'Updating...' : 'Update Rates'}
          </button>
        </div>
      </div>

      {/* Currencies Table */}
      <div className="bg-white rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4">Currency</th>
              <th className="text-right py-3 px-4">Exchange Rate (INR)</th>
              <th className="text-right py-3 px-4">Balance</th>
              <th className="text-right py-3 px-4">24h Volume</th>
              <th className="text-left py-3 px-4">Status</th>
              <th className="text-right py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {getFilteredCurrencies().map(currency => (
              <tr key={currency.code} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    <div>
                      <div className="font-medium">{currency.name}</div>
                      <div className="text-sm text-gray-500">{currency.code}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-medium">₹{currency.exchangeRate.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Updated: {currency.lastUpdated}</div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-medium">{currency.symbol}{currency.balance.toLocaleString()}</div>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="font-medium">{currency.symbol}{currency.volume24h.toLocaleString()}</div>
                </td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    currency.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {currency.status.toUpperCase()}
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <button 
                    onClick={() => handleSettingsOpen(currency)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Configure
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Currency Settings Dialog */}
      <Dialog open={showCurrencySettings} onOpenChange={setShowCurrencySettings}>
        <DialogContent className="max-w-2xl bg-white">
          <DialogHeader>
            <DialogTitle>Currency Settings - {selectedCurrency?.name}</DialogTitle>
            <DialogDescription>
              Configure currency limits, fees, and payment methods
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 space-y-6">
            {/* Limits */}
            <div>
              <h3 className="font-medium mb-3">Transaction Limits</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Minimum Deposit</label>
                  <input 
                    type="number"
                    value={editedCurrency?.depositLimit.min ?? selectedCurrency?.depositLimit.min}
                    onChange={(e) => setEditedCurrency(curr => curr ? {
                      ...curr,
                      depositLimit: { ...curr.depositLimit, min: Number(e.target.value) }
                    } : null)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Maximum Deposit</label>
                  <input 
                    type="number"
                    value={editedCurrency?.depositLimit.max ?? selectedCurrency?.depositLimit.max}
                    onChange={(e) => setEditedCurrency(curr => curr ? {
                      ...curr,
                      depositLimit: { ...curr.depositLimit, max: Number(e.target.value) }
                    } : null)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Minimum Withdrawal</label>
                  <input 
                    type="number"
                    value={editedCurrency?.withdrawalLimit.min ?? selectedCurrency?.withdrawalLimit.min}
                    onChange={(e) => setEditedCurrency(curr => curr ? {
                      ...curr,
                      withdrawalLimit: { ...curr.withdrawalLimit, min: Number(e.target.value) }
                    } : null)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Maximum Withdrawal</label>
                  <input 
                    type="number"
                    value={editedCurrency?.withdrawalLimit.max ?? selectedCurrency?.withdrawalLimit.max}
                    onChange={(e) => setEditedCurrency(curr => curr ? {
                      ...curr,
                      withdrawalLimit: { ...curr.withdrawalLimit, max: Number(e.target.value) }
                    } : null)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Processing Fees */}
            <div>
              <h3 className="font-medium mb-3">Processing Fees</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Percentage Fee (%)</label>
                  <input 
                    type="number"
                    value={editedCurrency?.processingFee.percentage ?? selectedCurrency?.processingFee.percentage}
                    onChange={(e) => setEditedCurrency(curr => curr ? {
                      ...curr,
                      processingFee: { ...curr.processingFee, percentage: Number(e.target.value) }
                    } : null)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-600">Fixed Fee</label>
                  <input 
                    type="number"
                    value={editedCurrency?.processingFee.fixed ?? selectedCurrency?.processingFee.fixed}
                    onChange={(e) => setEditedCurrency(curr => curr ? {
                      ...curr,
                      processingFee: { ...curr.processingFee, fixed: Number(e.target.value) }
                    } : null)}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Status */}
            <div>
              <h3 className="font-medium mb-3">Currency Status</h3>
              <select 
                value={editedCurrency?.status ?? selectedCurrency?.status}
                onChange={(e) => setEditedCurrency(curr => curr ? {
                  ...curr,
                  status: e.target.value as 'active' | 'disabled'
                } : null)}
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>

            {/* Payment Methods */}
            <div>
              <h3 className="font-medium mb-3">Payment Methods</h3>
              <div className="space-y-4">
                {editedCurrency?.paymentMethods.map((method, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-medium">{method.name}</div>
                      <select 
                        value={method.status}
                        onChange={(e) => handlePaymentMethodUpdate(
                          method.name,
                          { status: e.target.value as 'active' | 'disabled' }
                        )}
                        className="text-sm border rounded-lg px-2 py-1"
                      >
                        <option value="active">Active</option>
                        <option value="disabled">Disabled</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">Minimum Amount</label>
                        <input 
                          type="number"
                          value={method.minAmount}
                          onChange={(e) => handlePaymentMethodUpdate(
                            method.name,
                            { minAmount: Number(e.target.value) }
                          )}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">Maximum Amount</label>
                        <input 
                          type="number"
                          value={method.maxAmount}
                          onChange={(e) => handlePaymentMethodUpdate(
                            method.name,
                            { maxAmount: Number(e.target.value) }
                          )}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">Percentage Fee (%)</label>
                        <input 
                          type="number"
                          value={method.fee.percentage}
                          onChange={(e) => handlePaymentMethodUpdate(
                            method.name,
                            { fee: { ...method.fee, percentage: Number(e.target.value) } }
                          )}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm text-gray-600">Fixed Fee (₹)</label>
                        <input 
                          type="number"
                          value={method.fee.fixed}
                          onChange={(e) => handlePaymentMethodUpdate(
                            method.name,
                            { fee: { ...method.fee, fixed: Number(e.target.value) } }
                          )}
                          className="w-full px-3 py-2 border rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <button 
                onClick={() => {
                  setEditedCurrency(null)
                  setShowCurrencySettings(false)
                }}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={handleSaveChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AddCurrencyDialog />
    </div>
  )
}

