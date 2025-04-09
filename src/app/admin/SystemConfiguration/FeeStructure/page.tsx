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
import { ArrowUpDown, DollarSign, Eye, Save, Settings, Users, Wallet } from 'lucide-react'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'

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

const volumeTiers = [
  { volume: '0-10,000', maker: 0.2, taker: 0.2 },
  { volume: '10,000-50,000', maker: 0.16, taker: 0.18 },
  { volume: '50,000-100,000', maker: 0.14, taker: 0.16 },
  { volume: '100,000-500,000', maker: 0.12, taker: 0.14 },
  { volume: '500,000+', maker: 0.1, taker: 0.12 }
]

const feeChartData = {
  labels: ['0', '10K', '50K', '100K', '500K', '1M'],
  datasets: [
    {
      label: 'Maker Fee',
      data: [0.2, 0.16, 0.14, 0.12, 0.1, 0.1],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    },
    {
      label: 'Taker Fee',
      data: [0.2, 0.18, 0.16, 0.14, 0.12, 0.12],
      borderColor: 'rgb(239, 68, 68)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      tension: 0.4,
      fill: true
    }
  ]
}

const vipTiers = [
  { name: 'VIP 1', tradingVolume: '100,000+', makerFee: 0.15, takerFee: 0.17 },
  { name: 'VIP 2', tradingVolume: '500,000+', makerFee: 0.12, takerFee: 0.14 },
  { name: 'VIP 3', tradingVolume: '1,000,000+', makerFee: 0.1, takerFee: 0.12 }
]

export default function FeeStructure() {
  const [marketFees, setMarketFees] = useState({
    spot: { maker: 0.2, taker: 0.2 },
    futures: { maker: 0.18, taker: 0.2 },
    options: { maker: 0.15, taker: 0.18 },
    crypto: { maker: 0.2, taker: 0.2 },
    stocks: { maker: 0.15, taker: 0.18 }
  })

  const [transactionFees, setTransactionFees] = useState({
    deposit: { percentage: 0, fixed: 0, min: 0, max: 1000 },
    withdrawal: { percentage: 0.1, fixed: 2, min: 5, max: 1000 }
  })

  const [referralSettings, setReferralSettings] = useState({
    level1: 30,
    level2: 20,
    level3: 10,
    minVolume: 1000
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fee Structure Management</h1>
          <p className="text-gray-500 mt-1">Configure trading fees, commissions, and special rates</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Preview Changes
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Market Trading Fees */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-medium">Market Trading Fees</h2>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-left border-b">
                <th className="py-3">Market</th>
                <th className="py-3 text-right">Maker Fee (%)</th>
                <th className="py-3 text-right">Taker Fee (%)</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(marketFees).map(([market, fees]) => (
                <tr key={market} className="border-b">
                  <td className="py-3 capitalize">{market}</td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={fees.maker}
                      onChange={(e) => setMarketFees({
                        ...marketFees,
                        [market]: { ...fees, maker: Number(e.target.value) }
                      })}
                      className="w-20 px-2 py-1 border rounded text-right ml-auto"
                      step="0.01"
                    />
                  </td>
                  <td className="py-3">
                    <input
                      type="number"
                      value={fees.taker}
                      onChange={(e) => setMarketFees({
                        ...marketFees,
                        [market]: { ...fees, taker: Number(e.target.value) }
                      })}
                      className="w-20 px-2 py-1 border rounded text-right ml-auto"
                      step="0.01"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Volume-Based Fee Tiers */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpDown className="w-5 h-5 text-green-500" />
            <h2 className="text-lg font-medium">Volume-Based Fee Tiers</h2>
          </div>

          <div className="h-[300px]">
            <Line 
              data={feeChartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'top' as const,
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        return `${context.dataset.label}: ${context.raw}%`;
                      }
                    }
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `${value}%`
                    }
                  }
                }
              }}
            />
          </div>

          <div className="mt-4">
            <table className="w-full">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">30-Day Volume</th>
                  <th className="py-2 text-right">Maker Fee</th>
                  <th className="py-2 text-right">Taker Fee</th>
                </tr>
              </thead>
              <tbody>
                {volumeTiers.map((tier) => (
                  <tr key={tier.volume} className="border-b">
                    <td className="py-2">₹{tier.volume}</td>
                    <td className="py-2 text-right">{tier.maker}%</td>
                    <td className="py-2 text-right">{tier.taker}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Transaction Fees */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Wallet className="w-5 h-5 text-purple-500" />
            <h2 className="text-lg font-medium">Transaction Fees</h2>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">Deposit Fees</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Percentage Fee</label>
                  <input
                    type="number"
                    value={transactionFees.deposit.percentage}
                    onChange={(e) => setTransactionFees({
                      ...transactionFees,
                      deposit: { ...transactionFees.deposit, percentage: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Fixed Fee</label>
                  <input
                    type="number"
                    value={transactionFees.deposit.fixed}
                    onChange={(e) => setTransactionFees({
                      ...transactionFees,
                      deposit: { ...transactionFees.deposit, fixed: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-2">Withdrawal Fees</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Percentage Fee</label>
                  <input
                    type="number"
                    value={transactionFees.withdrawal.percentage}
                    onChange={(e) => setTransactionFees({
                      ...transactionFees,
                      withdrawal: { ...transactionFees.withdrawal, percentage: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                    step="0.01"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Fixed Fee</label>
                  <input
                    type="number"
                    value={transactionFees.withdrawal.fixed}
                    onChange={(e) => setTransactionFees({
                      ...transactionFees,
                      withdrawal: { ...transactionFees.withdrawal, fixed: Number(e.target.value) }
                    })}
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referral Program */}
        <div className="bg-white p-6 rounded-lg border">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-medium">Referral Program</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(referralSettings).map(([level, value]) => (
              <div key={level}>
                <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                  {level.replace(/([A-Z])/g, ' $1').trim()}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    value={value}
                    onChange={(e) => setReferralSettings({
                      ...referralSettings,
                      [level]: Number(e.target.value)
                    })}
                    className="flex-1"
                    min="0"
                    max={level === 'minVolume' ? 10000 : 100}
                  />
                  <span className="w-16 text-right">
                    {level === 'minVolume' ? `₹${value}` : `${value}%`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* VIP Tiers */}
      <div className="bg-white p-6 rounded-lg border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-500" />
            <h2 className="text-lg font-medium">VIP Tiers</h2>
          </div>
          <button className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50">
            Add New Tier
          </button>
        </div>

        <table className="w-full">
          <thead>
            <tr className="text-left border-b">
              <th className="py-3 px-4">Tier Level</th>
              <th className="py-3 px-4">Required Volume</th>
              <th className="py-3 px-4 text-right">Maker Fee</th>
              <th className="py-3 px-4 text-right">Taker Fee</th>
            </tr>
          </thead>
          <tbody>
            {vipTiers.map((tier) => (
              <tr key={tier.name} className="border-b">
                <td className="py-3 px-4 font-medium">{tier.name}</td>
                <td className="py-3 px-4">₹{tier.tradingVolume}</td>
                <td className="py-3 px-4 text-right">{tier.makerFee}%</td>
                <td className="py-3 px-4 text-right">{tier.takerFee}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

