"use client"
import dynamic from 'next/dynamic';

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
// import Image from "next/image";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { Button } from "@/components/ui/button";
// import Link from "next/link";
import { getJunctionsList } from "@/lib/api";
import { useEffect, useState } from "react";

const Image = dynamic(() => import("next/image"));
const Link = dynamic(() => import("next/link"));
const JunctionServerConfig = ()=>{
  const [junctionList, setJunctionList] = useState([]);
  const [junctionListFiltered, setJunctionListFiltered] = useState([])
  const [searchVal, setSearchVal] = useState([])
  const fetchJunctionList = async ()=>{
    const junctions = await getJunctionsList();
    console.log(junctions);
    setJunctionList(junctions);
    setJunctionListFiltered(junctions)
  
  }
  useEffect(()=>{
    fetchJunctionList()
  }, [])
  useEffect(()=>{
    console.log(junctionList, 'junctionList')
  }, [junctionList])

  useEffect(()=>{
    let filteredArray = junctionList.filter(item => {
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(searchVal.toLowerCase())
      );
    });
    setJunctionListFiltered(filteredArray)
    // console.log(filteredArray)
  }, [searchVal])
return <div className="mt-4">
    <Label htmlFor="junctionsearch" className="text-base text-slate-400">Search Junction</Label>
        <div className="relative w-1/3 group">
             <div className={`pointer-events-none absolute inset-y-0  left-12 group-focus-within:left-2  transition-all duration-100 flex items-center pr-3`}>
                <Image src="/images/search-grey-icon.svg" width={20} height={20} />
            </div>
            <Input name="search" value={searchVal} onChange={(e)=>setSearchVal(e.target.value)} placeholder="Search by Name/IP/ID" className="pl-20 group-focus-within:pl-8 py-2 transition-all duration-200" autocomplete="off" />
           
        </div>

        <div className="mt-4">
        <Table>
      
      <TableHeader>
        <TableRow>
          <TableHead>Junction Name</TableHead>
          <TableHead>IP</TableHead>
          <TableHead>ID</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {(junctionListFiltered||junctionList).map((junction)=>{
          return <TableRow>
                <TableCell className="font-medium">{junction.name} </TableCell>
                <TableCell>{junction.ip}</TableCell>
                <TableCell>{junction.id}</TableCell>
                <TableCell>
                    <div className="flex items-center justify-end space-x-2">
                        {/* <Image src="/images/traffic-signal-blue.svg" width={20} height={20} /> */}
                        <Link href={'/configuration/server-storage/junction/'+junction.id} >
                        <Image src="/images/settings-blue.svg" width={20} height={20} />
                        </Link>
                    </div>
                </TableCell>
              </TableRow>
        }
        
        )}
          
      </TableBody>
      
    </Table>
    {!junctionListFiltered.length&&searchVal&&<div className="w-full p-4 flex justify-center items-center h-44">No Results found</div>}
        </div>
</div>
}

export default JunctionServerConfig;
