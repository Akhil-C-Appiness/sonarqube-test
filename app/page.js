import Link from "next/link"

import { siteConfig } from "@/config/site"
import { buttonVariants } from "@/components/ui/button"
import { redirect } from 'next/navigation'
export default function IndexPage() {
  redirect('/login')
  return (
    <section className="container grid items-center gap-6 pb-8 pt-6 md:py-10">
      <div className="flex max-w-[980px] flex-col items-start gap-2">
        <h1 className="text-3xl font-extrabold leading-tight tracking-tighter sm:text-3xl md:text-5xl lg:text-6xl">
          Welcome to Videonetics ITMS <br className="hidden sm:inline" />
          built with Radix UI and Tailwind CSS.
        </h1>
      </div>
    </section>
  )
}
