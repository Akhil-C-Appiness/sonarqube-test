"use client"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import {useState, useEffect} from 'react'
import { useParams } from "next/navigation"
import {getSignalDetailsControllerModel, getVehicleDetailsControllerModel, getSignalDetailsConfiguration, getVehicleDetailsConfiguration, saveSignalDetailsConfig, saveVehicleDetailsConfig} from '@/lib/api'
import { validateEmail, validatePhoneNumber, validatePortNumber, validateIPNumber } from '@/lib/common'
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

const SignalSettings = ()=>{
    const params = useParams();
    const { toast } = useToast()
    const [signalDetailsControllerModel, setSignalDetailsControllerModel] = useState([])
    const [vehicleDetailsControllerModel, setVehicleDetailsControllerModel] = useState([])
    const [signalDetailsConfiguration, setSignalDetailsConfiguration] = useState([])
    const [vehicleDetailsConfiguration, setVehicleDetailsConfiguration] = useState([])
    const [selectedSignalController, setSelectedSignalController] = useState("");
    const [selectedSignalControllerId, setSelectedSignalControllerId] = useState(0);
    const [selectedVehicleController, setSelectedVehicleController] = useState("");
    const [selectedVehicleControllerId, setSelectedVehicleControllerId] = useState("");
    const [disableSignalInput, setDisableSignalInput] = useState(false)
    const [disableVehicleInput, setDisableVehicleInput] = useState(false)
    const [signalIP, setSignalIP] = useState("0.0.0.0");
    const [signalPort, setSignalPort] = useState(0);
    const [vehicleIP, setVehiclelIP] = useState("0.0.0.0");
    const [vehiclePort, setVehiclePort] = useState(0);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [emailError, setEmailError] = useState("");
    const [phoneError, setPhoneError] = useState("")
    const [signalPortError, setSignalPortError] = useState("")
    const [signalIPError, setSignalIPError] = useState("")
    const [vehiclePortError, setVehiclePortError] = useState("")
    const [vehicleIPError, setVehicleIPError] = useState("")

    const fetchSignalDetailsControllerModel = async() =>{
        const response = await getSignalDetailsControllerModel();
        setSignalDetailsControllerModel(response)
    }
    const fetchVehicleDetailsControllerModel = async() =>{
        const response = await getVehicleDetailsControllerModel();
        setVehicleDetailsControllerModel(response)
    }
    const fetchSignalDetailsConfiguration = async() => {
        const response = await getSignalDetailsConfiguration(params.junctionId);
        setSignalDetailsConfiguration(response);
    }
    const fetchVehicleDetailsConfiguration = async() => {
        const response = await getVehicleDetailsConfiguration(params.junctionId);
        setVehicleDetailsConfiguration(response);
    }
    const updateSignalController = (value) => {
        const filteredObject = signalDetailsControllerModel.find(item => item.id === value);
        setSelectedSignalController(filteredObject?.name)
        setSelectedSignalControllerId(value)
        if(value == 0){
            setDisableSignalInput(true)
            setSignalIP("127.0.0.1");
            setSignalPort(1024);
        }else{
            setDisableSignalInput(false)
        }
    }
    const updateVehicleController = (value) => {
        const filteredObject = vehicleDetailsControllerModel.find(item => item.id === value);
        setSelectedVehicleController(filteredObject?.name)
        setSelectedVehicleControllerId(value)
        if(value == 0){
            setDisableVehicleInput(true)
            setVehiclelIP("127.0.0.1");
            setVehiclePort(1024);
        }else{
            setDisableVehicleInput(false)
        }
    }
    const updateSignalControllerIp=(event)=>{
        setSignalIP(event.target.value);
    }
    const updateSignalControllerPort=(event)=>{
        setSignalPort(event.target.value);
    }
    const updateVehicleControllerIp=(event)=>{
        setVehiclelIP(event.target.value);
    }
    const updateVehicleControllerPort=(event)=>{
        setVehiclePort(event.target.value);
    }
    const updateEmail=(event)=>{
        setEmail(event.target.value);
    }
    const updatePhone=(event)=>{
        setPhone(event.target.value);
    }
    const saveSignalSettings= async ()=>{
        const validEmail = validateEmail(email);
        validEmail?setEmailError(""):setEmailError("Please enter valid email.");
        const validPhone = validatePhoneNumber(phone);
        validPhone?setPhoneError(""):setPhoneError("Please enter valid phone number.");
        const validSignalPort = validatePortNumber(signalPort)
        validSignalPort?setSignalPortError(""):setSignalPortError("Please enter valid port number.")
        const validVehiclePort = validatePortNumber(vehiclePort)
        validVehiclePort?setVehiclePortError(""):setVehiclePortError("Please enter valid port number.")
        const validSignalIp = validateIPNumber(signalIP);
        validSignalIp?setSignalIPError(""):setSignalIPError("Please enter valid IP.")
        const validVehicleIp = validateIPNumber(vehicleIP);
        validVehicleIp?setVehicleIPError(""):setVehicleIPError("Please enter valid IP.")
        //Signal  Details Configuration
        const payload1 = {
            "controllerIp":signalIP,
            "controllerPort":parseInt(signalPort),
            "mobileNumbers":[
                email,
                phone,
                null,
                null
            ],
            "controllerType":selectedSignalControllerId
        }
        //Vehicle  Details Configuration
        const payload2 = {
            "controllerIp":vehicleIP,
            "controllerPort":parseInt(vehiclePort),
            "mobileNumbers":[
                email,
                phone,
                null,
                null
            ],
            "controllerType":selectedVehicleControllerId
        }
        if(validEmail && validPhone && validSignalPort && validSignalIp && validVehiclePort && validVehicleIp){
            const response1 = await saveSignalDetailsConfig(payload1, params.junctionId);
            const response2 = await saveVehicleDetailsConfig(payload2, params.junctionId);
            if(response1.data.status === 2000 && response2.data.status === 2000){
                toast({
                    variant: "success",
                    description: "Saved successfully",
                    duration:3000
                  })
            }
            else{
                toast({
                    variant: "destructive",
                    description: "Error",
                    duration:3000
                  })
            }
        }
    }
    useEffect(()=>{
        fetchSignalDetailsControllerModel();
        fetchVehicleDetailsControllerModel();
        fetchSignalDetailsConfiguration();
        fetchVehicleDetailsConfiguration();
    }, [])
    useEffect(()=>{
        const filteredObject = signalDetailsControllerModel.find(item => item.id === signalDetailsConfiguration[0]?.controllerType);
        setSelectedSignalController(filteredObject?.name)
        setSelectedSignalControllerId(signalDetailsConfiguration[0]?.controllerType);
        setSignalIP(signalDetailsConfiguration[0]?.controllerIp);
        setSignalPort(signalDetailsConfiguration[0]?.controllerPort);
        if(signalDetailsConfiguration[0]?.controllerType === 0){
            setDisableSignalInput(true)
        }
        else{
            setDisableSignalInput(false)
        }
    },[signalDetailsControllerModel, signalDetailsConfiguration])
    useEffect(()=>{
        const filteredObject = vehicleDetailsControllerModel.find(item => item.id === vehicleDetailsConfiguration[0]?.controllerType);
        setSelectedVehicleController(filteredObject?.name)
        setSelectedVehicleControllerId(vehicleDetailsConfiguration[0]?.controllerType)
        setVehiclelIP(vehicleDetailsConfiguration[0]?.controllerIp);
        setVehiclePort(vehicleDetailsConfiguration[0]?.controllerPort);
        setEmail(vehicleDetailsConfiguration[0]?.mobileNumbers[0]);
        setPhone(vehicleDetailsConfiguration[0]?.mobileNumbers[1]);
        if(vehicleDetailsConfiguration[0]?.controllerType === 0){
            setDisableVehicleInput(true)
        }
        else{
            setDisableVehicleInput(false)
        }
    },[vehicleDetailsControllerModel, vehicleDetailsConfiguration])
    useEffect(()=>{
        // console.log("signalDetailsControllerModel",signalDetailsControllerModel)
        // console.log("vehicleDetailsControllerModel",vehicleDetailsControllerModel)
        // console.log("signalDetailsConfiguration",signalDetailsConfiguration)
        // console.log("vehicleDetailsConfiguration",vehicleDetailsConfiguration)
    }, [signalDetailsControllerModel,vehicleDetailsControllerModel,signalDetailsConfiguration,vehicleDetailsConfiguration])
    return <div>
        <div className="py-4 font-semibold">Signal details in</div>
        <div className="flex w-full gap-6 py-3">
            <div className="flex w-1/3 flex-col gap-2">
                <Label>Controller</Label>
                <Select onValueChange={(value)=>updateSignalController(value)}>
                    <SelectTrigger>
                        <SelectValue>{selectedSignalController}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        {signalDetailsControllerModel.map((item, index) => {
                            return (
                            <SelectItem key={item.id} value={item.id}>
                                {item.name}
                            </SelectItem>
                            );
                        })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Controller IP</Label>
                <Input placeholder="" value={signalIP} className="h-10 w-40 rounded-sm" disabled={disableSignalInput} onChange={(value)=>updateSignalControllerIp(value)} />
                <span className="text-sm text-red-500">{signalIPError}</span>
            </div>
            <div>
                <Label>Controller Port</Label>
                <Input placeholder="" value={signalPort} className="h-10 w-40 rounded-sm" disabled={disableSignalInput} onChange={(value)=>updateSignalControllerPort(value)} />
                <span className="text-sm text-red-500">{signalPortError}</span>
            </div>

        </div>
        <div className="py-4 font-semibold">Vehicle details out</div>
        <div className="flex w-full gap-6 py-3">
            <div className="flex w-1/3 flex-col gap-2">
                <Label>Controller</Label>
                <Select onValueChange={(value)=>updateVehicleController(value)}>
                    <SelectTrigger>
                        <SelectValue>{selectedVehicleController}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                        {vehicleDetailsControllerModel.map((item, index) => {
                            return (
                            <SelectItem key={item.id} value={item.id}>
                                {item.name}
                            </SelectItem>
                            );
                        })}
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Controller IP</Label>
                <Input placeholder="" value={vehicleIP} className="h-10 w-40 rounded-sm" disabled={disableVehicleInput}  onChange={(value)=>updateVehicleControllerIp(value)}/>
                <span className="text-sm text-red-500">{vehicleIPError}</span>
            </div>
            <div>
                <Label>Controller Port</Label>
                <Input placeholder="" value={vehiclePort} className="h-10 w-40 rounded-sm" disabled={disableVehicleInput}  onChange={(value)=>updateVehicleControllerPort(value)}/>
                <span className="text-sm text-red-500">{vehiclePortError}</span>
            </div>

        </div>
        <div className="py-4 font-semibold">Mobile/SMS Numbers</div>
        <div className="flex w-full gap-6">
                <div className="w-1/3">
                    <Label>Email</Label>
                    <Input  className="py-2" value={email} onChange={(value)=>updateEmail(value)}/>
                    <span className="text-sm text-red-500">{emailError}</span>
                </div>
                <div className="w-1/3">
                    <Label>SMS</Label>
                    <Input  className="py-2" value={phone} onChange={(value)=>updatePhone(value)}/>
                    <span className="text-sm text-red-500">{phoneError}</span>
                </div>
        </div>
        <div className="p-4">
            <div className="my-2 flex flex-row items-center justify-end">
                <Button variant="default" onClick={saveSignalSettings}>Save Changes</Button>
            </div>
        </div>
    </div>
}

export default SignalSettings