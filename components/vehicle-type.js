"use client"

import React, { useEffect, useState } from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

export const VehicleTypeView = ({ onRequestClose, props }) => {
  const convertToVehicleType = (vehicleType) => {
    switch (vehicleType) {
      case 0:
        return "Motorbike"
        break
      case 1:
        return "Auto"
        break
      case 2:
        return "Car"
        break
      case 3:
        return "Carrier"
        break
      case 4:
        return "Bus"
        break
      case 5:
        return "Lorry"
        break
      case 6:
        return "Maxicab"
        break
      case 7:
        return "Jeep"
        break
      case 8:
        return "Electric Scooter"
        break
      case 9:
        return "Electric Car"
      default:
        break
    }
  }
  return (
    <div className="flex flex-col items-center gap-1 font-normal text-sm">
      <span>Vehicle Type</span>
      <Select>
        <SelectTrigger className="h-[16px] w-full p-4">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem>
              <div className="flex flex-row items-center gap-2">
                <span className="text-[#3F3F40] font-medium">
                  {props?.details?.vehicleType
                    ? props.details.vehicleType
                    : props.objectProperty2
                    ? convertToVehicleType(props.objectProperty2)
                    : convertToVehicleType(props.vehicleClass)}
                </span>
              </div>
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  )
}
