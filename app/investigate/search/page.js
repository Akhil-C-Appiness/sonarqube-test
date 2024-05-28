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

const  SearchLayout  = dynamic(()=>import("@/components/search-layout"))

const SearchEvents = (props) => {
  let [arrayRecords, setArrayRecords] = useState([])
  let lastFiveElements = arrayRecords.slice(-5)

 
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
