import { PredictionCard } from './PredictionCard';
import { PromotionalBanners } from './PromotionalBanners';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from 'lucide-react'

// Move these to a separate data.ts file later
const cardData = Array(12).fill({
  traders: 520,
  title: "Yoon arrested by January 31 or will be hanged by police?",
  imageUrl: "/yono.svg",
  yesPrice: "₹100",
  noPrice: "₹100",
  chance: 50
});

export default function Dashboard() {
  return (
    <div>
      <div className='aa:hidden sm:block'>
      <PromotionalBanners />
      </div>
      <div className="sm:hidden pt-2 pb-[2px]">
        <h2 className="aa:text-[10px] ab:text-[12px] font-semibold text-gray-900">Events</h2>
      </div>
      <div className="flex flex-wrap justify-center gap-4 aa:mt-0 sm:mt-5 ab:px-4 aa:px-0">
        <div className="grid aa:grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-7xl">
          {cardData.map((card, index) => (
            <PredictionCard key={index} {...card} />
          ))}
        </div>
      </div>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-4 py-12 space-y-8 max-w-4xl">
          <section className="text-center space-y-4">
            <h1 className="aa:text-xl font-bold tracking-tight text-neutral-700 sm:text-4xl">
              Your Opinion Matters, Predict Yes or No in All events and Win!
            </h1>
            <p className="text-muted-foreground text-neutral-700">
              Predict All events Outcomes and Earn Real Money
            </p>
            <p className="text-sm text-muted-foreground max-w-2xl mx-auto  text-neutral-700">
              Welcome to the ultimate prediction and earning platform where your insights can turn into real cash rewards! If you are passionate about All events we offer a unique opportunity to showcase your expertise and earn while you do it.
            </p>
          </section>

          <section className="grid gap-6 md:grid-cols-2 text-neutral-700">
            <Card className='bg-white aa:text-center aa:py-3 sm:text-left sm:py-0'> 
              <CardHeader>
                <CardTitle>How It Works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Make Your Predictions:</h3>
                  <p className="text-sm text-muted-foreground">
                    Share your opinions on various outcomes in All events
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Win Real Cash:</h3>
                  <p className="text-sm text-muted-foreground">
                    The more accurate your predictions, the more you can earn! Turn your knowledge into cash prizes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className='bg-white aa:text-center aa:py-3 sm:text-left sm:py-0'>
              <CardHeader>
                <CardTitle>Why Join Us?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Diverse Categories:</h3>
                  <p className="text-sm text-muted-foreground">
                    No matter your interest, we have a category for you! Predict outcomes across multiple fields.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Exciting Rewards:</h3>
                  <p className="text-sm text-muted-foreground">
                    Unlock thrilling cash prizes as you demonstrate your predictive skills.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <div className="text-center space-y-6">
            <p className="text-lg font-medium">
              Do not just watch the action-be part of it! Start predicting today and turn your opinions into real cash rewards!
            </p>
            <Button size="lg" className="px-8 bg-white text-black font-black">
              Start Predicting
            </Button>
          </div>

          <footer className="border-t pt-6 mt-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted p-4 rounded-lg">
              <AlertTriangle className="sm:h-4 sm:w-4 aa:h-20 aa;w-20" />
              <p>Disclaimer: This game may be habit-forming or financially risky. Play Responsibly.</p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}