export interface LoginRequest {
  phone: string;
  name?: string;
  referralCode?: string;
}

export interface VerifyOTPRequest {
  phone: string;
  otp: string;
  name?: string;
  referralCode?: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: UserProfile;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email?: string;
  upiId?: string;
  referralCode: string;
  kycStatus: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_SUBMITTED';
  createdAt: string;
  updatedAt: string;
  wallet: WalletInfo;
}

export interface WalletInfo {
  totalBalance: number;       // Total balance including locked funds
  availableBalance: number;   // Balance available for trading
  depositedAmount: number;    // Total amount deposited by user
  withdrawableAmount: number; // Amount eligible for withdrawal
  bonusAmount: number;        // Promotional credits
  pendingAmount: number;      // Amount in pending transactions
  netProfitLoss: number;      // Trading profit/loss
  currentValue: number;       // Current portfolio value
  referralBonusBalance: number; // Bonus from referrals
}

export interface KYCDetails {
  panNumber?: string;
  aadharNumber?: string;
  documentType?: string;
  documentUrl?: string;
  status: 'PENDING' | 'VERIFIED' | 'REJECTED' | 'NOT_SUBMITTED';
  rejectionReason?: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  email?: string;
  upiId?: string;
} 