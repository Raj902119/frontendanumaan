'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  CalendarDays, 
  Users, 
  WalletCards,
  AlertTriangle,
  FileText,
  BarChart2,
  Settings,
  ChevronDown,
  LucideIcon
} from 'lucide-react'

// Define interfaces for sidebar items
interface SidebarSubItem {
  label: string;
  href: string;
}

interface SidebarItemBase {
  icon: LucideIcon; // Use LucideIcon or React.ElementType
  label: string;
  href: string;
}

interface SidebarItemWithSubItems extends SidebarItemBase {
  subItems: SidebarSubItem[];
}

type SidebarItem = SidebarItemBase | SidebarItemWithSubItems;

const sidebarItems: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: CalendarDays, label: 'Event Management', href: '/admin/EventM' },
  { 
    icon: Users, 
    label: 'User Management', 
    href: '/admin/UserM',
    subItems: [
      { label: 'User Management', href: '/admin/UserM/UserManagement' },
      { label: 'User Listing', href: '/admin/UserM/listing' },
      { label: 'KYC Verification', href: '/admin/UserM/kyc' },
      { label: 'Account Management', href: '/admin/UserM/accounts' },
      { label: 'Bulk Action', href: '/admin/UserM/bulk' },
      { label: 'Trading History', href: '/admin/UserM/trading' },
      { label: 'Risk Management Flags', href: '/admin/UserM/risk' },
      { label: 'User Feedback & Support', href: '/admin/UserM/support' },
      { label: 'Referral Program', href: '/admin/UserM/referrals' },
    ]
  },
  { 
    icon: WalletCards, 
    label: 'Transaction Management', 
    href: '/admin/Transactions',
    subItems: [
      { label: 'Deposit/Withdrawal', href: '/admin/Transactions/DepWith' },
      { label: 'Dispute Management', href: '/admin/Transactions/Dispute' },
      { label: 'Transaction History', href: '/admin/Transactions/History' },
      { label: 'Multiple Currency', href: '/admin/Transactions/MultiCurrency' },
      { label: 'Payment Gateway', href: '/admin/Transactions/PayGate' }
    ]
  },
  { 
    icon: AlertTriangle, 
    label: 'Risk Management', 
    href: '/admin/RiskM',
    subItems: [
      { label: 'Suspicious Activity', href: '/admin/RiskM/SuspiAct' },
      { label: 'Position Limit', href: '/admin/RiskM/PosiLimit' },
      { label: 'Price Manipulation', href: '/admin/RiskM/PriceManipu' },
      { label: 'Behaviour Analysis', href: '/admin/RiskM/BehaviousAnalysis' },
      { label: 'Risk Alert', href: '/admin/RiskM/RishAlert' },
      { label: 'Market Volatility', href: '/admin/RiskM/MarketVolatility' }
    ]
  },
  { icon: FileText, label: 'Content Management', href: '/admin/content' },
  { 
    icon: BarChart2, 
    label: 'Analytics & Reporting', 
    href: '/admin/Ana&Rep',
    subItems: [
      { label: 'User Acquisition', href: '/admin/Ana&Rep/UserAcq' },
      { label: 'Trading Volume', href: '/admin/Ana&Rep/TradingVolume' },
      { label: 'Revenue Report', href: '/admin/Ana&Rep/RevenueReport' },
      { label: 'Event Performance', href: '/admin/Ana&Rep/EventPerformance' },
      { label: 'User Engagement', href: '/admin/Ana&Rep/UserEngagement' },
      { label: 'Platform Health', href: '/admin/Ana&Rep/PlatformHealth' },
      { label: 'Customer Reports', href: '/admin/Ana&Rep/CustomerReportGen' }
    ]
  },
  { 
    icon: Settings, 
    label: 'System Configuration', 
    href: '/admin/SystemConfiguration',
    subItems: [
      { label: 'User Role & Permissions', href: '/admin/SystemConfiguration/UserRolePer' },
      { label: '2FA Settings', href: '/admin/SystemConfiguration/2FA' },
      { label: 'API Configuration', href: '/admin/SystemConfiguration/APIconfig' },
      { label: 'Fee Structure', href: '/admin/SystemConfiguration/FeeStructure' },
      { label: 'Maintenance Mode', href: '/admin/SystemConfiguration/MaintenanceMode' },
      { label: 'Platform Settings', href: '/admin/SystemConfiguration/PlatformSettings' },
    ]
  },
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [isSidebarOpen] = useState(true)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className={`bg-white border-r w-[20%] min-w-[250px] flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-4 border-b flex-shrink-0">
          <h1 className="text-xl font-bold">Admin Panel</h1>
        </div>
        
        {/* Navigation wrapper with scroll */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin">
          {sidebarItems.map((item) => {
            return (
              <div key={item.href}>
                {('subItems' in item) ? (
                  <div>
                    <button
                      onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg hover:bg-gray-100 ${
                        pathname.startsWith(item.href) ? 'bg-gray-100' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5 text-gray-500" />
                        <span>{item.label}</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${
                        openDropdown === item.label ? 'rotate-180' : ''
                      }`} />
                    </button>
                    
                    {openDropdown === item.label && (
                      <div className="mt-1 ml-8 space-y-1">
                        {(item as SidebarItemWithSubItems).subItems.map((subItem: SidebarSubItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className={`block px-3 py-2 text-sm rounded-lg hover:bg-blue-50 ${
                              pathname === subItem.href 
                                ? 'bg-blue-50 text-blue-600 font-medium' 
                                : 'text-gray-600 hover:text-blue-600'
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 ${
                      pathname === item.href ? 'bg-gray-100' : ''
                    }`}
                  >
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <span>{item.label}</span>
                  </Link>
                )}
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen bg-gray-50">
        <div className="p-8 flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
