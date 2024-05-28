import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Button } from "@/components/ui/button";
import useStore from "@/store/store"
import { useState, useEffect } from "react";
import DataTable from '../components/table'
import { Checkbox } from "@/components/ui/checkbox"
import { updateRolesPermission } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"

const RolesList = () => {
    const roleList = useStore(state=>state.roleList)
    const [permissionList, setPermissionList] = useState(roleList);
    let [count, setCount] = useState(0);
    const { toast } = useToast(0)
    useEffect(()=>{
      setPermissionList(roleList);
    }, [roleList])
    useEffect(()=>{
      setCount(permissionList.length);
    }, [permissionList])
    const filterPermissions = (role)=>{
        console.log(role)
        console.log(roleList)
        console.log(permissionList)
        const selectedRole = roleList.filter(item=>item.profileName === role)
        console.log(selectedRole)
    }
    const tableColumns = [
      {
        accessorKey: "id",
        header: "User Name",
        cell: ({ row }) => (
          <div>{row.getValue("id")}</div>
        ),
      },
      {
        accessorKey: "mailId",
        header: "Email",
        cell: ({ row }) => (
          <div>{row.getValue("mailId")}</div>
        ),
      }
    ]

    const updatePermission = ({value, permissionName, index})=>{
      console.log(value,  permissionName)
      const permissionListTemp = [...permissionList]
      permissionListTemp[index][permissionName]= value?1:0
      console.log(permissionListTemp[index])
      setPermissionList(permissionListTemp)
      
    }

    const updatePermissions = ()=>{
      // console.log(permissionList)
      permissionList.map(async(item) => {
        let data = {
          "profileId" : item.profileId,
          "profileName" : item.profileName,
          "priority" : item.priority ,
          "storageMnagement" : item.storageMnagement,
          "searchAddNewCamera" : item.searchAddNewCamera,
          "configExistingCamera" : item.configExistingCamera,
          "createNewSchedule" : item.createNewSchedule,
          "userManagement" : item.userManagement,
          "setAnalytics" : item.setAnalytics,
          "smartSearch" : item.smartSearch,
          "mediaDownloadPermit" : item.mediaDownloadPermit,
          "mediaAcknowledgementPermit" : item.mediaAcknowledgementPermit,
          "ptzControl" : item.ptzControl,
          "challanGenerationPermit" : item.challanGenerationPermit,
          "challanViewPermit" : item.challanViewPermit,
          "challanPaymentAtCounterPermit" : item.challanPaymentAtCounterPermit,
          "challanPaymentAtHomePermit" : item.challanPaymentAtHomePermit,
          "challanPaymentAtCourtPermit" : item.challanPaymentAtCourtPermit,
          "challanPaymentOnlineGatewayPermit" : item.challanPaymentOnlineGatewayPermit
        }
        const response = await updateRolesPermission(data);
      })
      if(permissionList.length === count){
        toast({
          variant: "success",
          description: "Successfully Updated",
          duration:3000
        })
      }
    }
    return (
        <div>
            
            <div className="w-full flex pt-4">
            <div className="flex flex-col  w-56">
            
            {/* <Select onValueChange={(selectedVal)=>filterPermissions(selectedVal)} defaultValue={"All"}>

              <SelectTrigger className="w-[180px]">
              
                <SelectValue id="roles" placeholder="Select ROLE" />
              </SelectTrigger>
              <SelectContent>
                {roleList.map((item, index) => {
                  return (
                    <SelectItem key={item.profileName} value={item.profileName}>
                      {item.profileName}
                    </SelectItem>
                  );
                
                })}
                
                
                
              </SelectContent>
            </Select> */}
            </div>
            <div className="flex grow justify-end ">
                {/* <Button variant="blueoutline"> Add User</Button> */}
            </div>
            </div>
            <div className="w-full mt-4">
                <div className="flex flex-row">
                    <div className="flex flex-col w-80 border-r">
                        <div className="bg-blue-50 p-4 font-bold w-64">Permission</div>
                        <div className="bg-slate-100 p-4 w-64">Storage Management</div>
                        <div className="bg-white p-4 w-64">Add/Delete Camera</div>
                        <div className="bg-slate-100 p-4 w-64">Schedule Configuration</div>
                        <div className="bg-white p-4 w-64">Analytics Camera</div>
                        <div className="bg-slate-100 p-4 w-64">Camera Configuration</div>
                        <div className="bg-white p-4 w-64">User Management</div>
                        <div className="bg-slate-100 p-4 w-64">Challan Generation</div>
                        <div className="bg-white p-4 w-64">Challan Payment at Counter</div>
                        <div className="bg-slate-100 p-4 w-64">Challan Payment at Home</div>
                    </div>
                    <div className="flex grow flex-row overflow-auto ">
                    {permissionList.map((role, index)=>{
                        return <div className="flex flex-col w-full">
                        <div className="bg-blue-50 p-4 font-bold whitespace-nowrap">{role.profileName}</div>
                        <div className="bg-slate-100 p-4 whitespace-nowrap"><Checkbox checked={role.storageMnagement===1} onCheckedChange={(checked)=>updatePermission({value:checked, permissionName:"storageMnagement", index:index})}  /></div>
                        <div className="bg-white p-4 whitespace-nowrap"><Checkbox checked={role.searchAddNewCamera===1} onCheckedChange={(checked)=>updatePermission({value:checked, permissionName:"searchAddNewCamera", index:index})} /></div>

                        <div className="bg-slate-100 p-4 whitespace-nowrap"><Checkbox  checked={role.createNewSchedule===1} onCheckedChange={(checked)=>updatePermission({value:checked, permissionName:"createNewSchedule", index:index})} /></div>

                        <div className="bg-white p-4 whitespace-nowrap"><Checkbox  checked={role.setAnalytics===1} onCheckedChange={(checked)=>updatePermission({value:checked, permissionName:"setAnalytics", index:index})} /></div>

                        <div className="bg-slate-100 p-4 whitespace-nowrap"><Checkbox  checked={role.configExistingCamera===1} onCheckedChange={(checked)=>updatePermission({value:checked, permissionName:"configExistingCamera", index:index})} /></div>

                        <div className="bg-white p-4 whitespace-nowrap"><Checkbox  checked={role.userManagement===1} onCheckedChange={(checked)=>updatePermission({value:checked, permissionName:"userManagement", index:index})} /></div>

                        <div className="bg-slate-100 p-4 whitespace-nowrap"><Checkbox  checked={role.challanGenerationPermit===1} onCheckedChange={(checked)=>updatePermission({value:checked, permissionName:"challanGenerationPermit", index:index})} /></div>

                        <div className="bg-white p-4 whitespace-nowrap"><Checkbox  checked={role.challanPaymentAtCounterPermit===1} onCheckedChange={(checked)=>updatePermission({value:checked, permissionName:"challanPaymentAtCounterPermit", index:index})} /></div>
                        <div className="bg-slate-100 p-4 whitespace-nowrap"><Checkbox  checked={role.challanPaymentAtHomePermit===1} onCheckedChange={(checked)=>updatePermission({value:checked, permissionName:"challanPaymentAtHomePermit", index:index})} /></div>
                    </div>
                       })}
                    </div>
                </div>
            </div>
            <div className="flex flex-row justify-end mt-4">
              <Button variant="default" onClick={updatePermissions}> Save Changes</Button>
            </div>
        </div>
    );
}

export default RolesList;