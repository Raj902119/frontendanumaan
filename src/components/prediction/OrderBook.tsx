'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function OrderBook() {
  return (
    <div className="bg-white rounded-lg shadow-md">
              <Tabs defaultValue="orderbook" className="w-full">
                <TabsList className="bg-gray-100">
                  <TabsTrigger 
                    value="orderbook" 
                    className="data-[state=active]:bg-white data-[state=inactive]:bg-gray-100"
                  >
                    Order Book
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="orderbook" className="p-4">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Yes Orders */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>PRICE</span>
                        <span>QTY AT <span className="text-blue-500">YES</span></span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>0</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>0</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>0</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>0</span>
                          <span>0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>0</span>
                          <span>0</span>
                        </div>
                      </div>
                    </div>

                    {/* No Orders */}
                    <div>
                      <div className="flex justify-between text-sm text-gray-600 mb-2">
                        <span>PRICE</span>
                        <span>QTY AT <span className="text-red-500">NO</span></span>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm bg-red-50">
                          <span>0.5</span>
                          <span>5</span>
                        </div>
                        <div className="flex justify-between text-sm bg-red-50">
                          <span>2.5</span>
                          <span>7</span>
                        </div>
                        <div className="flex justify-between text-sm bg-red-50">
                          <span>3.5</span>
                          <span>22</span>
                        </div>
                        <div className="flex justify-between text-sm bg-red-50">
                          <span>8</span>
                          <span>9</span>
                        </div>
                        <div className="flex justify-between text-sm bg-red-50">
                          <span>8.5</span>
                          <span>1</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
  )
} 