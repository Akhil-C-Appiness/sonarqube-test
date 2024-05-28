import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

import { NavItem } from "@/types/nav"
import { siteConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Icons } from "@/components/icons"

interface MainNavProps {
  items?: NavItem[]
}
const status: { title: string; href: string; description: string }[] = [
  {
    title: "Valid Event",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Unchecked",
    href: "/docs/primitives/hover-card",
    description:
      "For sighted users to preview content available behind a link.",
  },
  {
    title: "Spurious",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
]

export function MainNav({ items }: MainNavProps) {
  return (
    <div className="flex gap-6 md:gap-10">
      <Link href="/dashboard/today" className="hidden  py-2 items-center space-x-2 md:flex">
        <Image src="/itms-logo-v2.svg" 
        width="500"
          height="100"
          alt="logo"
          className="absolute left-1 p-2" />
        {/* <Image
          src="/images/Videonetics_logo.svg"
          width="60"
          height="10"
          alt="logo"
          className="absolute left-1"
        />
        <hr className="w-1" />
        <div className="pl-0">
          <span className="w-80 text-[#6F6F70] sm:block">Videonetics</span>
          <span className="hidden font-bold text-[#2A94E5] sm:inline-block">
            {siteConfig.name}
          </span>
        </div> */}
      </Link>
      {items?.length ? (
        <nav className="hidden gap-6 md:flex">
          {items?.map(
            (item, index) =>
              item.href && (
                <Link
                  key={index}
                  href={item.href}
                  className={cn(
                    "flex items-center text-lg font-semibold text-muted-foreground sm:text-sm",
                    item.disabled && "cursor-not-allowed opacity-80"
                  )}
                >
                  {item.title}
                </Link>
              )
          )}
        </nav>
      ) : null}

      {/* <form>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <Image
              src="/images/search.svg"
              alt="search"
              width="20"
              height="20"
              className="stroke-cyan-500 hover:stroke-cyan-700"
            />
          </div>
          <input
            type="search"
            id="default-search"
            className="my-4 block h-full w-full rounded-full border border-gray-300 bg-gray-50 p-4 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            placeholder="search for camera"
          />
        </div>
      </form> */}
      {/* <NavigationMenu className="absolute right-80 mt-6">
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
                />
              </svg>
              Status
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                {status.map((component) => (
                  <li
                    key={component.title}
                    title={component.title}
                  >
                    {component.title}
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu> */}
      {/* <div className="absolute right-60 mt-8 flex  text-sm ">
        <button className="relative flex font-medium text-[#2A94E5] underline underline-offset-4">
          <Image
            src="/images/Notification.svg"
            alt="notification"
            width="15"
            height="10"
            className="mt-1"
          />
          Alerts
        </button>
      </div> */}
    </div>
  )
}
