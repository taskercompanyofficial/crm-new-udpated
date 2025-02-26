import { Laptop2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-gradient-to-br from-sky-900 via-sky-700 to-sky-500 px-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-blue-100/20 text-blue-50">
              <Laptop2 className="size-4" />
            </div>
            <span className="text-xl font-medium text-blue-50">
              Tasker Company CRM
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-6 bg-white/10 backdrop-blur-lg rounded-lg p-6 shadow-xl border border-white/20">
            {children}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center px-4 items-center">
        <div className="relative h-64 md:h-80 lg:h-96 w-full flex justify-center items-center">
          <Image
            src="/assets/login-products.png"
            alt="Orient Product Collection"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-blue-950/30 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-blue-50">
              © 2024 Tasker Company CRM. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-blue-100 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm text-blue-100 hover:text-white transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm text-blue-100 hover:text-white transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
