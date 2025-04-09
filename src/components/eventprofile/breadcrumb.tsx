import * as React from "react"
import Link from "next/link"
import { ChevronRight } from 'lucide-react'

export function Breadcrumb() {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/" className="hover:text-foreground">
        Home
      </Link>
      <ChevronRight className="h-4 w-4" />
      <Link href="/portfolio" className="hover:text-foreground">
        Portfolio
      </Link>
      <ChevronRight className="h-4 w-4" />
      <span className="text-foreground">Event portfolio</span>
    </nav>
  )
}

