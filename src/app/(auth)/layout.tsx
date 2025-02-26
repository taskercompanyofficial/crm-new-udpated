import { Laptop2 } from "lucide-react"
import Link from "next/link"

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2 bg-gradient-to-b from-primary from-50% to-black/5 to-50% px-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/10 text-primary-foreground">
              <Laptop2 className="size-4" />
            </div>
            <span className="text-xl font-medium text-primary-foreground">
              Tasker Company CRM
            </span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md space-y-6 bg-white rounded-lg p-6">
            {children}
          </div>
        </div>
      </div>
      <div className="w-full flex justify-center px-4">
        <div className="relative h-64 md:h-80 lg:h-96 w-full">
          <div className="absolute right-0 bottom-0">
            <img
              src="/assets/login-products.png"
              alt="Orient Product Collection"
              className="object-contain"
            />
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm">
              © 2024 Tasker Company CRM. All rights reserved.
            </div>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-sm">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-sm">
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
