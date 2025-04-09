"use client"

import { useState } from "react"
import { ChevronLeft, Upload } from 'lucide-react'
import { format } from "date-fns"
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { ChevronRight } from "lucide-react"

export default function KYCVerificationForm() {
  const [date, setDate] = useState<Date | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isCalendarOpen, setIsCalendarOpen] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto max-w-3xl space-y-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm">
          <Link href="/" className="text-gray-500 hover:text-gray-700">
            Home
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <Link href="/wallet" className="text-gray-500 hover:text-gray-700">
            Wallet
          </Link>
          <ChevronRight className="h-4 w-4 text-gray-500" />
          <span className="text-gray-900">KYC</span>
        </div>

        <div className="aa:space-y-1 xs:space-y-3">
          <button className="flex items-center text-gray-600">
            <span className="aa:text-lg xs:text-3xl font-medium">KYC verification</span>
          </button>
          <p className="text-base text-gray-500">It takes just 10 minutes for verification</p>
        </div>

        <div className="rounded-lg bg-white aa:p-4 xs:p-8 shadow-sm">
          <div className="aa:mb-4 xs:mb-8 rounded-md bg-red-50 p-6">
            <p className="text-lg font-medium text-red-600">IMPORTANT</p>
            <p className="text-base text-gray-600">
              Bank and PAN card details should be of the same person. Incorrect or different details may lead to permanent block.
            </p>
          </div>

          <form className="aa:space-y-4 xs:space-y-8">
            <div className="grid aa:grid-cols-1 xs:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="name" className="text-lg">Name (as in PAN card)</Label>
                <Input id="name" placeholder="Type the full name" required className="h-12 text-lg" />
              </div>

              <div className="space-y-3">
                <Label htmlFor="dob">Date of birth</Label>
                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full h-12 border rounded-md p-2"
                    onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                  >
                    {date ? format(date, "PPP") : "Select Date"}
                  </Button>
                  {isCalendarOpen && (
                    <Calendar
                      onChange={(value) => {
                        if (Array.isArray(value)) {
                          setDate(value[0]);
                        } else {
                          setDate(value);
                        }
                      }}
                      value={date}
                      maxDate={new Date()}
                      minDate={new Date(1900, 0, 1)}
                      className="absolute z-10 w-full border rounded-md p-2"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="grid aa:grid-cols-1 xs:grid-cols-2 gap-4">
              <div className="space-y-3">
                <Label htmlFor="pan">PAN card number</Label>
                <Input 
                  id="pan" 
                  placeholder="PAN number (10 digit)" 
                  maxLength={10}
                  required 
                />
              </div>

              <div className="space-y-3">
                <Label className="text-lg">Upload PAN card</Label>
                <div className="flex items-center justify-center w-full">
                  <label
                    htmlFor="file-upload"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100"
                  >
                    <div className="flex flex-col items-center justify-center pt-4 pb-4">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-base text-gray-500">
                        {selectedFile ? selectedFile.name : "Click to upload"}
                      </p>
                    </div>
                    <input
                      id="file-upload"
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            </div>

            <Button className="w-full bg-gray-900 text-white hover:bg-gray-800 h-14 text-lg">
              Continue
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

