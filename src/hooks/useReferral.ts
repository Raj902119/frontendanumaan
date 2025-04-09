import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { fetchReferralDashboard } from '@/store/features/referralSlice';
import { toast } from 'sonner';

export const useReferral = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    referralCode, 
    totalReferrals, 
    totalEarnings, 
    availableBonus,
    topInviters,
    recentActivity,
    loading,
    error 
  } = useSelector((state: RootState) => state.referral);

  const refreshReferralData = () => {
    dispatch(fetchReferralDashboard());
  };

  const copyReferralCode = async () => {
    if (referralCode) {
      try {
        await navigator.clipboard.writeText(referralCode);
        toast.success('Referral code copied to clipboard!');
      } catch (err) {
        toast.error('Failed to copy referral code');
        console.error('Failed to copy referral code:', err);
      }
    }
  };

  const shareReferral = async (platform: 'facebook' | 'whatsapp' | 'email' | 'link') => {
    const shareText = `Use my referral code ${referralCode} to get ₹500!`;
    const shareUrl = `${window.location.origin}/register?ref=${referralCode}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`);
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
        break;
      case 'email':
        window.open(`mailto:?subject=Join me on Anumaan!&body=${encodeURIComponent(shareText + ' ' + shareUrl)}`);
        break;
      case 'link':
        try {
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Referral link copied to clipboard!');
        } catch (err) {
          toast.error('Failed to copy link');
          console.error('Failed to copy link:', err);
        }
        break;
    }
  };

  return {
    referralCode,
    totalReferrals,
    totalEarnings,
    availableBonus,
    topInviters,
    recentActivity,
    loading,
    error,
    refreshReferralData,
    copyReferralCode,
    shareReferral
  };
}; 