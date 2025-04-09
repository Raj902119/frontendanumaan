'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { PlusCircle, ArrowRight, ArrowLeft, Upload, Eye, Save, X } from 'lucide-react'
import { Steps } from "@/components/ui/steps"

interface EventFormData {
  name: string
  category: string
  startTime: string
  endTime: string
  description: string
  rules: string
  entryFee: number
  yesOdds: number
  noOdds: number
  thumbnail: File | null
  visibility: boolean
  tradingEnabled: boolean
}

export function EventFormDialog({ onCreateEvent }: { onCreateEvent: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<EventFormData>({
    name: '',
    category: '',
    startTime: '',
    endTime: '',
    description: '',
    rules: '',
    entryFee: 0,
    yesOdds: 1.5,
    noOdds: 1.5,
    thumbnail: null,
    visibility: true,
    tradingEnabled: true
  })
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      
      setFormData({ ...formData, thumbnail: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB')
        return
      }
      
      setFormData({ ...formData, thumbnail: file })
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate required fields
    if (!formData.name || !formData.category || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields')
      return
    }
    
    // Submit the form data
    onCreateEvent({
      ...formData,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString()
    })
    
    // Reset form and close dialog
    setOpen(false)
    setStep(1)
    setFormData({
      name: '',
      category: '',
      startTime: '',
      endTime: '',
      description: '',
      rules: '',
      entryFee: 0,
      yesOdds: 1.5,
      noOdds: 1.5,
      thumbnail: null,
      visibility: true,
      tradingEnabled: true
    })
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
        <PlusCircle className="w-4 h-4" />
        Create Event
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-4xl bg-white">
          <DialogHeader className="border-b pb-4">
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>

          <div className="mt-6">
            <Steps
              steps={['Basic Details', 'Rules & Settings', 'Preview']}
              currentStep={step}
              onStepClick={setStep}
            />
          </div>

          <form onSubmit={(e) => {
            e.preventDefault()
            if (step === 4) {
              handleSubmit(e)
            } else {
              setStep(step + 1)
            }
          }} className="mt-8">
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column - Form Fields */}
              <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
                {step === 1 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Event Name</label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border rounded-lg"
                        required
                      >
                        <option value="">Select Category</option>
                        <option value="sports">Sports</option>
                        <option value="politics">Politics</option>
                        <option value="entertainment">Entertainment</option>
                        <option value="finance">Finance</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Start Time</label>
                        <Input
                          type="datetime-local"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">End Time</label>
                        <Input
                          type="datetime-local"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Description</label>
                      <Textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        required
                      />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1">Rules</label>
                      <Textarea
                        value={formData.rules}
                        onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Entry Fee</label>
                        <Input
                          type="number"
                          value={formData.entryFee}
                          onChange={(e) => setFormData({ ...formData, entryFee: Number(e.target.value) })}
                          min="0"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Thumbnail</label>
                        <div 
                          className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50"
                          onClick={() => document.getElementById('file-upload')?.click()}
                        >
                          {preview ? (
                            <div className="relative">
                              <img 
                                src={preview} 
                                alt="Preview" 
                                className="w-full h-32 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setPreview(null)
                                  setFormData({ ...formData, thumbnail: null })
                                }}
                                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                              <div className="text-sm text-gray-500">
                                Click to upload or drag and drop
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                PNG, JPG up to 5MB
                              </div>
                            </>
                          )}
                          <input
                            id="file-upload"
                            type="file"
                            className="hidden"
                            onChange={handleFileChange}
                            accept="image/*"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Yes Odds</label>
                        <Input
                          type="number"
                          value={formData.yesOdds}
                          onChange={(e) => setFormData({ ...formData, yesOdds: Number(e.target.value) })}
                          min="1"
                          step="0.1"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">No Odds</label>
                        <Input
                          type="number"
                          value={formData.noOdds}
                          onChange={(e) => setFormData({ ...formData, noOdds: Number(e.target.value) })}
                          min="1"
                          step="0.1"
                          required
                        />
                      </div>
                    </div>
                  </>
                )}

                {step === 3 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-4">Event Preview</h3>
                    <div className="space-y-2">
                      <p><span className="font-medium">Name:</span> {formData.name}</p>
                      <p><span className="font-medium">Category:</span> {formData.category}</p>
                      <p><span className="font-medium">Start Time:</span> {new Date(formData.startTime).toLocaleString()}</p>
                      <p><span className="font-medium">End Time:</span> {new Date(formData.endTime).toLocaleString()}</p>
                      <p><span className="font-medium">Entry Fee:</span> ₹{formData.entryFee}</p>
                      <p><span className="font-medium">Odds:</span> Yes: {formData.yesOdds}, No: {formData.noOdds}</p>
                      <div className="mt-4">
                        <p className="font-medium">Description:</p>
                        <p className="text-sm mt-1">{formData.description}</p>
                      </div>
                      <div className="mt-4">
                        <p className="font-medium">Rules:</p>
                        <p className="text-sm mt-1">{formData.rules}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Preview */}
              <div className="border-l pl-6">
                <div className="sticky top-4">
                  <h3 className="font-medium mb-4 text-gray-700">Live Preview</h3>
                  <div className="bg-white rounded-lg border shadow-sm p-4">
                    {preview && (
                      <img
                        src={preview}
                        alt="Event thumbnail"
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                    )}
                    <h4 className="font-medium">{formData.name || 'Event Name'}</h4>
                    <p className="text-sm text-gray-500 mt-1">
                      {formData.description || 'Event description will appear here'}
                    </p>
                    {formData.startTime && (
                      <div className="mt-2 text-sm">
                        Starts: {new Date(formData.startTime).toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8 pt-4 border-t">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back
                </Button>
              )}
              <div className="ml-auto flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
                {step < 3 ? (
                  <Button
                    type="button" // Important: type="button" to prevent form submission
                    onClick={() => setStep(step + 1)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                  >
                    Next
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    Create Event
                  </Button>
                )}
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
} 