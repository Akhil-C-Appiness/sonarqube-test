import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/event-accordion"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function Filteroptions({
  onCheckboxChange,
  colorfilterValues,
  regTypeValues,
  onChangereg,
  onChangeviolation,
  violationTypeValues,
  clearAll,
  selectAll
}) {
  return (
    <Popover>
      <PopoverTrigger className="flex w-[180px] flex-row items-center justify-between gap-2 rounded-md border p-[7px]">
        Filter Options{" "}
        <Image alt="Down" src="/vectors/Down.svg" width={24} height={24} />
      </PopoverTrigger>
      <PopoverContent>
        {/* <Tabs defaultValue="select"> */}
          {/* <TabsList> */}
            {/* <TabsTrigger
              value="select"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-3.5 h-8"
            >
              Select Filters
            </TabsTrigger> */}
            {/* <TabsTrigger
              value="saved"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-3.5 h-8"
            >
              Saved Filters (2)
            </TabsTrigger> */}
          {/* </TabsList> */}
          {/* <TabsContent value="select" className="p-1"> */}
            {/* <form> */}
            <Accordion type="single" collapsible>
              <AccordionItem value="filter-1">
                <AccordionTrigger>Type of Events </AccordionTrigger>
                <AccordionContent>
                  {/* <div className="flex items-center justify-between py-2">
                    <label
                      htmlFor="option-1"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      All
                    </label>
                    <Checkbox id="option-1" value="All" checked={regTypeValues.includes('All')} onCheckedChange={(e)=>{onChangereg(e,"All")}}/>
                  </div> */}
                  <div className="flex items-center justify-between py-2">
                    <label
                      htmlFor="option-2"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      No Seat Belt
                    </label>
                    <Checkbox
                      id="option-2"
                      value="No Seat Belt"
                      checked={violationTypeValues.includes("No Seat Belt")}
                      onCheckedChange={(e) => {
                        onChangeviolation(e, "No Seat Belt")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <label
                      htmlFor="option-3"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Over Speed
                    </label>
                    <Checkbox
                      id="option-3"
                      value="Over Speed"
                      checked={violationTypeValues.includes("Over Speed")}
                      onCheckedChange={(e) => {
                        onChangeviolation(e, "Over Speed")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <label
                      htmlFor="option-4"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      No Helmet
                    </label>
                    <Checkbox
                      id="option-4"
                      value="No Helmet"
                      checked={violationTypeValues.includes("No Helmet")}
                      onCheckedChange={(e) => {
                        onChangeviolation(e, "No Helmet")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <label
                      htmlFor="option-5"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Red Light Violation Detection
                    </label>
                    <Checkbox
                      id="option-5"
                      value="Red Light Violation Detection"
                      checked={violationTypeValues.includes("Red Light Violation Detection")}
                      onCheckedChange={(e) => {
                        onChangeviolation(e, "Red Light Violation Detection")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <label
                      htmlFor="option-6"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Stop Line Violation
                    </label>
                    <Checkbox
                      id="option-6"
                      value="Stop Line Violation"
                      checked={violationTypeValues.includes("Stop Line Violation")}
                      onCheckedChange={(e) => {
                        onChangeviolation(e, "Stop Line Violation")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <label
                      htmlFor="option-7"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      License Plate Recognition
                    </label>
                    <Checkbox
                      id="option-6"
                      value="License Plate Recognition"
                      checked={violationTypeValues.includes(
                        "License Plate Recognition"
                      )}
                      onCheckedChange={(e) => {
                        onChangeviolation(e, "License Plate Recognition")
                      }}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/* <AccordionItem value="filter-2">
                <AccordionTrigger>Vehicle Type </AccordionTrigger>
                <AccordionContent></AccordionContent>
              </AccordionItem> */}
              <AccordionItem value="filter-3">
                <AccordionTrigger>Registration type </AccordionTrigger>
                <AccordionContent>
                  {/* <div className="flex items-center justify-between py-2">
                    <Label htmlFor="regType-1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">All</Label>
                    <Checkbox id="regType-1" value="" checked={regTypeValues.includes('')} onCheckedChange={(e)=>{onChangereg(e,"")}}/>
                  </div> */}
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="regType-2"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Army
                    </Label>
                    <Checkbox
                      id="regType-2"
                      value="Army"
                      checked={regTypeValues.includes("Army")}
                      onCheckedChange={(e) => {
                        onChangereg(e, "Army")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="regType-3"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Commercial
                    </Label>
                    <Checkbox
                      id="regType-3"
                      value="Commercial"
                      checked={regTypeValues.includes("Commercial")}
                      onCheckedChange={(e) => {
                        onChangereg(e, "Commercial")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="regType-4"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Electrical
                    </Label>
                    <Checkbox
                      id="regType-4"
                      value="Electrical"
                      checked={regTypeValues.includes("Electrical")}
                      onCheckedChange={(e) => {
                        onChangereg(e, "Electrical")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="regType-5"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Private
                    </Label>
                    <Checkbox
                      id="regType-5"
                      value="Private"
                      checked={regTypeValues.includes("Private")}
                      onCheckedChange={(e) => {
                        onChangereg(e, "Private")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="regType-6"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Others
                    </Label>
                    <Checkbox
                      id="regType-6"
                      value="Others"
                      checked={regTypeValues.includes("Others")}
                      onCheckedChange={(e) => {
                        onChangereg(e, "Others")
                      }}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="filter-4">
                <AccordionTrigger>Vehicle color</AccordionTrigger>
                <AccordionContent>
                  {/* <div className="flex items-center justify-between py-2">
                    <Label htmlFor="color-1" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">All</Label>
                    <Checkbox id="color-1"  value="All" checked={colorfilterValues.includes('Black')} onCheckedChange={(e)=>{onCheckboxChange(e,"Black")}}/>
                  </div> */}
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-2"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Black
                    </Label>
                    <Checkbox
                      id="color-2"
                      value="Black"
                      checked={colorfilterValues.includes("Black")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Black")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-3"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Blue
                    </Label>
                    <Checkbox
                      id="color-3"
                      value="Black"
                      checked={colorfilterValues.includes("Blue")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Blue")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-4"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Brown
                    </Label>
                    <Checkbox
                      id="color-4"
                      value="Brown"
                      checked={colorfilterValues.includes("Brown")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Brown")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-5"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Gray
                    </Label>
                    <Checkbox
                      id="color-5"
                      value="Gray"
                      checked={colorfilterValues.includes("Gray")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Gray")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-6"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Green
                    </Label>
                    <Checkbox
                      id="color-6"
                      value="Green"
                      checked={colorfilterValues.includes("Green")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Green")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-7"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Orange
                    </Label>
                    <Checkbox
                      id="color-7"
                      value="Orange"
                      checked={colorfilterValues.includes("Orange")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Orange")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-8"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Red
                    </Label>
                    <Checkbox
                      id="color-8"
                      value="Red"
                      checked={colorfilterValues.includes("Red")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Red")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-9"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Silver
                    </Label>
                    <Checkbox
                      id="color-9"
                      value="Silver"
                      checked={colorfilterValues.includes("Silver")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Silver")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-10"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Undetermeined
                    </Label>
                    <Checkbox
                      id="color-10"
                      value="Undetermeined"
                      checked={colorfilterValues.includes("Undetermeined")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Undetermeined")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-11"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      White
                    </Label>
                    <Checkbox
                      id="color-11"
                      value="White"
                      checked={colorfilterValues.includes("White")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "White")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-12"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Yellow
                    </Label>
                    <Checkbox
                      id="color-12"
                      value="Yellow"
                      checked={colorfilterValues.includes("Yellow")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Yellow")
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label
                      htmlFor="color-13"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    >
                      Notapplicable
                    </Label>
                    <Checkbox
                      id="color-13"
                      value="Notapplicable"
                      checked={colorfilterValues.includes("Notapplicable")}
                      onCheckedChange={(e) => {
                        onCheckboxChange(e, "Notapplicable")
                      }}
                    />
                  </div>
                </AccordionContent>
              </AccordionItem>
              {/* <AccordionItem value="filter-5">
                <AccordionTrigger>Speed Limit</AccordionTrigger>
                <AccordionContent>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="speed-" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">10 km/hr</Label>
                    <Checkbox id="speed-" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="speed-" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">20 km/hr</Label>
                    <Checkbox id="speed-" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="speed-" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">30 km/hr</Label>
                    <Checkbox id="speed-" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="speed-" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">40 km/hr</Label>
                    <Checkbox id="speed-" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="speed-" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">50 km/hr</Label>
                    <Checkbox id="speed-" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="speed-" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">60 km/hr</Label>
                    <Checkbox id="speed-" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="speed-" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">70 km/hr</Label>
                    <Checkbox id="speed-" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="speed-" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">80 km/hr</Label>
                    <Checkbox id="speed-" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="speed-" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">90 km/hr</Label>
                    <Checkbox id="speed-" />
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <Label htmlFor="speed-" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">100 km/hr</Label>
                    <Checkbox id="speed-" />
                  </div>
                </AccordionContent>
              </AccordionItem> */}
            </Accordion>
            {/* <div className="flex items-center flex-row-reverse p-0 mt-10 mb-2">
              <Button variant="link" className="p-1">
                Clear All
              </Button>
            </div> */} 
            <hr />
            <div className="flex items-center justify-between p-0">
              {/* <Button type="submit" variant="outline" className="h-8 w-28">
                Save Filter
              </Button> */}
              <Button variant="link" className="p-1" onClick={selectAll}>
                Select All
              </Button>
              <Button variant="link" className="p-1" onClick={clearAll}>
                Clear All
              </Button>
            </div>
            {/* </form> */}
          {/* </TabsContent> */}
          {/* <TabsContent value="saved" className="p-1">
            <RadioGroup defaultValue="option-one">
              <div className="flex items-center justify-between py-2 text-sm text-black">
                <Label htmlFor="saved-option-1">Two Wheeler Violation</Label>
                <RadioGroupItem value="option-one" id="saved-option-1" />
              </div>
              <div className="flex items-center justify-between py-2 text-sm text-black">
                <Label htmlFor="saved-option-2">Filter List 2</Label>
                <RadioGroupItem value="option-two" id="osaved-option-2" />
              </div>
              <div className="flex items-center justify-between py-2 text-sm text-black">
                <Label htmlFor="saved-option-3">Filter List 3</Label>
                <RadioGroupItem value="option-3" id="osaved-option-3" />
              </div>
            </RadioGroup>
          </TabsContent>
        </Tabs> */}
      </PopoverContent>
    </Popover>
  )
}
