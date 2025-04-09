import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background">
      
      <div className="aa:hidden xs:block relative lg:h-[200px] sm:h-[150px] w-full mb-8 mt-8">
        <Image
          src="/pap.svg"
          alt="Privacy policy"
          fill
          className="object-contain"
        />
      </div>

      <main className="container mx-auto py-8 px-4">
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-6 prose prose-slate max-w-none">
            <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
            
            <p className="text-muted-foreground">
              Anumaan Technologies Pvt. Ltd. ("Company") is committed to protecting the privacy of its users. 
              This Privacy Policy ("Privacy Policy") is designed to help you understand what information we gather, 
              how we use it, and what measures we take to protect it. It also aims to assist you in making informed 
              decisions while using our Services as defined in the Terms and Conditions.
            </p>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">I. Consent</h2>
              <p>
                By accessing the Anumaan Platform, you accept this Privacy Policy and consent to our collection, 
                storage, and use of your personal information as described herein. Your continued use of our services 
                signifies your agreement to this policy. You may withdraw your consent by contacting us in writing 
                at <a href="info@anumaan.co" className="text-primary hover:underline">info@anumaan.co</a>.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">II. Collection of Information</h2>
              <p>We may collect the following types of information:</p>
              <ol className="list-decimal pl-6 mt-4 space-y-4">
                <li>
                  <strong>Non-Personal Information:</strong> Includes anonymous usage data, general demographic details, 
                  referring/exit pages, platform types, and preferences.
                </li>
                <li>
                  <strong>Personal Information:</strong> Includes details that identify you personally, such as:
                  <ul className="list-disc pl-6 mt-2">
                    <li>Name, address, age, contact number, and email address.</li>
                    <li>Government IDs (e.g., Aadhar, PAN, Passport).</li>
                    <li>Banking details (e.g., UPI, IMPS).</li>
                  </ul>
                </li>
              </ol>
              
              <div className="mt-4 space-y-4">
                <p><strong>a. Analytics</strong><br />
                We track your usage of the platform to improve our services and tailor user experiences.</p>
                
                <p><strong>b. Website Forms</strong><br />
                Information submitted through forms is used solely to understand your requirements and provide relevant services.</p>
                
                <p><strong>c. Communication</strong><br />
                By providing your contact details, you consent to being contacted by Anumaan for service updates, 
                inquiries, and promotional communications.</p>
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">III. Data Usage</h2>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-6 mt-4">
                <li>Provide and improve our services.</li>
                <li>Troubleshoot issues.</li>
                <li>Prevent fraud.</li>
              </ul>
              <p className="mt-4">
                We do not sell or rent your personal data to third parties. However, your information may be shared 
                with trusted vendors to enable services such as payment processing.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">IV. Protection of Information</h2>
              <p>
                We employ industry-standard security measures to safeguard your data. However, no system is completely 
                secure, and we cannot guarantee the absolute protection of your information.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">V. Age of Consent</h2>
              <p>Users must be at least 18 years old to use the Anumaan platform and services.</p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">VI. User Rights</h2>
              <ol className="list-decimal pl-6 mt-4">
                <li>
                  <strong>Account Deletion:</strong> You may request to delete your account by writing 
                  to <a href="mailto:support@anumaan.com" className="text-primary hover:underline">info@anumaan.co</a>.
                </li>
                <li>
                  <strong>Data Access:</strong> You have the right to access and request corrections to your data.
                </li>
              </ol>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">VII. Data Retention</h2>
              <p>
                Personal information is retained only for as long as necessary to fulfill the purposes for which it 
                was collected or as required by law.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">VIII. Changes to Privacy Policy</h2>
              <p>
                We reserve the right to update this policy. Users will be notified of changes via the platform or email.
              </p>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">IX. Contact Us</h2>
              <p>For questions about this Privacy Policy, contact us at:</p>
              <div className="mt-4">
                <strong>Grievance Officer:</strong><br />
                Rajwardhan Patil<br />
                <a href="info@anumaan.co" className="text-primary hover:underline">info@anumaan.co</a><br />
                Desai nager, vakhan road, karad 415110
              </div>
            </section>

            <section className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">X. Last Updated</h2>
              <p>This Privacy Policy was last updated on 11/01/2025.</p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

