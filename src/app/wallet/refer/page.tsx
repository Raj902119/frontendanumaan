'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { useReferral } from '@/hooks/useReferral'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { AppDispatch } from '@/store'
import { fetchReferralDashboard } from '@/store/features/referralSlice'

interface TopInviter {
  username: string;
  profilePicture: string;
  earnings: number;
}

export default function ReferPage() {
  const { 
    referralCode, 
    totalReferrals, 
    totalEarnings, 
    availableBonus,
    topInviters = [],
    loading,
    error,
    copyReferralCode,
    shareReferral,
  } = useReferral();
  
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    dispatch(fetchReferralDashboard());
  }, [dispatch]);
  
  const steps = [
    {
      title: 'Get ₹500 instantly',
      description: 'Share your invite code with friends',
      icon: '/icons/share.png'
    },
    {
      title: 'Friend signs up',
      description: 'Your friend registers using your code',
      icon: '/icons/signup.png'
    },
    {
      title: 'Both get rewarded',
      description: 'You and your friend each get ₹500',
      icon: '/icons/reward.png'
    }
  ]

  const handleCopyCode = async () => {
    await copyReferralCode();
  }

  const handleShare = async (platform: 'facebook' | 'whatsapp' | 'email' | 'link') => {
    await shareReferral(platform);
  }

  if (loading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm mb-6">
        <Link href="/" className="text-gray-500 hover:text-gray-700">
          Home
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-500" />
        <Link href="/wallet" className="text-gray-500 hover:text-gray-700">
          Wallet
        </Link>
        <ChevronRight className="h-4 w-4 text-gray-500" />
        <span className="text-gray-900">Refer & Earn</span>
      </div>

      {/* Hero Section */}
      <div className="mb-12">
        <div className="relative">
          {/* Background Image */}
          <div className="w-full">
            <Image
              src="/sharebg.svg"
              alt="Background"
              width={1200}
              height={400}
              className="w-full h-auto xs:block hidden"
            />
            <Image
              src="/referbg2.svg"
              alt="Background"
              width={1200}
              height={400}
              className="w-full h-auto xs:hidden block"
            />
          </div>

          {/* Overlay Content - Side by Side Images */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="flex aa:flex-col xs:flex-row xs:justify-between items-center h-full px-6 aa:py-6 xs:py-0 aa:gap-6 ac:gap-12 xs:gap-0">
              {/* Left Image */}
              <div className="xs:w-1/2 aa:w-full">
                <Image
                  src="/sharet.svg"
                  alt="Share Text"
                  width={300}
                  height={200}
                  className="w-full h-auto"
                />
              </div>
              {/* Right Image */}
              <div className="xs:w-1/2 aa:w-full">
                <Image
                  src="/sharep.svg"
                  alt="Share Person"
                  width={300}
                  height={400}
                  className="ac:ml-12 xs:ml-14 sm:w-3/4 aa:w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Inviters and Share & Earn Section Container */}
      <div className="grid xs:grid-cols-2 gap-8 mb-12">
        {/* Top Inviters Section */}
        <Card className="aa:p-2 ab:p-6">
          <h2 className="aa:text-xl xs:text-2xl font-semibold text-center aa:mb-4 xs:mb-12">TOP INVITERS</h2>
          <div className="flex justify-center items-end aa:gap-0 ab:gap-8 aa:mb-4 xs:mb-20">
            {topInviters.map((inviter: TopInviter, index: number) => (
              <div key={inviter.username} className={`text-center relative ${index === 1 ? 'pb-10' : ''} aa:mx-auto`}>
                <div className="relative aa:flex aa:justify-center">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={inviter.profilePicture || '/default-avatar.png'} alt={inviter.username} />
                  </Avatar>
                </div>
                <p className="mt-4 aa:text-base ab:text-xl font-bold">₹{inviter.earnings.toLocaleString()}</p>
                <p className="text-gray-500">@{inviter.username}</p>
              </div>
            ))}
          </div>

          {/* Current Earning */}
          <div className="bg-yellow-50 p-4 rounded-lg flex items-center gap-2 justify-center">
            <Image
              src="/wallet.svg"
              alt="Coin"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-gray-700">Current earning: ₹{availableBonus?.toLocaleString() || 0}</span>
          </div>
        </Card>

        {/* Share and Earn Section */}
        <Card className="p-6">
          <div className="flex flex-col items-center">
            {/* Share and Earn Image */}
            <div className="mb-6">
              <Image
                src="/shareEarn.svg"
                alt="Share and Earn"
                width={300}
                height={200}
                className="w-auto h-auto"
              />
            </div>

            {/* Referral Code Section */}
            <div className="w-full max-w-md aa:mb-4 xs:mb-6">
              <div className="flex items-center justify-between bg-gray-50 rounded-full p-4 border-2 border-gray-200">
                <div className="text-gray-700">
                  <div className="aa:text-xs ab:text-base uppercase">REFERRAL CODE</div>
                  <div className="aa:text-xs ab:text-base font-semibold">{referralCode || 'Loading...'}</div>
                </div>
                <Button 
                  variant="ghost" 
                  className="text-blue-600 hover:text-blue-800"
                  onClick={handleCopyCode}
                >
                  Copy
                </Button>
              </div>
            </div>

            {/* Social Share Buttons */}
            <div className="flex justify-center gap-4 aa:mb-4 xs:mb-6">
              <div className="flex flex-col items-center">
                <button className="p-2" onClick={() => handleShare('facebook')}>
                  <Image
                    src="/fb.svg"
                    alt="Facebook"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </button>
                <span className="text-sm text-gray-600 mt-1">Facebook</span>
              </div>
              <div className="flex flex-col items-center">
                <button className="p-2" onClick={() => handleShare('whatsapp')}>
                  <Image
                    src="/wp.svg"
                    alt="WhatsApp"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </button>
                <span className="text-sm text-gray-600 mt-1">WhatsApp</span>
              </div>
              <div className="flex flex-col items-center">
                <button className="p-2" onClick={() => handleShare('email')}>
                  <Image
                    src="/mail.svg"
                    alt="Gmail"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </button>
                <span className="text-sm text-gray-600 mt-1">Email</span>
              </div>
              <div className="flex flex-col items-center">
                <button className="p-2" onClick={() => handleShare('link')}>
                  <Image
                    src="/link.svg"
                    alt="Copy Link"
                    width={40}
                    height={40}
                    className="w-10 h-10"
                  />
                </button>
                <span className="text-sm text-gray-600 mt-1">Copy Link</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Steps Section */}
      <div className="grid xs:grid-cols-3 gap-6">
        {steps.map((step, index) => (
          <Card key={index} className="p-6">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">
                <Image
                  src={step.icon}
                  alt={step.title}
                  width={64}
                  height={64}
                  className="w-16 h-16"
                />
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
