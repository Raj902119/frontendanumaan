import Link from "next/link"
import { Mountain } from 'lucide-react'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="h-14 flex items-center px-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Mountain className="h-6 w-6 text-[#4461F2]" />
          <span className="text-xl font-semibold">Anumaan</span>
        </Link>
      </header>
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          {children}
        </div>
      </main>
    </div>
  )
}

