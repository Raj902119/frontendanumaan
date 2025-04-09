import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-background">
       <div className="relative aa:hidden xs:block  lg:h-[200px] sm:h-[150px] w-full mb-8 mt-8">
        <Image
          src="/termscon.svg"
          alt="Terms and Conditions"
          fill
          className="object-contain"
        />
      </div>
      
      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 prose prose-slate max-w-none">
            <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
            
            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Usage of Anumaan Technologies Platform</h2>
              <p>
                The Anumaan Technologies platform ("Anumaan Platform") is provided by Anumaan Technologies. ("Anumaan"). 
                Through the Anumaan Platform, any person ("User") with a verified account can access and participate in 
                the services provided via the Anumaan Platform. These include event predictions across various asset 
                classes such as sports, economy, markets, politics, cryptocurrencies, and forex.
              </p>
              <p className="mt-4">
                By accessing the Anumaan Platform, Users agree to be bound by these Terms and Conditions, as well as 
                any additional rules, regulations, or terms of use provided by Anumaan in connection with its services 
                ("Anumaan Services"). If Users do not agree to these terms, they should not use the Anumaan Platform.
              </p>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Modifications to Terms and Conditions</h2>
              <p>
                Anumaan reserves the right to modify these Terms and Conditions, rules, and regulations at any time 
                by posting the updated version on the Anumaan Platform. Continued use of the platform constitutes 
                acceptance of the updated terms. Anumaan may also notify Users of changes via email or in-app 
                notifications. If a User does not agree to the updated terms, they must notify Anumaan within the 
                prescribed timeframe; otherwise, they will be deemed to have accepted the modifications.
              </p>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Scope of Services</h2>
              <h3 className="text-xl font-medium mt-6 mb-3">Anumaan Platform Services:</h3>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Predictions:</strong> Users can bid on the probability of the occurrence of specified events 
                  based on their knowledge and analysis of publicly available information.
                </li>
                <li>
                  <strong>Categories and Subcategories:</strong> Anumaan offers a hierarchical structure for event 
                  predictions, covering categories such as Sports (e.g., Cricket, IND vs. AUS matches), 
                  Cryptocurrency (e.g., Bitcoin price predictions), and more.
                </li>
                <li>
                  <strong>Customization:</strong> Users can suggest and participate in customized prediction events 
                  provided by Anumaan, subject to approval.
                </li>
              </ol>

              <h3 className="text-xl font-medium mt-6 mb-3">Event Prediction Mechanics:</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Users place bids on specified future events.</li>
                <li>If a complementary bid is matched, Users are locked into the event until its outcome is determined.</li>
                <li>Unmatched bids will have their amounts refunded to the User's account.</li>
                <li>Users are responsible for their own analysis and decision-making when placing bids.</li>
              </ul>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Eligibility</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>The Anumaan Platform is open only to persons above the age of 18 years.</li>
                <li>Users must reside in India and provide a valid phone number during registration.</li>
                <li>Users who are deemed to have insider knowledge of certain events may be barred from participating in related predictions.</li>
                <li>Each User must have a verified account with accurate personal information and supporting Know Your Customer (KYC) documentation.</li>
              </ol>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">User Conduct</h2>
              <p className="mb-4">Users agree to:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Provide accurate, current, and complete registration information.</li>
                <li>Use the platform responsibly, avoiding activities such as hacking, exploiting bugs, or using unauthorized tools.</li>
                <li>Not post or transmit inappropriate, defamatory, or unlawful content.</li>
                <li>Refrain from impersonating others or misrepresenting their affiliation with any entity.</li>
              </ol>
              <p className="mt-4">
                Failure to comply with these requirements may result in account suspension, termination, or legal action.
              </p>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Account Management</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Users may not operate more than one account on the Anumaan Platform.</li>
                <li>Users are responsible for maintaining the confidentiality of their login credentials.</li>
                <li>Anumaan reserves the right to deactivate or delete accounts that violate these Terms and Conditions.</li>
                <li>Inactive accounts may be subject to forfeiture of funds after a continuous inactivity period of 365 days.</li>
              </ol>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Payment Terms</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>
                  <strong>Deposit Accounts:</strong> Users must deposit funds to place bids. Deposits are non-refundable except for unutilized amounts.
                </li>
                <li>
                  <strong>Winnings Accounts:</strong> Winnings from successful bids are credited to the User's Winnings Account and can be withdrawn or reused for further predictions.
                </li>
                <li>
                  <strong>Platform Fees:</strong> Anumaan may charge a Platform Fee, which will be deducted from winnings before being credited to the User's account.
                </li>
                <li>
                  <strong>Withdrawals:</strong> Withdrawals require KYC verification. Anumaan reserves the right to impose withdrawal limits.
                </li>
                <li>
                  <strong>Promotional Balances:</strong> Anumaan may issue promotional funds that are subject to restrictions.
                </li>
              </ol>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Intellectual Property</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>The Anumaan Platform contains proprietary content, including but not limited to software, graphics, and trademarks, owned by Anumaan or its affiliates.</li>
                <li>Users are prohibited from reproducing, modifying, or exploiting any proprietary content without prior written permission.</li>
                <li>Content uploaded by Users must not infringe any third-party rights. Users agree to indemnify Anumaan against any claims arising from such infringements.</li>
                <li>By submitting content, Users grant Anumaan a worldwide, royalty-free license to use, display, and distribute the content for platform-related purposes.</li>
              </ol>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Disclaimers and Limitations of Liability</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Anumaan provides its services on an "as-is" and "as-available" basis. It does not guarantee error-free or uninterrupted services.</li>
                <li>Users access the platform at their own risk. Anumaan shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of the platform.</li>
                <li>Anumaan reserves the right to cancel or modify services if required by regulatory authorities or unforeseen circumstances.</li>
              </ol>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Dispute Resolution</h2>
              <ol className="list-decimal pl-6 space-y-2">
                <li>All disputes shall be attempted to be resolved amicably within 30 days of written communication.</li>
                <li>Unresolved disputes will be referred to arbitration under the Delhi International Arbitration Centre (DIAC) Rules, with the seat of arbitration in New Delhi and proceedings conducted in English.</li>
                <li>The arbitration award shall be final and binding.</li>
              </ol>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Grievance Redressal Mechanism</h2>
              <p>Users with complaints or grievances can contact the Grievance Officer:</p>
              <div className="mt-4 pl-6">
                <p><strong>Name: </strong>Rajwardhan Patil</p>
                <p><strong>Email: </strong> <a href="info@anumaan.co" className="text-primary hover:underline">info@anumaan.co</a></p>
                <p><strong>Address: Desai nager, vakhan road, karad 415110</strong></p>
              </div>
              
              <p className="mt-4">Complaints must include:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>User's name, contact details, and relationship to the complaint.</li>
                <li>Description of the issue and relevant supporting documents.</li>
                <li>A declaration that the information provided is accurate and made in good faith.</li>
              </ol>
            </section>

            <hr className="my-8" />

            <section>
              <h2 className="text-2xl font-semibold mb-4">Privacy Policy</h2>
              <p>
                Anumaan respects User privacy and is committed to protecting personal data. All information collected 
                is subject to the Anumaan Privacy Policy, available on the platform.
              </p>
            </section>

            <hr className="my-8" />

            <section>
              <p className="font-medium">
                By using the Anumaan Platform, Users acknowledge that they have read, understood, and agreed to these 
                Terms and Conditions. For any clarifications, Users may contact Anumaan support.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

