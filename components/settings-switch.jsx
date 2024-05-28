import * as React from "react"
import { useState } from "react"
import { useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import useStore from "@/store/store"
import { Settings } from "lucide-react"

import { getCities, userLogout } from "@/lib/api"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function SettingSwt() {
  const fetchCities = useStore((state) => state.setCities)
  const cities = useStore((state) => state.cities)
  const [position, setPosition] = useState("Location")
  const setSelectedCity = useStore((state) => state.setSelectedCity)
  const selectedCity = useStore((state) => state.selectedCity)

  const router = useRouter()

  useEffect(() => {
    fetchCities()
  }, [])

  useEffect(() => {
    if (cities.length) {
      // setSelectedCity(cities[0]?.id)
      handleCity(cities[0]?.name, cities[0]?.id)
    }
  }, [cities])

  const handleCity = (val, id) => {
    setPosition(val)
    setSelectedCity(id)
  }
  React.useEffect(() => {
    const res = getCities()
    console.log(res)
  }, [])

  const onLogout = async () => {
    router.push("/login")
    const userdata = await userLogout()
    if (userdata.status == 2003) {
    } else {
      seterrormsg(userdata.message)
    }
  }
  return (
    <>
      <div className="flex items-center justify-evenly">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="outline">{position}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {cities.map((city) => {
              return (
                <DropdownMenuItem
                  key={city.id}
                  onSelect={(e) => {
                    handleCity(e.target.outerText, city.id)
                  }}
                >
                  {city.name}
                </DropdownMenuItem>
              )
            })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Popover>
        <PopoverTrigger>
          <Button
            variant="outline"
            className="w-10 rounded-full border-none p-0"
          >
            {/* <Settings className="h-4 w-4" /> */}
            <Image
              src="/images/Profile_icons.svg"
              width="24"
              height="40"
              alt="user"
            />
            <span className="sr-only">Open popover</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-30 p-0">
          <div className="grid gap-3">
            <div onClick={onLogout}>
              <Button variant="link" className="text-md">
                Logout
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  )
}
