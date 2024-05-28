"use client"
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
  import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
  import { Checkbox } from "@/components/ui/checkbox"
import {getCentralStorageList, getAllAvailableStorages, getActiveAvailableStorages, getStoragesUserNameAndPassword,saveConfigStorage} from '@/lib/api'
import {useState, useEffect} from 'react'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const CentralConfig = ()=>{
    const [centralStorageList, setCentralStorageList] = useState([])
    const [activeCentralStorageList, setActiveCentralStorageList] = useState([])
    const [activeCentralStoragePath, setActiveCentralStoragePath] = useState([])
    const [storageList, setStorageList]=useState([]);
    const { toast } = useToast()
    const fetcAllAvailableStorageList = async() =>{
        const response = await getAllAvailableStorages()
        setCentralStorageList(response)
    }
    //Get active storage
    const fetchCentralStorageList = async()=>{
        const response = await getActiveAvailableStorages()
        setActiveCentralStorageList(response);
        response.map((item)=>{
            setActiveCentralStoragePath((prevSelected) => {
                return [...prevSelected, item.driveInfo.path];
              });
        })
    }
    const generateStorageArray = async()=>{
        const objArray = [];
        centralStorageList.map(async (obj,index)=>{
            let userName;
            let password;
            let activeStatus;
            let driveType;
            let freeStorageInGb;
            let path;
            let recType;
            let region;
            let status;
            let totalStorageInGb;

            if(activeCentralStoragePath.includes(obj.driveInfo.path)){
                userName = (activeCentralStorageList.find((obj1) => obj1.driveInfo.path === obj.driveInfo.path)).driveInfo.userName;
                password = (activeCentralStorageList.find((obj1) => obj1.driveInfo.path === obj.driveInfo.path)).driveInfo.password;
                activeStatus = true;
                driveType = (activeCentralStorageList.find((obj1) => obj1.driveInfo.path === obj.driveInfo.path)).driveInfo.driveType;
                freeStorageInGb = (activeCentralStorageList.find((obj1) => obj1.driveInfo.path === obj.driveInfo.path)).driveInfo.freeStorageInGb;
                path = (activeCentralStorageList.find((obj1) => obj1.driveInfo.path === obj.driveInfo.path)).driveInfo.path;
                recType = (activeCentralStorageList.find((obj1) => obj1.driveInfo.path === obj.driveInfo.path)).driveInfo.recType;
                region = (activeCentralStorageList.find((obj1) => obj1.driveInfo.path === obj.driveInfo.path)).driveInfo.region;
                status = (activeCentralStorageList.find((obj1) => obj1.driveInfo.path === obj.driveInfo.path)).driveInfo.status;
                totalStorageInGb = (activeCentralStorageList.find((obj1) => obj1.driveInfo.path === obj.driveInfo.path)).driveInfo.totalStorageInGb;
            }
            else{
                const payload = {
                    "path" : obj.driveInfo.path
                }
                const res = await getStoragesUserNameAndPassword(payload);
                userName = obj.driveInfo.userName;
                password = obj.driveInfo.password;
                activeStatus = false;
                driveType = res[0].driveType;
                freeStorageInGb = res[0].freeStorageInGb;
                path = res[0].path;
                recType = res[0].recType;
                region = res[0].region;
                status = res[0].status;
                totalStorageInGb = res[0].totalStorageInGb;
            }
            const responseObj = {
                currentlyNasUpload: obj.currentlyNasUpload,
                currentlyUsed:obj.currentlyUsed,
                id: obj.id,
                mediaServerId: obj.mediaServerId,
                driveType: driveType,
                freeStorageInGb: freeStorageInGb,
                totalStorageInGb: totalStorageInGb,
                userName: userName,
                password: password,
                path: path,
                recType: recType,
                region: region,
                status: status,
                activeStatus:activeStatus            
            }
            objArray.push(responseObj);
        })
        setStorageList(objArray);
    }
useEffect(()=>{
    fetcAllAvailableStorageList();
    fetchCentralStorageList();
}, [])
useEffect(()=>{
    generateStorageArray();
}, [centralStorageList,activeCentralStoragePath,activeCentralStorageList])
const updatePermission = ({value, path})=>{
    const storageListTemp = [...storageList];
    const index = storageListTemp.findIndex((obj) => obj.path === path);
    storageListTemp[index].activeStatus = value;
    setStorageList(storageListTemp);
}
const updateStorageType = ({value, path})=>{
    const storageListTemp = [...storageList];
    const index = storageListTemp.findIndex((obj) => obj.path === path);
    storageListTemp[index].recType = value;
    setStorageList(storageListTemp);
}
const saveStorage = async() =>{
    let payload = [];
    storageList.map((obj)=>{
        if(obj.activeStatus === true){
            let payloadObj = {
                "currentlyNasUpload" : obj.currentlyNasUpload,
                "currentlyUsed": true,
                "driveInfo" : {
                    "driveType" : obj.driveType,
                    "freeStorageInGb" : obj.freeStorageInGb,
                    "password" : obj.password,
                    "path" : obj.path,
                    "recType" : obj.recType,
                    "region" : obj.region,
                    "status" : obj.status,
                    "totalStorageInGb" : obj.totalStorageInGb,
                    "userName" : obj.userName,
                },
                "id" : obj.id,
                "mediaServerId" : obj.mediaServerId
            }
            payload.push(payloadObj);
        }
    });
    // console.log("payload",payload)
    if(payload.length > 0){
        const response = await saveConfigStorage(payload);
        if(response.status == 200){
            toast({
                variant: "success",
                description: "Saved successfully",
                duration:3000
              })
        }
    }
}
const StorageStatus = ({storage})=>{
    const usedStorageInGb = storage.driveInfo.totalStorageInGb - storage.driveInfo.freeStorageInGb;
    const percentageUsed = (usedStorageInGb / storage.driveInfo.totalStorageInGb) * 100;
    var percentBGColor = 'bg-green-100'
    var percentColor = 'bg-green-500'
    if(percentageUsed>80 && percentageUsed<90){
        var percentBGColor = 'bg-yellow-100'
        var percentColor = 'bg-yellow-400'
    } else if(percentageUsed>=90){
        var percentBGColor = 'bg-red-100'
        var percentColor = 'bg-red-500'
    }
    return <div className={`h-3 ${percentBGColor} w-full rounded-lg relative`}>
            <div className={`h-3 ${percentColor} rounded-lg absolute`} style={{width: percentageUsed+'%'}}></div>
        </div>
};
return <div>
    <div className="mt-4">
    <Table>
      <TableHeader className="bg-blue-100 font-semibold">
        <TableRow>
          <TableHead className="w-[100px]">Drive/Partition</TableHead>
          <TableHead>Storage Capacity</TableHead>
          <TableHead>Storage type</TableHead>
          <TableHead >In use</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {centralStorageList.map((storage, index)=>{
            return <TableRow >
            <TableCell className="font-medium">{storage.driveInfo.path}</TableCell>
            <TableCell>
                <div className="flex flex-col">
                    <StorageStatus storage={storage}  />
                    <div>
                    <p>{storage.driveInfo.freeStorageInGb.toFixed(2)}GB free out of {storage.driveInfo.totalStorageInGb.toFixed(2)}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>{/* <Select onValueChange={(selectedVal)=>updateUserRole({selectedValue:selectedVal, user:row.original})} defaultValue="" > */}
                    <Select defaultValue={activeCentralStoragePath.includes(storage.driveInfo.path)? (activeCentralStorageList.find((obj) => obj.driveInfo.path === storage.driveInfo.path)).driveInfo.recType :0} onValueChange={(selectValue) => updateStorageType({value:selectValue, path:storage.driveInfo.path})}>
                    <SelectTrigger className="w-[180px] font-medium ">
                    <SelectValue id="type" placeholder="Storage Type" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem  value={0}>
                            Primary
                        </SelectItem>
                        <SelectItem  value={1}>
                            Backup
                        </SelectItem>
                        <SelectItem  value={2}>
                            Redundunt
                        </SelectItem>
                    </SelectContent>
                    </Select></TableCell>
            <TableCell><Checkbox defaultChecked={activeCentralStoragePath.includes(storage.driveInfo.path)} onCheckedChange={(checked)=>updatePermission({value:checked, path:storage.driveInfo.path})}/></TableCell>
          </TableRow>
        })}
        
        
      </TableBody>
    </Table>
    <div className="absolute bottom-16 right-6 flex items-center justify-end">
        <Button variant="default" onClick={saveStorage}>Save</Button>
    </div>
    </div>
</div>
}

export default CentralConfig;
