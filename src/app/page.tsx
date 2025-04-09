import Image from "next/image";
import Link from "next/link";
import { CategoriesNav } from "@/components/categories-nav"
import { LiveMarkets } from "@/components/live-markets"
import Dashboard from "@/components/dashboard/Dashboard";
import { PromotionalBanners } from "@/components/dashboard/PromotionalBanners";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 pb-20">
        <div className='aa:block sm:hidden py-1'>
          <PromotionalBanners />
        </div>
        <CategoriesNav />
        <LiveMarkets />
        <Dashboard />
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-gray-50 border-t">
        <div className="flex justify-around items-center h-16">
          <Link href="/wallet" className="flex flex-col items-center">
            <Image src="/wallet2.svg" alt="Home" width={24} height={24} />
            <span className="text-xs mt-1">Wallet</span>
          </Link>
          <Link href="/portfolio" className="flex flex-col items-center">
            <Image src="/portfolio.svg" alt="Portfolio" width={24} height={24} />
            <span className="text-xs mt-1">Portfolio</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
