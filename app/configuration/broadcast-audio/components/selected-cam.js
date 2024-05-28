import React from "react"
import Image from "next/image"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

export const SelectedCam = ({ isVisible, onClose }) => {
  return (
    <div
      className={` mx-4 rounded-sm border border-blue-400 bg-[#F2F8FF] p-4 ${
        isVisible ? "block" : "hidden"
      }`}
    >
      <div className="flex flex-row justify-between">
        <h1 className="text-[14px] font-semibold">Select Camera(s)</h1>
      </div>
      <div className="my-2">
        <Accordion type="multiple" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="flex flex-row items-center gap-2">
                <span className="text-sm">2nd Phase (4 Cameras Selected)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4">
                <label className="flex items-center gap-2 py-4">
                  <Image
                    alt="cctv icon"
                    src="/vectors/cctv_icon.svg"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm">2nd Phase_01</span>
                  {/* <Image
                    src="/images/close-icon.svg"
                    alt="close icon"
                    width={20}
                    height={20}
                    className="flex justify-end"
                  /> */}
                </label>
                <label className="flex items-center gap-2 py-4">
                  <Image
                    alt="cctv icon"
                    src="/vectors/cctv_icon.svg"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm">2nd Phase_02</span>
                </label>
                <label className="flex items-center gap-2 py-4">
                  <Image
                    alt="cctv icon"
                    src="/vectors/cctv_icon.svg"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm">2nd Phase_03</span>
                </label>
                <label className="flex items-center gap-2 py-4">
                  <Image
                    alt="cctv icon"
                    src="/vectors/cctv_icon.svg"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm">2nd Phase_04</span>
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>
              <div className="flex flex-row items-center gap-2">
                <span className="text-sm">3rd Phase (2 Cameras Selected)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4">
                <label className="flex items-center gap-2 py-4">
                  <Image
                    alt="cctv icon"
                    src="/vectors/cctv_icon.svg"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm">3rd Phase_01</span>
                </label>
                <label className="flex items-center gap-2 py-4">
                  <Image
                    alt="cctv icon"
                    src="/vectors/cctv_icon.svg"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm">3rd Phase_02</span>
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>
              <div className="flex flex-row items-center gap-2">
                <span className="text-sm">4th Phase (1 Cameras Selected)</span>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="pl-4">
                <label className="flex items-center gap-2 py-4">
                  <Image
                    alt="cctv icon"
                    src="/vectors/cctv_icon.svg"
                    width={24}
                    height={24}
                  />
                  <span className="text-sm">4th Phase_01</span>
                </label>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      <div className="flex flex-row justify-end">
        <Button>Start Broadcasting Audio</Button>
      </div>
    </div>
  )
}
