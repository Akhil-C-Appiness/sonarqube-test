"use client"

import React, { useEffect, useState } from "react"
import dynamic from "next/dynamic"
// import Image from "next/image"
import useStore from "@/store/store"
import { useForm } from "react-hook-form"

import {
  deRegVehicle,
  updateVehicle,
  vehCount,
  vehData,
  vehDelete,
  vehicleAdd,
} from "@/lib/api"
import { Accordion, AccordionItem } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// import AddNewHotlistedVehicl from "./components/add-new-hotlisted-vehicle"
import DataTable from "./components/table"

const Image = dynamic(() => import("next/image"))
const AddNewHotlistedVehicl = dynamic(() =>
  import("./components/add-new-hotlisted-vehicle")
)

const VRConfig = () => {
  const vehicleTypes = useStore((state) => state.vehicleTypes)
  const setVehicleTypes = useStore((state) => state.setVehicleTypes)

  const [selectedType, setSelectedType] = useState(null)
  const [newCategory, setNewCategory] = useState("")
  const [storeData, setStoreData] = useState()
  const [searchValue, setSearchValue] = useState("")
  const [selectedRows, setSelectedRows] = useState([])
  const [vehicleList, setVehicleList] = useState([])
  const [selectedVehicleNumbers, setSelectedVehicleNumbers] = useState([])
  const [newRegNo, setNewRegNo] = useState()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedVehicleNumber, setSelectedVehicleNumber] = useState(null)

  const [open, setOpen] = useState(false)
  const [regOpen, setRegOpen] = useState(false)
  const [updateRegOpen, setUpdateRegOpen] = useState(false)
  const [editCategoryopen, setEditCategoryopen] = useState(false)
  const [addCategoryopen, setAddCategoryopen] = useState(false)
  const [deleteOpen, setdeleteOpen] = useState(false)
  const [fileopen, setFileOpen] = useState(false)
  const [description, setDescription] = useState()
  const [ownerName, setOwnerName] = useState()
  const [ownerPhn, setOwnerPhn] = useState()
  const [policeStation, setPoliceStation] = useState()
  const [address, setAddress] = useState()
  const [storeSelId, setStoreSelId] = useState()
  const [storeType, setStoreType] = useState()

  const { toast } = useToast()

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

  useEffect(() => {
    setVehicleTypes()
  }, [])

  const addVehicle = () => {
    let payload = {
      vehicleType: newCategory,
    }
    const addVeh = async (payload) => {
      try {
        const addVehicles = await vehicleAdd(payload)
        // console.log("vehicle", addVehicles);
        toast({
          variant: "success",
          description: "Successfully created!",
          duration: 3000,
        })
        setAddCategoryopen(false)
        setVehicleTypes((prevState) => {
          return [...(Array.isArray(prevState) ? prevState : []), newCategory]
        })
      } catch (error) {
        toast({
          variant: "destructive",
          description:
            "Duplicate Vehicle Type. Please try with different vehicle type",
          duration: 3000,
        })
      }
    }
    addVeh(payload)
  }

  const categories = [
    "Stolen",
    "Wanted",
    "Classified",
    "Suspected",
    "Blacklisted",
  ]

  const filteredCategories = categories.filter((category) =>
    category.toLowerCase().includes(newCategory.toLowerCase())
  )
  const handleCategoryClick = (category) => {
    setNewCategory(category)
  }
  const handleDeleteClick = (id) => {
    const deleteVeh = async (id) => {
      try {
        await vehDelete(id)
        setVehicleTypes((prevTypes) =>
          prevTypes.filter((type) => type.id !== id)
        )
        toast({
          variant: "success",
          description: "Successfully deleted!",
          duration: 3000,
        })
      } catch (error) {
        toast({
          variant: "destructive",
          description:
            "Invalid request! Please verify request parameter data type and submit again.",
          duration: 3000,
        })
      }
    }
    deleteVeh(id)
  }
  const selectedVehicleTypeId = vehicleTypes?.find(
    (vehicle) => vehicle?.vehicleType === selectedType
  )?.id
  const handleSearch = (searchValue) => {
    let payload = {
      ownerName: searchValue,
      vehicleNumber: searchValue,
      vehicleType:
        selectedVehicleTypeId !== undefined ? selectedVehicleTypeId : -1,
    }
    const searchVehicleCount = async (payload) => {
      try {
        const searchedVehCount = await vehCount(payload)
      } catch (error) {
        toast({
          variant: "destructive",
          description:
            "Duplicate Vehicle Type. Please try with different vehicle type",
          duration: 3000,
        })
      }
    }
    searchVehicleCount(payload)

    const containsAlphabetsAndNumbers = /[a-zA-Z]+.*\d+|\d+.*[a-zA-Z]+/.test(
      searchValue
    )
    if (containsAlphabetsAndNumbers) {
      let payload2 = {
        ownerName: "",
        vehicleNumber: searchValue,
        vehicleType:
          selectedVehicleTypeId !== undefined ? selectedVehicleTypeId : -1,
        limit: 100,
        offSet: 0,
      }

      const searchVehicleData = async (payload2) => {
        try {
          const searchedVehData = await vehData(payload2)
          setStoreData(searchedVehData?.data?.result)
        } catch (error) {
          toast({
            variant: "destructive",
            description:
              "Duplicate Vehicle Type. Please try with different vehicle type",
            duration: 3000,
          })
        }
      }
      searchVehicleData(payload2)
    } else {
      let payload3 = {
        ownerName: searchValue,
        vehicleNumber: "",
        vehicleType:
          selectedVehicleTypeId !== undefined ? selectedVehicleTypeId : -1,
        limit: 100,
        offSet: 0,
      }
      const searchVehicleData = async (payload3) => {
        try {
          const searchedVehData = await vehData(payload3)
          setStoreData(searchedVehData?.data?.result)
        } catch (error) {
          toast({
            variant: "destructive",
            description:
              "Duplicate Vehicle Type. Please try with different vehicle type",
            duration: 3000,
          })
        }
      }
      searchVehicleData(payload3)
    }
  }
  useEffect(() => {
    handleSearch(searchValue)
  }, [])
  const handleCheckboxChange = (vehicleNumber) => {
    if (selectedRows.includes(vehicleNumber)) {
      setSelectedRows(selectedRows.filter((number) => number !== vehicleNumber))
    } else {
      setSelectedRows([...selectedRows, vehicleNumber])
    }
  }

  useEffect(() => {}, [selectedRows])

  const handleRowClick = (event, vehicleNumber) => {
    if (!event.target.classList.contains("row-checkbox")) {
      setStoreSelId(vehicleNumber)
      if (selectedVehicleNumbers.includes(vehicleNumber)) {
        setSelectedVehicleNumbers(
          selectedVehicleNumbers.filter((number) => number !== vehicleNumber)
        )
      } else {
        setSelectedVehicleNumbers([...selectedVehicleNumbers, vehicleNumber])
      }
      setUpdateRegOpen(true)
      console.log("update", updateOpen)
    }
  }
  useEffect(() => {}, [storeSelId])

  const handleDeReg = () => {
    const delVehList = async (selectedRows) => {
      try {
        await deRegVehicle(selectedRows)
        setStoreData((prevTypes) =>
          prevTypes.filter((type) => type.vehicleNumber !== vehicleNumber)
        )
        toast({
          variant: "success",
          description: "Successfully deleted!",
          duration: 3000,
        })
      } catch (error) {
        toast({
          variant: "destructive",
          description:
            "Invalid request! Please verify request parameter data type and submit again.",
          duration: 3000,
        })
      }
    }
    delVehList(selectedRows)
  }

  const updateRegVehicle = async () => {
    let matchedId
    const matchedOption = vehicleTypes?.find(
      (option) => option.vehicleType === storeType
    )
    if (matchedOption) {
      matchedId = matchedOption.id
    }

    let payload = {
      vehicleNumber: storeSelId,
      description: description,
      ownerName: ownerName,
      ownerPhone: ownerPhn,
      addressTwo: policeStation,
      addressOne: address,
      vehicleType: matchedId,
    }

    try {
      const VehDetails = await updateVehicle(payload)
      toast({
        variant: "success",
        description: "Successfully updated!",
        duration: 3000,
      })

      handleSearch()
      setUpdateRegOpen(false)
    } catch (error) {
      toast({
        variant: "destructive",
        description: "An error occured, please try again!",
        duration: 3000,
      })
    }
  }
  useEffect(() => {}, [storeData])

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
  useEffect(() => {}, [vehicleTypes])
  return (
    <div className="p-8">
      <h1 className="pb-8 text-[20px] font-semibold">Vehicle Registration</h1>
      <h2 className="pb-4 text-[16px] font-semibold">
        Search Hotlisted Vehicles By
      </h2>
      <div className="flex flex-row flex-wrap items-center justify-between gap-2">
        <div className="relative flex flex-row items-center justify-start gap-2">
          <Popover>
            <PopoverTrigger className="flex w-[200px] flex-row items-center justify-between gap-4 rounded-sm border p-2">
              {selectedType ? (
                <span>{selectedType}</span>
              ) : (
                <span>Click to Select</span>
              )}
              <Image
                alt="Down"
                src="/vectors/Down.svg"
                width={24}
                height={24}
              />
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-2">
              <RadioGroup
                value={selectedType}
                onValueChange={(value) => setSelectedType(value)}
              >
                {vehicleTypes.map((item) => (
                  <div className="flex items-center justify-start gap-2 py-2 text-sm text-black">
                    <RadioGroupItem value={item.vehicleType} id={item.id} />
                    <Label htmlFor={item.id}>{item.vehicleType}</Label>
                    {/* <Button
                      key={item.id}
                      variant="ghost"
                      className={`text- flex w-full items-center justify-start rounded-none text-[14px]${
                        selectedType === item.vehicleType ? "blue" : "#6F6F70"
                      }`}
                      onClick={() => setSelectedType(item.vehicleType)}
                    >
                      {item.vehicleType}
                    </Button> */}
                  </div>
                ))}
              </RadioGroup>
              <div className="flex flex-row flex-wrap items-center justify-between">
                <Button
                  variant="outline"
                  className="w-[160px]"
                  onClick={setEditCategoryopen}
                >
                  Edit Categories
                </Button>
                <Button
                  variant="default"
                  className="w-[160px]"
                  onClick={setAddCategoryopen}
                >
                  Add New Category
                </Button>
              </div>
            </PopoverContent>
          </Popover>
          <div className="relative">
            <Image
              src="/vectors/Vector.svg"
              width="24"
              height="24"
              className="absolute left-2 top-2"
              alt="search icon"
            />
            <Input
              id=""
              name=""
              className="w-[350px] py-2 pl-10"
              placeholder="Search for vehicle number or owner"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <Button
            variant="default"
            className="rounded-sm"
            onClick={() => handleSearch(searchValue)}
          >
            Search
          </Button>
        </div>
        <Button
          variant="outline"
          className="rounded-sm border-[#2A94E5] bg-[#EEF8FF] text-[#2A94E5]"
          onClick={setRegOpen}
        >
          Register New Vehicle
        </Button>
      </div>
      <h2 className="py-4 text-[16px] font-semibold">Search Results</h2>
      {storeData && (
        <Table>
          <TableHeader className="bg-[#EEF8FF]">
            <TableRow>
              <TableHead>
                <Checkbox />
              </TableHead>
              <TableHead>Vehicle Number</TableHead>
              <TableHead>Vehicle Type</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>FIR</TableHead>
              <TableHead>Police Station</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {storeData?.map((item, index) => (
              <TableRow
                key={index}
                className={index % 2 === 1 ? "bg-[#F6F6F6]" : ""}
                onClick={(event) => handleRowClick(event, item.vehicleNumber)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>
                  <Checkbox
                    className="row-checkbox"
                    onClick={() => handleCheckboxChange(item.vehicleNumber)}
                  />
                </TableCell>
                <TableCell>{item.vehicleNumber}</TableCell>
                <TableCell>
                  {getVehicleType(item.vehicleType, vehicleTypes)}
                </TableCell>
                <TableCell>{item.ownerName}</TableCell>
                <TableCell>-</TableCell>
                <TableCell>-</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <div className="mt-8 flex h-[80px] w-full flex-row items-center justify-between rounded-sm border-[#DFDFDF] bg-[#F6F6F6] p-4">
        <p>Please select the vehicle to De-register them</p>
        <Button variant="default" onClick={setOpen}>
          De-Register Vehicle
        </Button>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" font-semibold">
              De-Register vehicle
            </DialogTitle>
            <DialogDescription>
              <p className="mt-4 text-[14px]">
                Are you sure you want to De-Register selected (
                {selectedRows.length}) vehicles?
              </p>
              <div className="flex items-center justify-start gap-2">
                <Button variant="outline" className="mt-6 rounded-sm">
                  Cancel
                </Button>
                <Button
                  variant="default"
                  className="mt-6 rounded-sm"
                  onClick={handleDeReg}
                >
                  De-Register
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <Dialog open={regOpen} onOpenChange={setRegOpen}>
        <AddNewHotlistedVehicl
          setFileOpen={setFileOpen}
          fileopen={fileopen}
          setNewRegNo={setNewRegNo}
          newRegNo={newRegNo}
          vehicleTypes={vehicleTypes}
        />
      </Dialog>
      <Dialog open={updateRegOpen} onOpenChange={setUpdateRegOpen}>
        <Form {...form}>
          <form autocomplete="off">
            <DialogContent
              className={
                "max-h-screen w-[800px] overflow-y-scroll lg:max-w-screen-md"
              }
            >
              <DialogHeader>
                <DialogTitle className="flex flex-row flex-wrap items-center justify-between pt-4">
                  <h1 className="font-semibold">Update Hotlisted Vehicle</h1>
                  <Button className="" variant="outline" onClick={setFileOpen}>
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
                              value={storeSelId}
                              disabled
                            />
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
                            <Input
                              placeholder="Enter Owner Name"
                              {...field}
                              className="py-2"
                              autocomplete="off"
                              value={ownerName}
                              onChange={handleNameChange}
                            />
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
                          <Select
                            required
                            onValueChange={(val) => setStoreType(val)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select Vehicle Type" />
                            </SelectTrigger>
                            <SelectContent>
                              {vehicleTypes?.map((option) => (
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
                          <Input
                            placeholder="Enter Owner Contact details"
                            {...field}
                            className="py-2"
                            autocomplete="off"
                            value={ownerPhn}
                            onChange={handlePhoneChange}
                          />
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
                          <Input
                            placeholder="Enter Police Station"
                            {...field}
                            className="py-2"
                            autocomplete="off"
                            value={policeStation}
                            onChange={handlePoliceStationChange}
                          />
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
                          <Input
                            placeholder="Enter Address"
                            {...field}
                            className="py-2"
                            autocomplete="off"
                            value={address}
                            onChange={handleAddressChange}
                          />
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
                        <Textarea
                          className="w-full"
                          value={description}
                          onChange={handleDescriptionChange}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="mt-2 flex items-center justify-end">
                <Button variant="default" onClick={updateRegVehicle}>
                  Update vehicle
                </Button>
              </div>
            </DialogContent>
          </form>
        </Form>

        <Dialog open={fileopen} onOpenChange={setFileOpen}>
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
          </DialogContent>
        </Dialog>
      </Dialog>
      <Dialog open={editCategoryopen} onOpenChange={setEditCategoryopen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" font-semibold">Edit Category</DialogTitle>
          </DialogHeader>
          {vehicleTypes.map((type) => (
            <div
              key={type.id}
              className="flex h-[40px] w-full flex-row items-center justify-between p-4"
            >
              {type.vehicleType}
              <Button
                variant="ghost"
                onClick={() => handleDeleteClick(type.id)}
              >
                <Image
                  src="/images/delete-icon-red.svg"
                  width="20"
                  height="20"
                  alt="icon"
                />
              </Button>
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => {
              setAddCategoryopen(setEditCategoryopen)
            }}
          >
            Cancel
          </Button>
        </DialogContent>
      </Dialog>
      <Dialog open={addCategoryopen} onOpenChange={setAddCategoryopen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" font-semibold">
              Add new Category
            </DialogTitle>
          </DialogHeader>
          <Input
            id=""
            name=""
            className="w-full py-2 pl-10"
            placeholder="Search for vehicle number or owner"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <div>
            {filteredCategories.map((category, index) => (
              <div
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="flex h-[40px] w-full flex-row items-center justify-between rounded-sm border-[#DFDFDF] bg-[#F6F6F6] p-4"
              >
                {category}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setAddCategoryopen(false)
              }}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={addVehicle}>
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteOpen} onOpenChange={setdeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className=" font-semibold">
              Delete Category
            </DialogTitle>
            <DialogDescription>
              <p className="mt-4 text-[14px]">
                Do you want to delete “Blacklisted vehicle” category?
              </p>
              <div className="flex items-center justify-start gap-2">
                <Button
                  variant="outline"
                  className="mt-6 rounded-sm"
                  onClick={() => {
                    setdeleteOpen(false)
                  }}
                >
                  Cancel
                </Button>
                <Button variant="destructive" className="mt-6 rounded-sm">
                  Delete
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}
function getVehicleType(vehicleTypeId, vehicleTypes) {
  const matchedType = vehicleTypes.find((type) => type.id === vehicleTypeId)
  return matchedType ? matchedType.vehicleType : "Unknown"
}
export default VRConfig
