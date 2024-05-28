import { useEffect, useState } from "react"
import dynamic from 'next/dynamic';

// import Image from "next/image"
import useStore from "@/store/store"
import { useForm } from "react-hook-form"
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { regVehicle } from "@/lib/api"

const Image = dynamic(() => import("next/image"));


const AddNewHotlistedVehicl = (props) => {
  const vehicleRegCheck = useStore((state) => state.vehicleRegCheck)
  const setVehicleRegCheck = useStore((state) => state.setVehicleRegCheck)
  const [vehicleCheck, setVehicleCheck] = useState()
  const [description, setDescription] = useState()
  const [ownerName, setOwnerName] = useState()
  const [ownerPhn, setOwnerPhn] = useState()
  const [policeStation, setPoliceStation] = useState()
  const [address, setAddress] = useState()
  const [storeType, setStoreType] = useState()
  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const { toast } = useToast()

  useEffect(() => {
    if (vehicleCheck) {
      setVehicleRegCheck(vehicleCheck)
    }
  }, [vehicleCheck])

  const regNewVehicle = async() => {
    let matchedId
    // console.log("storeType", storeType);
    const matchedOption = props.vehicleTypes?.find(
      (option) => option.vehicleType === storeType
    )
    if (matchedOption) {
      matchedId = matchedOption.id
    }

    let payload = {
      vehicleNumber: vehicleCheck,
      description: description,
      ownerName: ownerName,
      ownerPhone: ownerPhn,
      addressTwo: policeStation,
      addressOne: address,
      vehicleType: matchedId,
    }
    // const formData = new FormData();
    // const payload2 = getRequestBody();
    try{
        const newVehDetails = await regVehicle(payload)
        console.log("newVehDetails", newVehDetails);
        toast({
            variant: "success",
            description: "Successfully created!",
            duration: 3000,
          })
          setIsDialogOpen(false)
        
    }
    catch(error){
        toast({
            variant: "destructive",
            description:
              "An error occured, please try again!",
            duration: 3000,
          })
    }

  }
  const matchedOption = props.vehicleTypes?.find(
    (option) => option.vehicleType === storeType
  )
  if (matchedOption) {
    const matchedId = matchedOption.id
  }
  const form = useForm({
    defaultValues: {
      vehicleNumber: "",
      ownerName: "",
      vehicleType: "",
      phone: "",
      policeStation: "",
      address: "",
      description: "",
    },
  })
  const handleInputChange = (event) => {
    setVehicleCheck(event.target.value)
  }
  const handleDescriptionChange = (event) => {
    setDescription(event.target.value)
  }
  const handleNameChange = (event) => {
    setOwnerName(event.target.value)
  }
  const handlePhoneChange = (event) => {
    const inputValue = event.target.value
    const regex = /^[0-9+()-]*$/
    if (regex.test(inputValue) || inputValue === "") {
      setOwnerPhn(inputValue)
    }
  }
  const handlePoliceStationChange = (event) => {
    setPoliceStation(event.target.value)
  }
  const handleAddressChange = (event) => {
    setAddress(event.target.value)
  }

  return (
    <>
    {isDialogOpen && (

      <Form {...form}>
        <form autocomplete="off">
          <DialogContent
            className={
              "max-h-screen w-[800px] overflow-y-scroll lg:max-w-screen-md"
            }
          >
            <DialogHeader>
              <DialogTitle className="flex flex-row flex-wrap items-center justify-between pt-4">
                <h1 className="font-semibold">Add new Hotlisted Vehicle</h1>
                <Button
                  className=""
                  variant="outline"
                  onClick={props.setFileOpen}
                >
                  Import .xls file
                </Button>
              </DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="mt-2 flex items-center justify-between">
              <div className="items-left flex w-[350px] flex-col gap-2">
                <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Number*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter Vehicle Number*"
                            required
                            {...field}
                            className="py-2"
                            autocomplete="off"
                            value={vehicleCheck}
                            onChange={handleInputChange}
                          />
                          {vehicleRegCheck[0] === true && (
                            <span className="text-[red]">
                              Vehicle is already registered!
                            </span>
                          )}
                        </div>
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="items-left flex w-[350px] flex-col gap-2">
                <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          {vehicleRegCheck[0] === true ? (
                            <Input
                              placeholder="Enter Owner Name"
                              disabled
                              {...field}
                              className="py-2"
                              autocomplete="off"
                            />
                          ) : (
                            <Input
                              placeholder="Enter Owner Name"
                              {...field}
                              className="py-2"
                              autocomplete="off"
                              value={ownerName}
                              onChange={handleNameChange}
                            />
                          )}
                        </div>
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="items-left flex w-full flex-col gap-2">
                <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Vehicle Type*</FormLabel>
                      <FormControl>
                        <Select required onValueChange={(val) => setStoreType(val)}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Vehicle Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {props.vehicleTypes?.map((option) => (
                              <SelectItem
                                key={option.id}
                                value={option.vehicleType}
                              >
                                {option.vehicleType}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="items-left flex w-[350px] flex-col gap-2">
                <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Owner Contact details</FormLabel>
                      <FormControl>
                        {vehicleRegCheck[0] === true ? (
                          <Input
                            placeholder="Enter Owner Contact details"
                            disabled
                            {...field}
                            className="py-2"
                            autocomplete="off"
                          />
                        ) : (
                          <Input
                            placeholder="Enter Owner Contact details"
                            {...field}
                            className="py-2"
                            autocomplete="off"
                            value={ownerPhn}
                            onChange={handlePhoneChange}
                          />
                        )}
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="items-left flex w-[350px] flex-col gap-2">
                <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Police Station</FormLabel>
                      <FormControl>
                        {/* <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Police Station" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">DIG Bunglow </SelectItem>
                        <SelectItem value="">Dadar</SelectItem>
                        <SelectItem value="">Porbandar</SelectItem>
                        <SelectItem value="">Palghar East</SelectItem>
                      </SelectContent>
                    </Select> */}
                        {vehicleRegCheck[0] === true ? (
                          <Input
                            placeholder="Enter Police Station"
                            disabled
                            {...field}
                            className="py-2"
                            autocomplete="off"
                          />
                        ) : (
                          <Input
                            placeholder="Enter Police Station"
                            {...field}
                            className="py-2"
                            autocomplete="off"
                            value={policeStation}
                            onChange={handlePoliceStationChange}
                          />
                        )}
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between">
              <div className="items-left flex w-full flex-col gap-2">
                <FormField
                  control={form.control}
                  name=""
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        {vehicleRegCheck[0] === true ? (
                          <Input
                            placeholder="Enter Address"
                            disabled
                            {...field}
                            className="py-2"
                            autocomplete="off"
                          />
                        ) : (
                          <Input
                            placeholder="Enter Address"
                            {...field}
                            className="py-2"
                            autocomplete="off"
                            value={address}
                            onChange={handleAddressChange}
                          />
                        )}
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="mt-2 w-full">
              <FormField
                control={form.control}
                name=""
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      {vehicleRegCheck[0] === true ? (
                        <Textarea className="w-full" disabled />
                      ) : (
                        <Textarea
                          className="w-full"
                          value={description}
                          onChange={handleDescriptionChange}
                        />
                      )}
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-2 flex items-center justify-end">
              {vehicleRegCheck[0] === true ? (
                <Button variant="default" disabled>
                  Add vehicle
                </Button>
              ) : (
                <Button variant="default" onClick={regNewVehicle} >Add vehicle</Button>
              )}
            </div>
          </DialogContent>
        </form>
      </Form>
      )}
      <Dialog open={props.fileopen} onOpenChange={props.setFileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" font-semibold">
              Import .xls file
            </DialogTitle>
          </DialogHeader>
          <div className="flex h-[600px] w-full flex-col items-center justify-center gap-4 bg-[#F2F8FF]">
            <Image
              src="/vectors/UploadCloud.svg"
              width="72"
              height="72"
              alt="upload icon"
            />
            <p className="text-xl font-medium	">Drag & drop to upload file</p>
            <p>or</p>
            <Input variant="default" type="file" accept=".xlsx" />
          </div>
          {/* <Input type="file" /> */}
        </DialogContent>
      </Dialog>
    </>
  )
}
export default AddNewHotlistedVehicl
