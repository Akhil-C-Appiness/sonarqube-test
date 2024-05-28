"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
// import Image from "next/image"
// import Link from "next/link"

import { usePathname } from "next/navigation"
import useStore from "@/store/store"
import { ResetIcon } from "@radix-ui/react-icons"
import {
  addDays,
  addMonths,
  format,
  isAfter,
  isBefore,
  isToday,
} from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import moment from "moment"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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

const buttons = [
  {
    btn: "Today",
    link: "today",
    id: 1,
  },
  {
    btn: "Week",
    link: "week",
    id: 2,
  },
  {
    btn: "Month",
    link: "month",
    id: 3,
  },
]
const Image = dynamic(() => import("next/image"))
const Link = dynamic(() => import("next/link"))

const PreActions = ({
  selectedAreaId,
  setSelectedAreaId,
  selectedJunctionId,
  setSelectedJunctionId,
  selectedChannelIds,
  setSelectedChannelIds,
  date,
  setDate,
  handleRefreshClick,
  selectedAreas,
  selectedJunctions,
  selectedChannels,
  setSelectedAreas,
  setSelectedJunctions,
  setSelectedChannels,
  handleLocationSelection,
  handleDateChange,
  showDateRange,
  selectedValue,
  setSelectedValue,
  setResetTimer,
  resetTimer,
  selArea,
  setSelArea,
  setShowDateRange,
  selectedTab,
  setSelectedTab,
  getSelectedTab,
  selectAllJunctions,
  setSelectAllJunctions,
  setmsId,
}) => {
  const pathname = usePathname()
  let trimmedPathname = pathname.slice(11)
  const [resetCal, setResetCal] = useState(null)
  const areas = useStore((state) => state.areas)
  const junctions = useStore((state) => state.junctions)
  const channels = useStore((state) => state.channels)
  const resetFlow = useStore((state) => state.resetOverview)
  const resetChannelIds = useStore((state) => state.resetChannelIds)

  // const [selectedAreas, setSelectedAreas] = useState([])
  // const [selectedChannels, setSelectedChannels] = useState([])
  // const [selectedJunctions, setSelectedJunctions] = useState([])
  // const [selectedValue, setSelectedValue] = useState(5)
  const [selectAll, setSelectAll] = useState(false)
  const today = new Date()
  const currentYear = today.getFullYear()
  const currentMonth = today.getMonth()

  const lastMonth = new Date(currentYear, currentMonth - 1)

  const resetCalendar = () => {
    setDate({
      from: "",
      to: "",
    })
    setResetTimer((prev) => !prev)
    resetFlow([])
    // setShowDateRange(false)
  }
  useEffect(() => {
    if (junctions.length > 0) {
      setSelectedJunctionId(junctions?.map((junction) => junction.id))
      setSelectedJunctions(junctions)
    } else {
      setSelectedJunctionId([])
      setSelectedJunctions([])
    }
  }, [junctions])

  // useEffect(() => {
  //   if (selectedJunctionId.length === junctions?.length) {
  //     setSelectAllJunctions(true)
  //   } else {
  //     setSelectAllJunctions(false)
  //   }
  // },[junctions?.length, selectedJunctionId.length])

  const handleAreaSelection = (val) => {
    setSelArea(val)
    setSelectAllJunctions(true)
    setSelectedJunctionId([])
    setSelectedChannelIds([])
    // if (selectedAreaId.includes(id)) {
    // console.log("checked id if part", e, id)

    //   setSelectedAreaId((prev) => prev.filter((item) => item !== id))
    //   setSelectedAreas(selectedAreas?.filter((area) => area.id !== id))
    // }
    // else {
    // console.log("checked id else part", e, id)

    //   setSelectedAreaId((prev) => [...selectedAreaId, id])
    //   const findArea = areas?.find((area) => area.id === id)
    //   console.log("findArea", findArea);
    //   setSelectedAreas((prev) => [...prev, findArea])

    // }

    // setSelectedAreaId([id])
    // const findArea = areas?.find((area) => area.id === id)
    // setSelectedAreas(findArea ? [findArea] : [])
  }

  const handleJunctionSelection = (e, id) => {
    // console.log("check junction", e, id)

    // if (selectedJunctionId.includes(id)) {
    //   setSelectedJunctionId((prev) => prev.filter((item) => item !== id))
    //   setSelectedJunctions(
    //     selectedJunctions?.filter((junction) => junction.id !== id)
    //   )
    // } else {
    //   setSelectedJunctionId((prev) => [...selectedJunctionId, id])
    //   const findJunction = junctions?.find((junction) => junction.id === id)
    //   setSelectedJunctions((prev) => [...prev, findJunction])
    // }
    setSelectedJunctionId([id])
    const findJunction = junctions?.find((junction) => junction.id === id)
    setSelectedJunctions(findJunction ? [findJunction] : [])
  }
  const handleSelectAllJunctions = (e) => {
    setSelectAllJunctions(e)
    if (e) {
      setSelectedJunctionId(junctions?.map((junction) => junction.id))
      setSelectedJunctions(junctions)
    } else {
      setSelectedJunctionId([])
      setSelectedJunctions([])
    }
  }
  const handleChannelSelection = (e, id) => {
    console.log("check channels", e, id)

    if (selectedChannelIds.includes(id)) {
      console.log("apply active", e, id)

      setSelectedChannelIds((prev) => prev.filter((item) => item !== id))
      setSelectedChannels(
        selectedChannels?.filter((channel) => channel.id !== id)
      )
    } else {
      setSelectedChannelIds((prev) => [...selectedChannelIds, id])
      const findChannel = channels?.find((channel) => channel.id === id)
      setSelectedChannels((prev) => [...prev, findChannel])
    }
  }
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedChannelIds([])
      setSelectedChannels([])
    } else {
      const allCheckedIds = channels.map((channel) => channel.id)
      const allCheckedChannelNames = channels.map((channel) => channel.ip)
      setSelectedChannels(allCheckedChannelNames)
      setSelectedChannelIds(allCheckedIds)
    }
    setSelectAll(!selectAll)
  }

  const handleAutoRefresh = (value) => {
    setSelectedValue(parseInt(value))
    setResetTimer((prev) => !prev)
  }
  useEffect(() => {}, [
    selectedAreas,
    selectedAreaId,
    selectedJunctions,
    selectedJunctionId,
  ])
  const handleReset = () => {
    setSelArea(null)
    setSelectedJunctions([])
    setSelectedChannels([])
    setSelectedChannelIds([])
    setSelectedJunctionId([])
    resetChannelIds([])
    handleRefreshClick()
    resetFlow([])
    setmsId(null)
  }

  return (
    <>
      <section className="mt-[0.5em] flex h-20 w-full  grow flex-row items-center  justify-start gap-[1em] border-b border-b-[#2A94E5] bg-[#FFFFFF] p-[1em]">
        <div className="flex items-center justify-start">
          {buttons?.map((btn) => (
            <Link href={`/dashboard/${btn.link}`}>
              <Button
                variant="outline"
                key={btn.id}
                onClick={() => {
                  setDate({
                    from: "",
                    to: "",
                  })
                  setResetTimer((prev) => !prev)
                  resetFlow([])
                  setSelectedTab(btn.btn)
                  getSelectedTab(btn.btn)
                }}
                className={
                  trimmedPathname === `${btn.link}` &&
                  ((date?.to === "" && date?.from === "") ||
                    date?.from === "" ||
                    date?.to === undefined) &&
                  "rounded-none bg-[#2A94E5] text-white"
                }
              >
                {btn.btn}
              </Button>
            </Link>
          ))}
        </div>
        <div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-[300px] justify-start text-left font-normal",
                  !date && "text-muted-foreground",
                  showDateRange && date.from !== "" && "bg-[#2A94E5] text-white"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date?.from && showDateRange ? (
                  date?.to ? (
                    <>
                      {format(date?.from, "LLL dd, y")} -{" "}
                      {format(date?.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(date?.from, "LLL dd, y")
                  )
                ) : (
                  <span>Pick a date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={lastMonth}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                max={30}
              />
              <div className="px-3 pb-3 text-center">
                <PopoverClose asChild>
                  <Button
                    onClick={handleDateChange}
                    className="w-[150px]"
                    disabled={
                      date?.from !== "" &&
                      date?.to !== "" &&
                      date?.from !== "" &&
                      date?.to !== undefined &&
                      date?.from !== undefined &&
                      date?.to !== ""
                        ? false
                        : true
                    }
                  >
                    Apply
                  </Button>
                </PopoverClose>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <span>Location</span>
              <Image
                src="/vectors/Down.svg"
                alt="arrow-down"
                width={14.4}
                height={8.4}
              />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
            <Accordion type="single" collapsible>
              <ScrollArea className=" max-h-64 w-[250px] overflow-y-scroll px-1.5">
                <AccordionItem value="Area" className="px-2">
                  <AccordionTrigger className="hover:no-underline">
                    {process.env.NEXT_PUBLIC_LOCATION_NAME}
                  </AccordionTrigger>
                  <AccordionContent>
                    <RadioGroup
                      value={selArea}
                      onValueChange={(value) => handleAreaSelection(value)}
                    >
                      {areas?.map((area) => (
                        <div className="flex items-center justify-start gap-2 py-2 text-sm text-black">
                          <RadioGroupItem
                            value={area.id}
                            id={area.id}
                            className="h-4 w-4 rounded-full"
                          />
                          <label htmlFor={area.id}>{area.name}</label>
                        </div>
                      ))}
                    </RadioGroup>
                    {/* {areas?.map((area) => (
                      <div
                        className="flex items-center justify-between"
                        key={area.id}
                      >
                        {area.name}
                        <Checkbox
                          onCheckedChange={(e) =>
                            handleAreaSelection(e, area.id)
                          }
                          checked={selectedAreaId?.includes(area.id)}
                        />
                      </div>
                    ))} */}
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="Area" className="px-2">
                  <AccordionTrigger className="hover:no-underline">
                    Junction
                  </AccordionTrigger>
                  <AccordionContent>
                    {selArea && junctions?.length > 0 && (
                      <div className="flex items-center justify-between">
                        All
                        <Checkbox
                          checked={selectAllJunctions}
                          onCheckedChange={(e) => handleSelectAllJunctions(e)}
                        />
                      </div>
                    )}
                    {selArea &&
                      junctions?.map((junction) => (
                        <div
                          className="flex items-center justify-between"
                          key={junction.id}
                        >
                          {junction.name}
                          <Checkbox
                            onCheckedChange={(e) =>
                              handleJunctionSelection(e, junction.id)
                            }
                            checked={
                              selectAllJunctions
                                ? true
                                : selectedJunctionId?.includes(junction.id)
                            }
                          />
                        </div>
                      ))}
                  </AccordionContent>
                </AccordionItem>
                {!selectAllJunctions && selectedJunctionId?.length > 0 && (
                  <AccordionItem value="Area" className="px-2">
                    <AccordionTrigger className="hover:no-underline">
                      Camera
                    </AccordionTrigger>
                    <AccordionContent>
                      {selectedJunctionId?.length > 0 && (
                        <div className="flex items-center justify-between">
                          All
                          <Checkbox
                            checked={selectAll}
                            onCheckedChange={handleSelectAll}
                          />
                        </div>
                      )}
                      {selectedJunctionId?.length > 0 &&
                        !selectAllJunctions &&
                        channels?.map((channel) => (
                          <div className="flex items-center justify-between">
                            {channel.name}
                            <Checkbox
                              checked={selectedChannelIds.includes(channel.id)}
                              onCheckedChange={(e) =>
                                handleChannelSelection(e, channel.id)
                              }
                            />
                          </div>
                        ))}
                    </AccordionContent>
                  </AccordionItem>
                )}
              </ScrollArea>
            </Accordion>
            <DropdownMenuItem>
              <div className="w-full pb-1 pt-2">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleLocationSelection}
                  // disabled={selectedAreaId.length > 0 ? false : true}
                >
                  Apply
                </Button>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <ResetIcon onClick={handleReset} className="cursor-pointer" />
        <div className="flex gap-2">
          {selectedAreas.length > 0 && (
            <div className="flex items-center justify-center rounded-md border border-primary bg-blue-50 px-2 text-sm">
              {selectedAreas?.map((area) => area.name).join(", ")}
              {/* {selectedJunctions.length > 0 && (
                <>
                  <br />
                  Junction:{" "}
                  {selectedJunctions
                    ?.map((junction) => junction.name)
                    .join(", ")}
                </>
              )} */}
              {/* {selectedChannels.length > 0 && selectedJunctions.length > 0 && <br />} */}
              {/* {selectedChannels.length > 0 && (
                <>
                  <br />
                  Cameras:{" "}
                  {selectedChannels
                    ?.map((channel) => (channel.name ? channel.name : channel))
                    .join(", ")}
                </>
              )} */}
            </div>
          )}
          {selectedJunctions.length > 0 && (
            <div className="flex items-center justify-center rounded-md border border-primary bg-blue-50 px-2 text-sm">
              {/* <br /> */}{" "}
              {selectedJunctions?.map((junction) => junction.name).join(", ")}
            </div>
          )}
          {selectedChannels.length > 0 && (
            <div className="h-10 items-center justify-center overflow-y-scroll rounded-md border border-primary bg-blue-50 px-2 text-sm">
              {" "}
              {selectedChannels?.map((channel, index) => (
                <div key={channel.id}>
                  <span>{index + 1}. </span>
                  <span>{channel.name ? channel.name : channel}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="ml-[auto] flex flex-row items-center gap-[1em]">
          <Image
            src="/vectors/Refresh blue.svg"
            alt="refresh"
            width={14.4}
            height={8.4}
            onClick={handleRefreshClick}
            className="cursor-pointer"
          />
          <Select
            className="w-28"
            onValueChange={handleAutoRefresh}
            value={selectedValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="2 mins" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={2}>2 mins</SelectItem>
              <SelectItem value={5}>5 mins</SelectItem>
              <SelectItem value={10}>10 mins</SelectItem>
              <SelectItem value={15}>15 mins</SelectItem>
              {/* <SelectItem value="30">30 mins</SelectItem> */}
            </SelectContent>
          </Select>
        </div>
      </section>
    </>
  )
}

export default PreActions
