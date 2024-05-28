"use client"

import React from "react"
import Image from "next/image"
import { usePathname } from "next/navigation"

import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const MenuOptions = (props) => {
  const pathname = usePathname()
  const trimmedPathname = pathname.slice(7)
  return (
    <>
      <Select onValueChange={(e) => props.handleMenuOptions(e)}>
        <SelectTrigger className="h-11 w-[171px]">
          <SelectValue placeholder="Menu Options" />
        </SelectTrigger>
        <SelectContent>
          <ScrollArea
            className={
              trimmedPathname === "archive"
                ? "h-52 w-48 rounded-md"
                : "h-80 w-48 rounded-md"
            }
          >
            {props.menuOptions?.map((menuOption, index) => (
              <SelectItem value={menuOption.value} key={index}>
                <div className="flex flex-row items-center gap-2">
                  <Image
                    alt={menuOption.alt}
                    src={menuOption.src}
                    width={24}
                    height={24}
                  />
                  <span className="text-[#6F6F70]">
                    {menuOption.menuOption}
                  </span>
                </div>
              </SelectItem>
            ))}
          </ScrollArea>
        </SelectContent>
      </Select>
    </>
  )
}

export default MenuOptions
