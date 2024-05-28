"use client"
import { useStore } from "zustand"
import { getProcessUnitList, getUnitById, allocateJunction} from "@/lib/api"
import {useState, useEffect} from "react"
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { set } from "date-fns";
import { useToast } from "@/components/ui/use-toast"
const ProcessUnitAllocation = ()=>{
    const [processUnitList, setProcessUnitList] = useState([])
    const [selectedUnit, setSelectedUnit] = useState(null)  
    const [junctionLIst, setJunctionList] = useState([]) 
    const [allocateNewJunction, setAllocateNewJunction] = useState(false)  
    const [junctionName, setJunctionName] = useState("");
    const [ip1, setIp1] = useState(0);
    const [ip2, setIp2] = useState(0);
    const [ip3, setIp3] = useState(0);
    const [ip4, setIp4] = useState(0);
    const [ip5, setIp5] = useState(0);
    const { toast } = useToast()
    const getProcessListData = async ()=>{
        const list = await getProcessUnitList()
        console.log(list)
        setProcessUnitList(list)
        if(list.length > 0){
            const unitDetailsById = await getUnitById(list[0].id)
            console.log(unitDetailsById, 'unitDetailsById')
            if(unitDetailsById.length > 0){
                setJunctionList(unitDetailsById)
            }
            
        
        }
        
    }
    useEffect(()=>{
        getProcessListData()
    }, [])
    useEffect(()=>{
        if(processUnitList.length > 0){
            setSelectedUnit(processUnitList[0])
        }
    
    }, [processUnitList])

    // const allocateNewJunction = ()=>{
    //     const newJunction = {
    //                     "punitId": selectedUnit?.id,
    //                     "msName": "",
    //                     "camIpRange": null
    //                 }
    //     setJunctionList([...junctionLIst, newJunction])
    
    // };
    const saveNewJunction = async() =>{
        if(junctionName?.length > 0){
            const payload = {
                "punitId" :  selectedUnit?.id,
                "msName" : junctionName,
                "camIpRange" : ip1+"."+ip2+"."+ip3+"."+ip4+"-"+ip5
            }
            const response = await allocateJunction(payload);
            console.log("response",response)
            if(response.status == 200){
                toast({
                    variant: "success",
                    description: "Saved successfully",
                    duration:3000
                })
                setAllocateNewJunction(false)
                getProcessListData()
            }
        }
    }
    return <div className="w-full py-4">
    <hr />
            <h3 className="font-semibold mt-4">process Unit Allocation</h3>
            <div className="flex flex-row bg-blue-100 mt-4 gap-2 p-4">
                        <div className="flex flex-col w-1/5 bg-white">
                            <div className="p-2 font-semibold">Process Units ({processUnitList?.length})</div>
                            {processUnitList.map((unit)=>{
                                return <div key={unit.id} onClick={()=>{setSelectedUnit(unit)}} className={`p-2 ${selectedUnit?.id===unit.id?'bg-blue-100 border-r-4 border-primary':''}`}>{unit.name} ({unit.capacity})</div>
                            
                            })}
                           
                        </div>
                        <div className="w-4/5 bg-white p-4">
                            <div className="flex pb-4">
                                <div className="flex flex-col w-1/3">
                                    <div>Host Name</div>
                                    <div className="font-semibold">{selectedUnit?.name}</div>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <div>Unit ID</div>
                                    <div className="font-semibold truncate pr-4">{selectedUnit?.id}</div>
                                </div>
                                <div className="flex flex-col w-1/3">
                                    <div>Unit IP Address</div>
                                    <div className="font-semibold">{selectedUnit?.ip}</div>
                                </div>
                            </div>
                            <hr />

                            <div className="flex flex-row mt-4 w-full">
                                <div className="font-semibold w-1/2"><h3 >Junctions ({junctionLIst?.length})</h3></div>
                                <div className="flex w-1/2 justify-end "><Button variant="blueoutline" onClick={setAllocateNewJunction} className="ml-4">Allocate New Junction</Button></div>
                            </div>
                            {junctionLIst?.map((junction)=>{
                                return <div className="border p-4 mt-4">
                                <div>Unit IP Address <span className="font-semibold pl-2">{selectedUnit?.ip}</span></div>
                                <div className="flex flex-row mt-4 w-full">
                                        <div className="flex flex-col w-2/5">
                                            <Label htmlFor="server" className="text-base">Junction Name</Label>
                                            <Input className="w-48 p-2" value={junction.msName} />
                                        </div>
                                        <div className="flex flex-col w-3/5">
                                            <Label htmlFor="server" className="text-base">Camera IP Range</Label>
                                            <div className="flex flex-row gap-1 w-full">
                                                <Input type="number" value={junction?.camIpRange?.split('.')[0]} max="255" min="0" className="w-16 p-2" /><span>.</span>
                                                <Input type="number" value={junction?.camIpRange?.split('.')[1]} max="255" min="0" className="w-16 p-2" /><span>.</span>
                                                <Input type="number" value={junction?.camIpRange?.split('.')[2]} max="255" min="0" className="w-16 p-2" /><span>.</span>
                                                <Input type="number" value={junction?.camIpRange?.split('.')[3].split('-')[0]} max="255" min="0" className="w-16 p-2" /><span>-</span>
                                                <Input type="number" value={junction?.camIpRange?.split('-')[1]} max="255" min="0" className="w-16 p-2" />
                                            </div>
                                        </div>
                                </div>
                            </div>
                            })}
                            {allocateNewJunction? 
                            <div className="border p-4 mt-4">
                            <div>Unit IP Address <span className="font-semibold pl-2">{selectedUnit?.ip}</span></div>
                            <div className="flex flex-row mt-4 w-full">
                                <div className="flex flex-col w-2/5">
                                    <Label htmlFor="server" className="text-base">Junction Name</Label>
                                    <Input className="w-48 p-2" value={junctionName} onChange={(e)=>setJunctionName(e.target.value)}/>
                                </div>
                                <div className="flex flex-col w-3/5">
                                    <Label htmlFor="server" className="text-base">Camera IP Range</Label>
                                    <div className="flex flex-row gap-1 w-full">
                                        <Input type="number" value={ip1} onChange={(e)=>setIp1(e.target.value)} max="255" min="0" className="w-16 p-2" /><span>.</span>
                                        <Input type="number" value={ip2} onChange={(e)=>setIp2(e.target.value)} max="255" min="0" className="w-16 p-2" /><span>.</span>
                                        <Input type="number" value={ip3} onChange={(e)=>setIp3(e.target.value)} max="255" min="0" className="w-16 p-2" /><span>.</span>
                                        <Input type="number" value={ip4} onChange={(e)=>setIp4(e.target.value)} max="255" min="0" className="w-16 p-2" /><span>-</span>
                                        <Input type="number" value={ip5} onChange={(e)=>setIp5(e.target.value)} max="255" min="0" className="w-16 p-2" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center justify-end mt-4">
                                <Button variant="blueoutline" onClick={saveNewJunction} className="ml-4">Save</Button>
                            </div>
                        </div>
                            :""
                            }
                        </div>
            </div>
    </div>
}

export default ProcessUnitAllocation