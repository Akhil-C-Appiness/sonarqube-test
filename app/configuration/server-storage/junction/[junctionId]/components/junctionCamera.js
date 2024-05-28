"use Client"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Image from 'next/image'

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
const JunctionCamera = ()=>{
  return <div className="w-full">
    <div className="w-full">
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>User Credentials</AccordionTrigger>
        <AccordionContent>
           <div className="flex flex-row">
            <div className="p-4">
              <Label for="username"> Username </Label>
              <Input id="username" name="username" className="py-2" />
            </div>
            <div className="p-4">
              <Label for="username"> Password </Label>
              <Input id="password" name="password" type="password" className="py-2" />
            </div>
           </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    </div>
    <div className="py-4">
     <div className="flex">
       <div>Search By Camera</div>
       <div className="flex grow justify-end"><span className="text-slate-500 ">IP Range </span>192.168.1.(1-264)</div>
     </div>
      <div className="flex flex-row gap-4 pt-4">
        <div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Junction" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Junction</SelectLabel>
              <SelectItem value="Junction1">Junction1</SelectItem>
              <SelectItem value="Junction2">Junction2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
        <div>
        <Select>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Model" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Model</SelectLabel>
              <SelectItem value="Model1">Model1</SelectItem>
              <SelectItem value="Model2">Model2</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        </div>
        <div>
          <Button variant={'default'}>Search</Button>
        </div>
        <div className="flex grow justify-end">
          <Button variant={'default'}>Import Camera</Button>
        </div>
      </div>
     
    </div>

    <div className="flex gap-4">
        <div className="bg-blue-100 py-4 w-72">
            <div className="px-4">9 Cameras Found</div>

            <div className="py-4">
              <div className="flex w-full gap-2 bg-white py-4 px-2">
                <div className="h-auto flex items-center"><Checkbox /></div>
                <div className="h-auto flex items-center">Camera 1</div>
                <div className="grow flex flex-col justify-end text-xs text-slate-400  ">
                    <div className="text-right">Model- Axis</div>
                    <div className="text-right">IP - 172.24.8.12</div>
                </div>
              </div>

              <div className="flex w-full gap-2 py-4 px-2">
                <div className="h-auto flex items-center"><Checkbox /></div>
                <div className="h-auto flex items-center">Camera 2</div>
                <div className="grow flex flex-col justify-end text-xs text-slate-400  ">
                    <div className="text-right">Model- Axis</div>
                    <div className="text-right">IP - 172.24.8.12</div>
                </div>
              </div>
            </div>
        </div>
        <div className="bg-slate-50 border w-full grow p-2">
          <div className="flex">
            <div className="text-semibold">Camera 1</div>
            <div className="text-semibold grow text-primary text-right">View input</div>
          </div>
          <div className="pt-4">
            <Image src="/images/camera-search-image.png" width="500" height="300" className="w-full" />
          </div>
          <div className="pt-4">
            <div className="text-slate-400 flex gap-4">
              <div>IP -172.24.8.12</div>
              <div>Model - Axis</div>
              <div><Checkbox /><span className="pl-2">PTZ</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="w-full mt-4 ">
                <div>Recording Stream</div>
                <div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Major Stream" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Major Stream</SelectLabel>
                      <SelectItem value="Major Stream1">Major Stream1</SelectItem>
                      <SelectItem value="Major Stream2">Major Stream2</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>
              </div>
              <div className="w-full mt-4 ">
                <div>Camera Type</div>
                <div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Camera Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Camera Type</SelectLabel>
                      <SelectItem value="RLVD">RLVD</SelectItem>
                      <SelectItem value="RLVD1">RLVD2</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>
              </div>
              <div className="w-full mt-4 ">
                <div>Location</div>
                <div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Location</SelectLabel>
                      <SelectItem value="Newtown">Newtown</SelectItem>
                      <SelectItem value="Newtown">Newtown</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>
              </div>
              <div className="w-full mt-4 ">
                <div>Group</div>
                <div>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Group</SelectLabel>
                      <SelectItem value="RLVD">Group A</SelectItem>
                      <SelectItem value="RLVD1">Group B</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                </div>
              </div>
            </div>
            <div className="mt-4 w-full text-right">
              <Button>Save Changes</Button>
            </div>
          </div>
        </div>
    </div>
  </div>
}
export default JunctionCamera;