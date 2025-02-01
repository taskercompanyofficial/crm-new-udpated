import { Laptop2 } from "lucide-react"
import Image from "next/image"

export default function LoginLayout({children}:{children:React.ReactNode}) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <Laptop2 className="size-4" />
            </div>
            Tasker Company CRM
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
      <div className="relative hidden bg-muted lg:block">
        <Image
          src="https://images.unsplash.com/photo-1497366754035-f200968a6e72"
          alt="Modern office workspace" 
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
          width={1920}
          height={1280}
          priority
        />
      </div>
    </div>
  )
}
