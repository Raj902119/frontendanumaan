import { Brain, Scale, Handshake, BookOpen, LockKeyhole } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LegalityPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r text-sm sm:text-base">
        <div className="container mx-auto px-4 py-10 md:py-16 max-w-5xl">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Legality of Skill-Based Trading on Anumaan</h1>
          <p className="text-lg md:text-xl max-w-3xl">
            At Anumaan, we are committed to building a responsible and legally compliant platform that empowers users to
            make informed predictions based on skill, research, and analysis—not chance.
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Legal Status Section */}
        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Skill-Based Trading is Legal in India</h2>
          <p className="text-gray-700">
            Anumaan operates in accordance with Indian judicial precedents that clearly differentiate skill-based gaming
            from gambling. The Supreme Court of India and multiple High Courts have consistently upheld that games where
            skill outweighs chance do not fall under gambling legislation, including the Public Gambling Act, 1867.
          </p>
        </section>

        {/* Why Anumaan is a Game of Skill */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <Brain className="h-8 w-8 text-slate-700 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold">Why Anumaan is a Game of Skill</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 ">
            <Card className="aa:p-4 sm:p-0">
              <CardHeader>
                <CardTitle>Informed Predictions</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Users participate by analyzing data, news, and trends to forecast real-world outcomes.</p>
              </CardContent>
            </Card>

            <Card className="aa:p-4 sm:p-0">
              <CardHeader>
                <CardTitle>Analytical Thinking</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Our platform rewards those who engage in research and apply critical reasoning to assess events.</p>
              </CardContent>
            </Card>

            <Card className="aa:p-4 sm:p-0">
              <CardHeader>
                <CardTitle>Real-Time Strategy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>
                  Dynamic price fluctuations on Anumaan require users to apply logic and strategy—like in financial
                  trading.
                </p>
              </CardContent>
            </Card>

            <Card className="aa:p-4 sm:p-0">
              <CardHeader>
                <CardTitle>No Element of Chance</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Unlike betting or lottery, success on Anumaan is determined by user insight and decision-making.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Legal Precedents */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <Scale className="h-8 w-8 text-slate-700 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold">Supported by Legal Precedents</h2>
          </div>

          <p className="mb-4">Key rulings that support the legality of Anumaan's model include:</p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>
              <strong>Games of Skill ≠ Gambling:</strong> Courts have ruled that any platform where outcomes depend on
              skill, not luck, does not fall under gambling laws.
            </li>
            <li>
              <strong>Constitutional Protection:</strong> Article 19(1)(g) of the Constitution protects skill-based
              games as legitimate business activities.
            </li>
            <li>
              <strong>Judicial Recognition:</strong> Platforms requiring judgment, experience, and analytical ability
              are recognized as lawful enterprises.
            </li>
          </ul>
        </section>

        {/* Compliance Approach */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <Handshake className="h-8 w-8 text-slate-700 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold">Our Compliance Approach</h2>
          </div>

          <p className="mb-4">We prioritize transparency, user education, and responsible participation.</p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>All challenges on Anumaan are crafted to encourage strategic thinking.</li>
            <li>We avoid any language or design that promotes gambling or chance-based engagement.</li>
          </ul>
        </section>

        {/* Further Reading */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <BookOpen className="h-8 w-8 text-slate-700 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold">Further Reading</h2>
          </div>

          <p className="mb-4">
            To know more about the evolving legal framework around skill-based platforms in India, we recommend
            referring to:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>All India Gaming Federation (AIGF)</li>
            <li>Federation of Indian Fantasy Sports (FIFS)</li>
            <li>Judicial interpretations by the Supreme Court and various High Courts</li>
          </ul>
        </section>

        {/* Conclusion */}
        <section className="mb-12">
          <div className="flex items-center mb-4">
            <LockKeyhole className="h-8 w-8 text-slate-700 mr-2" />
            <h2 className="text-2xl md:text-3xl font-bold">Conclusion</h2>
          </div>

          <p className="text-gray-700">
            Anumaan is a game of skill, designed for users who enjoy making smart, data-driven predictions. Our
            operations are well within the legal boundaries established by Indian law, offering a fair, skill-based
            platform to all users.
          </p>
        </section>

        {/* CTA */}
        <div className="text-center py-8">
          <Button size="lg" className="text-sm sm:text-base bg-blue-600 text-white hover:bg-blue-700">
            <Link href="#">Learn More About Anumaan</Link>
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-100 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Anumaan. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link href="#" className="text-slate-700 hover:underline">
              Terms of Service
            </Link>
            <Link href="#" className="text-slate-700 hover:underline">
              Privacy Policy
            </Link>
            <Link href="#" className="text-slate-700 hover:underline">
              Contact Us
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
