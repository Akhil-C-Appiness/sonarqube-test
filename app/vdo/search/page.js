"use client"

import { useEffect, useState } from "react"
import dynamic from 'next/dynamic';
import {
  getAllEventRecords,
  getFileContent,
  getValidation,
  getViolationString,
} from "@/lib/api"
// import { SearchLayout } from "@/components/search-layout"

const SearchLayout  = dynamic(() => import("@/components/search-layout"));

const SearchEvents = (props) => {
  let [arrayRecords, setArrayRecords] = useState([])
  let lastFiveElements = arrayRecords.slice(-5)

  useEffect(() => {
    const payload = {
      id: 4698828,
      msId: "SVMEDIAS000000000000000000000001",
      acknowledge: 2,
      vehicleClass: 2,
      lpSignature: 1,
      acknowledgeUser: null,
      action: "",
      modifiedobjectId: "GJ09M97966",
      eventType: 207,
      acknowledgedTime: 0,
    }
    const getDataValidation = async (payload) => {
      const validaion = await getValidation(payload)
      // console.log("data",validaion)
    }
    getDataValidation(payload)
  }, [])
  return (
    <div className="mt-0">
      <SearchLayout
        lastFiveElements={lastFiveElements}
        arrayRecords={arrayRecords}
        snapArray={props.snapArray}
        selectedChannel={props.selectedChannel}
        playerRefs={props.playerRefs}
        handleSessionId={props.handleSessionId}
      />
    </div>
  )
}

export default SearchEvents
