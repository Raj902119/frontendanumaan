'use client'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '@/store/store'
import { fetchUserProfile, updateUserProfile } from '@/store/features/userSlice'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { User, Mail, Smartphone, Copy, AlertCircle, Check, Upload } from 'lucide-react'
import ProtectedRoute from '@/components/protected-route'

export default function ProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const { profile, loading, error } = useSelector((state: RootState) => state.user)
  const auth = useSelector((state: RootState) => state.auth)
  
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [upiId, setUpiId] = useState('')
  const [kycStatus, setKycStatus] = useState('NOT_SUBMITTED')
  const [isSuccess, setIsSuccess] = useState(false)
  const [isClient, setIsClient] = useState(false)
  
  // KYC file upload state
  const [panFile, setPanFile] = useState<File | null>(null)
  const [aadharFile, setAadharFile] = useState<File | null>(null)
  const [panNumber, setPanNumber] = useState('')
  const [aadharNumber, setAadharNumber] = useState('')
  
  useEffect(() => {
    setIsClient(true)
    
    dispatch(fetchUserProfile())
  }, [dispatch])
  
  useEffect(() => {
    if (profile) {
      setName(profile.name || auth.user?.name || '')
      setEmail(profile.email || '')
      setUpiId(profile.upiId || '')
      setKycStatus(profile.kycStatus || 'NOT_SUBMITTED')
    }
  }, [profile, auth.user])
  
  const handleUpdateProfile = async () => {
    setIsSuccess(false)
    try {
      await dispatch(updateUserProfile({ 
        name, 
        email, 
        upiId 
      })).unwrap()
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error('Error updating profile:', error)
    }
  }
  
  const handleSubmitKYC = async () => {
    if (!panFile || !aadharFile || !panNumber || !aadharNumber) {
      return
    }
    
    try {
      const formData = new FormData()
      formData.append('panNumber', panNumber)
      formData.append('aadharNumber', aadharNumber)
      formData.append('panCard', panFile)
      formData.append('aadharCard', aadharFile)
      
      // For demo, we're just logging the form data
      console.log('Submitting KYC with:', {
        panNumber,
        aadharNumber,
        panFile: panFile.name,
        aadharFile: aadharFile.name
      })
      
      // In a real app, you would dispatch a thunk to submit KYC
      // await dispatch(submitKYC(formData)).unwrap()
      
      // For demo, we're just setting a success message
      setIsSuccess(true)
      setTimeout(() => setIsSuccess(false), 3000)
    } catch (error) {
      console.error('Error submitting KYC:', error)
    }
  }
  
  const copyReferralCode = () => {
    const referralCode = profile?.referralCode || auth.user?.referralCode;
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      alert('Referral code copied!');
    }
  }
  
  const renderKycStatus = () => {
    switch(kycStatus) {
      case 'VERIFIED':
        return (
          <div className="flex items-center text-green-500">
            <Check className="mr-2 h-4 w-4" />
            <span>Verified</span>
          </div>
        )
      case 'PENDING':
        return (
          <div className="flex items-center text-yellow-500">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Pending Verification</span>
          </div>
        )
      case 'REJECTED':
        return (
          <div className="flex items-center text-red-500">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Verification Rejected</span>
          </div>
        )
      default:
        return (
          <div className="flex items-center text-gray-500">
            <AlertCircle className="mr-2 h-4 w-4" />
            <span>Not Submitted</span>
          </div>
        )
    }
  }
  
  if (!isClient) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }
  
  return (
    <ProtectedRoute>
      <div className="container mx-auto py-8 px-4" style={{ maxWidth: '1020px' }}>
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="kyc">KYC Verification</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your account details here.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                      {error}
                    </AlertDescription>
                  </Alert>
                )}
                
                {isSuccess && (
                  <Alert className="mb-4 bg-green-50 border-green-500">
                    <Check className="h-4 w-4 text-green-500" />
                    <AlertTitle className="text-green-500">Success</AlertTitle>
                    <AlertDescription className="text-green-700">
                      Your profile has been updated successfully!
                    </AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="flex">
                    <User className="mr-2 h-4 w-4 mt-3 text-gray-500" />
                    <Input 
                      id="name" 
                      placeholder="John Doe" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="flex">
                    <Smartphone className="mr-2 h-4 w-4 mt-3 text-gray-500" />
                    <Input 
                      id="phone" 
                      placeholder="+91 9999999999" 
                      value={profile?.phone || auth.user?.phone || ''}
                      disabled
                    />
                  </div>
                  <p className="text-xs text-red-500 text-muted-foreground">
                    Your phone number cannot be changed.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="flex">
                    <Mail className="mr-2 h-4 w-4 mt-3 text-gray-500" />
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="john@example.com" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="upiId">UPI ID</Label>
                  <div className="flex">
                    <Input 
                      id="upiId" 
                      placeholder="yourname@upi" 
                      value={upiId} 
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Your UPI ID will be used for withdrawals.
                  </p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button className='bg-blue-600 text-white hover:bg-blue-700' onClick={handleUpdateProfile} disabled={loading}>
                  {loading ? 'Updating...' : 'Save Changes'}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Referral Code</CardTitle>
                <CardDescription>Share your referral code with friends and earn bonuses.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 p-4 rounded-md flex justify-between items-center">
                  <span className="font-mono font-medium">{profile?.referralCode || auth.user?.referralCode || 'LOADING'}</span>
                  <Button variant="ghost" size="icon" onClick={copyReferralCode}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Your friends get ₹50 bonus on signup, and you get ₹500 when they make their first deposit!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="kyc">
            <Card>
              <CardHeader>
                <CardTitle>KYC Verification</CardTitle>
                <CardDescription>Verify your identity to enable withdrawals.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="font-medium">Verification Status:</p>
                  {renderKycStatus()}
                </div>
                
                {kycStatus !== 'VERIFIED' && kycStatus !== 'PENDING' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="panNumber">PAN Card Number</Label>
                      <Input 
                        id="panNumber" 
                        placeholder="ABCDE1234F" 
                        value={panNumber} 
                        onChange={(e) => setPanNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="panUpload">Upload PAN Card</Label>
                      <div className="border border-dashed border-gray-300 rounded-md p-4">
                        <div className="flex items-center justify-center flex-col">
                          <Upload className="h-6 w-6 text-gray-400 mb-2" />
                          <input
                            type="file"
                            id="panUpload"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => e.target.files && setPanFile(e.target.files[0])}
                          />
                          <Label htmlFor="panUpload" className="cursor-pointer text-blue-500">
                            {panFile ? panFile.name : 'Click to upload PAN Card'}
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aadharNumber">Aadhar Card Number</Label>
                      <Input 
                        id="aadharNumber" 
                        placeholder="1234 5678 9012" 
                        value={aadharNumber} 
                        onChange={(e) => setAadharNumber(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="aadharUpload">Upload Aadhar Card</Label>
                      <div className="border border-dashed border-gray-300 rounded-md p-4">
                        <div className="flex items-center justify-center flex-col">
                          <Upload className="h-6 w-6 text-gray-400 mb-2" />
                          <input
                            type="file"
                            id="aadharUpload"
                            className="hidden"
                            accept="image/*,.pdf"
                            onChange={(e) => e.target.files && setAadharFile(e.target.files[0])}
                          />
                          <Label htmlFor="aadharUpload" className="cursor-pointer text-blue-500">
                            {aadharFile ? aadharFile.name : 'Click to upload Aadhar Card'}
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <Button className="bg-blue-600 text-white hover:bg-blue-700" onClick={handleSubmitKYC} disabled={!panFile || !aadharFile || !panNumber || !aadharNumber}>
                      Submit for Verification
                    </Button>
                  </div>
                )}
                
                {kycStatus === 'PENDING' && (
                  <Alert className="bg-yellow-50 border-yellow-500">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    <AlertTitle className="text-yellow-500">Verification in Progress</AlertTitle>
                    <AlertDescription className="text-yellow-700">
                      Your KYC documents are being verified. This usually takes 1-2 business days.
                    </AlertDescription>
                  </Alert>
                )}
                
                {kycStatus === 'REJECTED' && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Verification Failed</AlertTitle>
                    <AlertDescription>
                      Your verification was rejected. Please resubmit with clearer documents.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  )
} 