"use client"

import { useState } from "react"
import Image from "next/image"
import TimeRangePicker from "@wojtekmaj/react-timerange-picker"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

// const now = new Date();
// const nextHour = new Date();
// nextHour.setHours(nextHour.getHours() + 1);
export default function TimeRanges() {
  const [value, onChange] = useState([])
  return (
    <Popover>
      <PopoverTrigger className="flex flex-row items-center gap-2">
        Time Range
        <Image alt="Down" src="/vectors/Down.svg" width={24} height={24} />
      </PopoverTrigger>
      <PopoverContent className="w-[300px]">
        <RadioGroup defaultValue="option-one">
          <div className="flex items-center justify-between py-2 text-sm text-black">
            <Label htmlFor="time-option-1">00:00 - 12:00</Label>
            <RadioGroupItem value="1" id="time-option-1" />
          </div>
          <div className="flex items-center justify-between py-2 text-sm text-black">
            <Label htmlFor="time-option-2">13:00 - 24:00</Label>
            <RadioGroupItem value="2" id="time-option-2" />
          </div>
          <div className="flex items-center justify-between py-2 text-sm text-black">
            <Label htmlFor="time-option-3">24 hours</Label>
            <RadioGroupItem value="3" id="time-option-3" />
          </div>
          <div className="flex items-center justify-between py-2 text-black">
            <Label htmlFor="time-option-4">Custom Time range</Label>
            <RadioGroupItem value="4" id="time-option-4" />
          </div>
          <div className="grid grid-flow-row grid-cols-2">
            <p className="text-sm font-medium text-black">Start</p>
            <p className="text-sm font-medium text-black">End</p>
          </div>
          <TimeRangePicker
            onChange={onChange}
            value={value}
            className="text-black"
          />
          {value[0]},{value[1]}
          <div className="mt-6 flex items-center justify-between p-0">
            <Button type="submit" variant="outline" className="h-8 w-28">
              Cancel
            </Button>
            <Button type="submit" className="h-8 w-28">
              Apply
            </Button>
          </div>
        </RadioGroup>
      </PopoverContent>
    </Popover>
  )
}
