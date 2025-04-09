export function Footer() {
    return (
      <footer className="border-t mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {/* Company Section */}
            <div className="aa:ml-4 sm:ml-16">
              <h3 className="font-semibold text-gray-900 sm:mb-4 aa:mb-2">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/about" className="text-gray-600 hover:text-gray-900">About Us</a>
                </li>
                <li>
                  <a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy policy</a>
                </li>
                <li>
                  <a href="/terms-con" className="text-gray-600 hover:text-gray-900">Terms and services</a>
                </li>
              </ul>
            </div>
  
            {/* Resources Section */}
            <div  className="aa:ml-4 sm:ml-16">
              <h3 className="font-semibold text-gray-900 sm:mb-4 aa:mb-2">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/help" className="text-gray-600 hover:text-gray-900">Help center</a>
                </li>
                <li>
                  <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact Support</a>
                </li>
                <li>
                  <a href="/legality" className="text-gray-600 hover:text-gray-900">Legality</a>
                </li>
              </ul>
            </div>
  
            {/* Markets Section */}
            <div  className="aa:ml-4 sm:ml-16">
              <h3 className="font-semibold text-gray-900 sm:mb-4 aa:mb-2">Markets</h3>
              <ul className="space-y-3">
                <li>
                  <a href="/politics" className="text-gray-600 hover:text-gray-900">Politics</a>
                </li>
                <li>
                  <a href="/crypto" className="text-gray-600 hover:text-gray-900">Crypto</a>
                </li>
                <li>
                  <a href="/sports" className="text-gray-600 hover:text-gray-900">Sports</a>
                </li>
                <li>
                  <a href="/markets" className="text-gray-600 hover:text-gray-900">All</a>
                </li>
              </ul>
            </div>
  
            {/* Social Section */}
            <div  className="aa:ml-4 sm:ml-16">
              <h3 className="font-semibold text-gray-900 sm:mb-4 aa:mb-2">Social</h3>
              <ul className="space-y-3">
                <li>
                  <a href="https://t.me/Anumaan" className="text-gray-600 hover:text-gray-900">Telegram</a>
                </li>
                <li>
                  <a href="https://wa.me/Anumaan" className="text-gray-600 hover:text-gray-900">Whatsapp</a>
                </li>
              </ul>
            </div>
          </div>
  
          {/* Disclaimer */}
          <div className="mt-12 pt-8 border-t text-center">
            <p className="text-sm text-gray-500 mb-4">
              "Trading on Anumaan involves risk and may not be suitable for everyone. Investors may lose their initial investment, including any associated fees. Please carefully assess whether trading on Anumaan is appropriate for your financial situation and investment experience. All trading decisions are your sole responsibility and at your own risk. Information is provided for convenience on an 'AS IS' basis. Past performance does not guarantee future results. Anumaan operates under applicable regulatory frameworks in India."
            </p>
            <p className="text-sm text-black font-bold">© copyright 2025 by Anumaan</p>
          </div>
        </div>
      </footer>
    )
  }
  
  