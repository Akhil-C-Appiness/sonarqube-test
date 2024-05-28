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
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import {getAllRadarById, getAllRadarModel, saveNewRadar} from "@/lib/api"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast"
import Image from "next/image"

const ALlRadar = ()=>{
  const [radarList, setRadarList] = useState([])
  const [radarModel, setRadarModel] = useState([])
  const [deleteId, setDeleteId] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [radarId, setRadarId] = useState("-1")
  const [radarName, setRadarName] = useState("")
  const [radarMake, setRadarMake] = useState(0)
  const [radarIp, setRadarIp] = useState("")
  const [radarHostIp, setRadarHostIp] = useState("")
  const [radarPort, setRadarPort] = useState("")
  const [radarUdpPort, setRadarUdpPort] = useState("")
  const [radarUsername, setRadarUsername] = useState("")
  const [radarPassword, setRadarPassword] = useState("")
  const [radarIpName, setRadarIpName] = useState("")
  const [open, setOpen] = useState(false)
  const params = useParams();
  const { toast } = useToast()
  const form = useForm({
    defaultValues: {
      defaultValues: {
        id:-1,
        make:0,
        name: "",
        ip:"",
        hostIp:"",
        port:"",
        udpPort:"",
        username:"",
        password:"",
        ipName:""
      },
    },
  })
  const fetchAllRadarList = async ()=>{
    const radarData = await getAllRadarById(params.junctionId);
    setRadarList(radarData)
  }
  const deleteRadar = async() => {
    let deletePayloadArray = [];
    radarList.map((radar)=>{
      if(!deleteId.includes(radar.id)){
        let radarObj = {
          "id": radar.id, 
          "make": radar.make, 
          "name": radar.name,
          "ip": radar.ip,
          "hostIp":radar.hostIp,
          "port": radar.port, 
          "udpPort": radar.udpPort,
          "username": radar.username,
          "password": radar.password,
          "ipName": radar.ipName 
        }
        deletePayloadArray.push(radarObj);
      }
    })
    setDeleteId([]);
    const response = await saveNewRadar(deletePayloadArray,params.junctionId);
    if(response.status == 200){
      toast({
        variant: "success",
        description: "Deleted successfully",
        duration:3000
      })
    }
    fetchAllRadarList();
  }
  const updateAll = ({value}) =>{
    if(value == true){
      let idArray = [];
      radarList.map((item)=>{
        idArray.push(item.id)
      })
      setSelectAll(true)
      setDeleteId(idArray)
    }
    else{
      setSelectAll(false)
      setDeleteId([])
    }
  }
  const handleCheckboxChange = (checkboxValue) => {
    setDeleteId((prevSelected) => {
      if (prevSelected.includes(checkboxValue)) {
        return prevSelected.filter((item) => item !== checkboxValue);
      } else {
        return [...prevSelected, checkboxValue];
      }
    });
  };
  const updateMake = (value, id) =>{
    const updatedArray = radarList.map(radar => 
      radar.id === id ? { ...radar, make: value } : radar
    );
    setRadarList(updatedArray);
  }
  useEffect(()=>{
    const fetchRadarList = async ()=>{
      const radarData = await getAllRadarById(params.junctionId);
      // console.log(radarData, 'radarData')
      setRadarList(radarData)
    }
    fetchRadarList()
    const fetchAllRadarModel = async () =>{
      const radarModelRes = await getAllRadarModel();
      // console.log("radarModelRes", radarModelRes);
      setRadarModel(radarModelRes);
    }
    fetchAllRadarModel();
  }, [])
  const submitForm = async() =>{
    let savePayloadArray = [];
    radarList.map((radar)=>{
      if(radar.id !== radarId && radar.id != -1){
        let radarObj = {
          "id": radar.id, 
          "make": radar.make, 
          "name": radar.name,
          "ip": radar.ip,
          "hostIp":radar.hostIp,
          "port": radar.port, 
          "udpPort": radar.udpPort,
          "username": radar.username,
          "password": radar.password,
          "ipName": radar.ipName 
        }
        savePayloadArray.push(radarObj);
      }
      else if(radar.id === radarId && radar.id != -1){
        let newRadarObj = {
          "id": radarId, 
          "make": radarMake,       //parseInt(userData.make), 
          "name": radarName,
          "ip": radarIp,
          "hostIp":radarHostIp,
          "port": radarPort, 
          "udpPort": radarUdpPort,
          "username": radarUsername,
          "password": radarPassword,
          "ipName": radarIpName
        }
        savePayloadArray.push(newRadarObj);
      }
    })
    if(radarId == -1){
      let newRadarObj = {
        "make": radarMake,       //parseInt(userData.make), 
        "name": radarName,
        "ip": radarIp,
        "hostIp":radarHostIp,
        "port": radarPort, 
        "udpPort": radarUdpPort,
        "username": radarUsername,
        "password": radarPassword,
        "ipName": radarIpName
      }
      savePayloadArray.push(newRadarObj);
    }
    const response = await saveNewRadar(savePayloadArray,params.junctionId);
    if(response.status == 200){
      toast({
        variant: "success",
        description: "Saved successfully",
        duration:3000
      })
    }
    fetchAllRadarList();
    setOpen(false);
  }
  const addNewRadar = () =>{
    setRadarName("")
    setRadarMake(0)
    setRadarId("-1")
    setRadarIp("")
    setRadarHostIp("")
    setRadarPort("")
    setRadarUdpPort("")
    setRadarUsername("")
    setRadarPassword("")
    setRadarIpName("")
    setOpen(true)
  }
  const editRadar = (radarId) => {
    const selectedRadar = radarList.find(item => item.id === radarId)
    setRadarName(selectedRadar.name)
    setRadarMake(selectedRadar.make)
    setRadarId(selectedRadar.id)
    setRadarIp(selectedRadar.ip)
    setRadarHostIp(selectedRadar.hostIp)
    setRadarPort(selectedRadar.port)
    setRadarUdpPort(selectedRadar.udpPort)
    setRadarUsername(selectedRadar.username)
    setRadarPassword(selectedRadar.password)
    setRadarIpName(selectedRadar.ipName)
    setOpen(true)
  }
return <div>
    <div className="mt-4">
      <div className="flex items-center justify-end p-2"><Button variant="blueoutline" className="rounded-1" onClick={()=>addNewRadar()}>Add New Radar</Button></div>
    <Table>
      <TableHeader className="bg-blue-100 font-semibold">
        <TableRow>
          <TableHead className="w-[100px]"><Checkbox onCheckedChange={(checked)=>updateAll({value:checked})} checked={selectAll}/></TableHead>
          <TableHead className="w-[100px]">Serial No.</TableHead>
          <TableHead>ID</TableHead>
          <TableHead>Radar make</TableHead>
          <TableHead >Name</TableHead>
          <TableHead >Radar IP</TableHead>
          <TableHead >Host IP</TableHead>
          <TableHead >TCP Port</TableHead>
          <TableHead >UDP Port</TableHead>
          <TableHead >Username</TableHead>
          <TableHead >Password</TableHead>
          <TableHead >Edit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
          {radarList?.map((radar, index)=>{
            return <TableRow >
              <TableHead className="w-[100px]"><Checkbox onCheckedChange={()=>handleCheckboxChange(radar.id)} checked={deleteId.includes(radar.id)}/></TableHead>
              <TableCell className="font-medium">{index+1}</TableCell>
              <TableCell className="font-medium">{radar.id}</TableCell>
              <TableCell className="w-[250px] font-medium">
                <Select onValueChange={(value)=>updateMake(value, radar.id)}>
                  <SelectTrigger>
                      <SelectValue>{radarModel.find(model => model.id === radar.make)?.name}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                      {radarModel.map((item) => {
                        return (<SelectItem  key={item.id} value={item.id} >
                          {item.name}
                        </SelectItem>
                      )})}
                  </SelectContent>
                </Select>
              </TableCell>
              <TableCell className="font-medium">{radar.name}</TableCell>
              <TableCell className="font-medium">{radar.ip}</TableCell>
              <TableCell className="font-medium">{radar.hostIp}</TableCell>
              <TableCell className="font-medium">{radar.port}</TableCell>
              <TableCell className="font-medium">{radar.udpPort}</TableCell>
              <TableCell className="font-medium">{radar.username}</TableCell>
              <TableCell className="font-medium">{radar.password}</TableCell>
              <TableCell className="font-medium">
                <Image src="/images/edit_icon_grey.svg" alt="edit" height={15} width={15} onClick={()=>editRadar(radar.id)}/>
              </TableCell>
          </TableRow>
          })}
      </TableBody>
    </Table>
    {deleteId.length > 0 ? 
    <div className="mt-2 flex h-[70px] items-center justify-between bg-slate-100 p-4">
      <p>{deleteId.length} Radar Selected</p>
      <Button variant="default" onClick={deleteRadar}>Delete Selected Radar</Button>
    </div>
    :
    <></>}
    </div>
    <div className="flex w-[100%] items-center justify-center">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent
            className={
              "max-h-screen w-[800px] overflow-y-auto lg:max-w-screen-md"
            }
          >
            <DialogHeader>
              <DialogTitle>{radarId != -1? "Edit Radar" : "Add New Radar"}</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
                <Form {...form}>
                  <div className="grid grid-cols-2 gap-4">
                    <FormField  control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                              <Input placeholder="Enter name"  className="py-2" autoComplete="off" defaultValue={radarName} onChange={(e) => setRadarName(e.target.value)}/>
                          </FormControl>
                        </FormItem>
                    )}/>
                    <FormField  control={form.control} name="make" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Make</FormLabel>
                          <FormControl>
                            <Select value={radarModel.find(item=> item.id === radarMake)?.name} onValueChange={(e) => setRadarMake(radarModel.find(item=> item.name === e)?.id)}>
                              <SelectTrigger>
                                  <SelectValue></SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                {radarModel.map((item) => {
                                  return (<SelectItem  key={item.id} value={item.name} >
                                    {item.name}
                                  </SelectItem>
                                )})}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                    )}/>
                    <FormField  control={form.control} name="ip" render={({ field }) => (
                        <FormItem>
                          <FormLabel>IP</FormLabel>
                          <FormControl>
                              <Input placeholder="Enter IP" className="py-2" autoComplete="off" value={radarIp} onChange={(e)=>setRadarIp(e.target.value)}/>
                          </FormControl>
                        </FormItem>
                    )}/>
                    <FormField  control={form.control} name="hostIp" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Host IP</FormLabel>
                          <FormControl>
                              <Input placeholder="Enter Host IP" className="py-2" autoComplete="off" value={radarHostIp} onChange={(e)=>setRadarHostIp(e.target.value)}/>
                          </FormControl>
                        </FormItem>
                    )}/>
                    <FormField  control={form.control} name="port" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Port</FormLabel>
                          <FormControl>
                              <Input placeholder="Enter Port" className="py-2" autoComplete="off" value={radarPort} onChange={(e)=>setRadarPort(e.target.value)}/>
                          </FormControl>
                        </FormItem>
                    )}/>
                    <FormField  control={form.control} name="udpPort" render={({ field }) => (
                        <FormItem>
                          <FormLabel>UDP Port</FormLabel>
                          <FormControl>
                              <Input placeholder="Enter UDP Port" className="py-2" autoComplete="off" value={radarUdpPort} onChange={(e)=>setRadarUdpPort(e.target.value)}/>
                          </FormControl>
                        </FormItem>
                    )}/>
                    <FormField  control={form.control} name="username" render={({ field }) => (
                        <FormItem>
                          <FormLabel>User Name</FormLabel>
                          <FormControl>
                              <Input placeholder="Enter User Name" className="py-2" autoComplete="off" value={radarUsername} onChange={(e)=>setRadarUsername(e.target.value)}/>
                          </FormControl>
                        </FormItem>
                    )}/>
                    <FormField  control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                              <Input placeholder="Enter Password" className="py-2" autoComplete="off" value={radarPassword} onChange={(e)=>setRadarPassword(e.target.value)}/>
                          </FormControl>
                        </FormItem>
                    )}/>
                    <FormField  control={form.control} name="ipName" render={({ field }) => (
                        <FormItem>
                          <FormLabel>IP Name</FormLabel>
                          <FormControl>
                              <Input placeholder="Enter IP Name" className="py-2" autoComplete="off" value={radarIpName} onChange={(e)=>setRadarIpName(e.target.value)}/>
                          </FormControl>
                        </FormItem>
                    )}/>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <Button onClick={()=>submitForm()} >{radarId != -1? "Update" : "Add"}</Button>
                  </div>
                </Form>
          </DialogContent>
        </Dialog>
      </div>
</div>
}

export default ALlRadar;
