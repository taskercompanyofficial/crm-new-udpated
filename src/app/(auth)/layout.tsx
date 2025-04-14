import { Laptop2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-svh bg-gradient-to-br from-sky-900 via-sky-700 to-sky-500">
      <div className="grid min-h-svh lg:grid-cols-2 bg-gradient-to-br from-sky-900 via-sky-700 to-sky-500 px-2">
        <div className="flex flex-col gap-6 pt-8 lg:pt-12">
          <div className="flex justify-center lg:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <Image src="/simple-icon.png" alt="Tasker Company CRM" width={100} height={100} />
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center py-8 lg:py-12">
            <div className="w-full max-w-sm space-y-6 bg-white/10 backdrop-blur-lg rounded-lg p-4 sm:p-6 shadow-xl border border-white/20">
              {children}
            </div>
          </div>
        </div>
        <div className="hidden lg:flex justify-center items-center h-full">
          <div className="relative w-full max-w-2xl aspect-[4/2] mx-auto">
            <Image
              src="/assets/login-products.png"
              alt="Product Collection"
              fill
              className="object-contain"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 bg-blue-950/30 backdrop-blur-sm py-4 lg:py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-xs sm:text-sm text-blue-50 text-center sm:text-left">
              © 2024 Tasker Company CRM. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6">
              <Link href="/privacy" className="text-xs sm:text-sm text-blue-100 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs sm:text-sm text-blue-100 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-xs sm:text-sm text-blue-100 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
