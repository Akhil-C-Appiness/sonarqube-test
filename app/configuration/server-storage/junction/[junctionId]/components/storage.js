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
import { Checkbox } from "@/components/ui/checkbox"
import { getStorageConfigById, getCurrentStoragesById, getjunctionStoragesUserNameAndPassword, saveJunctionStorage} from "@/lib/api"
import {useState, useEffect} from 'react'
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
const StorageConfig = ()=>{
    const [storageList, setStorageList] = useState([]);
    const [currentStorageList, setCurrentStorageList] = useState([]);
    const [currentStoragePath, setCurrentStoragePath] = useState([]);
    const [storageObjArray, setStorageObjArray]=useState([]);
    const params = useParams();
    const { toast } = useToast()
    const fetchStorageList = async ()=>{
        const resstorageList = await getStorageConfigById(params.junctionId)
        setStorageList(resstorageList)
    }
    
    //Get active storage
    const fetchCurrentStorages = async()=>{
        const response = await getCurrentStoragesById(params.junctionId)
        setCurrentStorageList(response);
        response.map((item)=>{
            setCurrentStoragePath((prevSelected) => {
                return [...prevSelected, item.driveInfo.path];
                });
        })
    }
    const updatePermission = ({value, path})=>{
        const storageListTemp = [...storageObjArray];
        const index = storageListTemp.findIndex((obj) => obj.path === path);
        storageListTemp[index].activeStatus = value;
        setStorageObjArray(storageListTemp);
    }
    const generateStorageArray = async()=>{
        const objArray = [];
        storageList.map(async (obj,index)=>{
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

            if(currentStoragePath.includes(obj.driveInfo.path)){
                userName = obj.driveInfo.userName;
                password = obj.driveInfo.password;
                activeStatus = true;
                driveType = obj.driveInfo.driveType;
                freeStorageInGb = obj.driveInfo.freeStorageInGb;
                path = obj.driveInfo.path;
                recType = (currentStorageList.find((obj1) => obj1.driveInfo.path === obj.driveInfo.path)).driveInfo.recType;
                region = obj.driveInfo.region;
                status = obj.driveInfo.status;
                totalStorageInGb = obj.driveInfo.totalStorageInGb;
            }
            else{
                const payload = {
                    "mediaServerID": params.junctionId, // selecetd junction server id
                    "secondaryId": obj.driveInfo.path
                }
                const res = await getjunctionStoragesUserNameAndPassword(payload);
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
        setStorageObjArray(objArray);
    }
    const saveStorage = async() =>{
        let payload = [];
        storageObjArray.map((obj)=>{
            if(obj.activeStatus === true){
                let payloadObj = {
                    "currentlyNasUpload" : obj.currentlyNasUpload,
                    "currentlyUsed" : true,
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
        const response = await saveJunctionStorage(payload,params.junctionId);
        if(response.status == 200){
            toast({
                variant: "success",
                description: "Saved successfully",
                duration:3000
              })
        }
    }
    useEffect(()=>{
    fetchStorageList();
    fetchCurrentStorages();
    }, [])
    useEffect(()=>{
        generateStorageArray();
    }, [storageList, currentStoragePath, currentStorageList])
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
          <TableHead className="w-[100px]">Serial No.</TableHead>
          <TableHead>Drive/Partition</TableHead>
          <TableHead>Storage Capacity</TableHead>
          <TableHead >In use</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
          {storageList.map((storage, index)=>{
            return <TableRow key={index}>
            <TableCell className="font-medium">{index+1}</TableCell>
            <TableCell className="font-medium">{storage.driveInfo.path}</TableCell>
            <TableCell>
              <div className="mt-2 flex flex-col">
                    <StorageStatus storage={storage}  />
                    <div>
                        <p>{storage.driveInfo.freeStorageInGb.toFixed(2)}GB free out of {storage.driveInfo.totalStorageInGb.toFixed(2)}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell><Checkbox defaultChecked={currentStoragePath.includes(storage.driveInfo.path)} onCheckedChange={(checked)=>updatePermission({value:checked, path:storage.driveInfo.path})}/></TableCell>
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

export default StorageConfig;
