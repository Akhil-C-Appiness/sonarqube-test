"use client"

import React, { useState } from "react"
import Image from "next/image"
import { AccordionItem } from "@radix-ui/react-accordion"
import { SelectedCam } from "./components/selected-cam"
import { Accordion, AccordionContent, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"

const BAConfig = () => {
  const [selectedValue, setSelectedValue] = useState("")
  const [fileButtonDisabled, setFileButtonDisabled] = useState(true)
  const [isPopupVisible, setPopupVisible] = useState(false);

  const [cameraOptions, setCameraOptions] = useState({
    camera1: false,
    camera2: false,
    camera3: false,
    camera4: false,
  })

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value)
    if (event.target.value === "Use microphone/Line IN") {
      setFileButtonDisabled(true)
    } else {
      setFileButtonDisabled(false)
    }
  }
  const handleCameraCheckboxChange = (camera) => {
    setCameraOptions((prevOptions) => ({
      ...prevOptions,
      [camera]: !prevOptions[camera],
    }))
  }
  const handleCameraClick = () => {
    setPopupVisible(true);
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  return (
    <>
      <div className="p-8">
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-[20px] font-semibold">Broadcast Audio</h1>
        </div>
        <div className="flex flex-row items-center justify-between">
          <h1 className="text-[16px] font-semibold">Select Mode</h1>
        </div>
        <div className="flex flex-row items-center justify-between ">
          <div>
            <label>
              <input
                type="radio"
                value="Use microphone/Line IN"
                checked={selectedValue === "Use microphone/Line IN"}
                onChange={handleRadioChange}
              />
              Use microphone/Line IN
            </label>
          </div>
          <div className="gap-4">
            <label className="mx-5">
              <input
                type="radio"
                value="Use Audio File"
                checked={selectedValue === "Use Audio File"}
                onChange={handleRadioChange}
              />
              Use Audio File
            </label>
            <Button
              variant="outline"
              disabled={fileButtonDisabled}
              className={`mx-5 ${
                fileButtonDisabled ? "bg-slate-300 text-white" : ""
              }`}
            >
              Select file from system
            </Button>
            <label className="mx-5">
              <input
                type="checkbox"
                value="repeatAudio"
                checked={selectedValue === "Use Audio File"}
                onChange={handleRadioChange}
              />
              Repeat Audio
            </label>
          </div>
        </div>
        <div className="mt-6">
          <div className="">
            <h1 className="text-[16px] font-semibold">Select Camera(s)</h1>
            <div>
              <Input
                id=""
                name=""
                className="my-4 w-[50%] rounded-full py-2 pl-10"
                placeholder="Search junctions or cameras"
              >
               
              </Input>
            </div>
            <div className="flex flex-row">
            <div className="w-[50%]">
              <Accordion type="single" collapsible>
                <AccordionItem value="item-1" onClick={handleCameraClick}>
                  <AccordionTrigger>
                    <div className="flex flex-row items-center gap-2">
                      <Checkbox />
                      <span className="text-sm">1st Phase (12 Cameras)</span>
                    </div>
                  </AccordionTrigger>
                </AccordionItem>
                <AccordionItem value="item-2" onClick={handleCameraClick}>
                  <AccordionTrigger>
                    <div className="flex flex-row items-center gap-2">
                      <Checkbox />

                      <span className="text-sm">2nd Phase (4 Cameras)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                  <div className="pl-4">
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">2nd Phase_01</span>
                    </label>
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">2nd Phase_02</span>
                    </label>
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">2nd Phase_03</span>
                    </label>
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">2nd Phase_04</span>
                    </label>
                  </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" onClick={handleCameraClick}>
                  <AccordionTrigger>
                    <div className="flex flex-row items-center gap-2">
                      <Checkbox />

                      <span className="text-sm">3rd Phase (4 Cameras)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                  <div className="pl-4">
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">3rd Phase_01</span>
                    </label>
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">3rd Phase_02</span>
                    </label>
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">3rd Phase_03</span>
                    </label>
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">3rd Phase_04</span>
                    </label>
                  </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4" onClick={handleCameraClick}>
                  <AccordionTrigger>
                    <div className="flex flex-row items-center gap-2">
                      <Checkbox />

                      <span className="text-sm">4th Phase (7 Cameras)</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                  <div className="pl-4">
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">4th Phase_01</span>
                    </label>
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">4th Phase_02</span>
                    </label>
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">4th Phase_03</span>
                    </label>
                    <label className="flex items-center gap-2 py-4">
                      <Checkbox />
                      <span className="text-sm">4th Phase_04</span>
                    </label>
                  </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5" onClick={handleCameraClick}>
                  <AccordionTrigger>
                    <div className="flex flex-row items-center gap-2">
                      <Checkbox />

                      <span className="text-sm">5th Phase (13 Cameras)</span>
                    </div>
                  </AccordionTrigger>
                </AccordionItem>
                <AccordionItem value="item-6" onClick={handleCameraClick}>
                  <AccordionTrigger>
                    <div className="flex flex-row items-center gap-2">
                      <Checkbox />

                      <span className="text-sm">6th Phase (33 Cameras)</span>
                    </div>
                  </AccordionTrigger>
                </AccordionItem>

              </Accordion>
            </div>
            <div className="h-[100%] w-[50%]">
              <SelectedCam isVisible={isPopupVisible} onClose={handleClosePopup} />
            </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BAConfig
