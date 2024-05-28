"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { useEffect } from "react"
import useStore from "@/store/store"
import { useToast } from "@/components/ui/use-toast"
import {addUser, getUsersList} from "@/lib/api"

export default function AddUserDialog({setOpen}) {
    const roleList = useStore(state=>state.roleList)
    const setUsersList = useStore(state=>state.setUsersList)
    const userInfoString = localStorage.getItem("user-info")
    const userInfo = userInfoString ? JSON.parse(userInfoString): null
    const { toast } = useToast()
    // console.log(userInfo)
    const form = useForm({
        defaultValues: {
          username: "",
          profileId: null,
          password: "",
          confirmPassword: "",
          mailId: "",
          mobile: ""
        },
      })
    
async function onSubmit(userData) {
    console.log(userData)
    const userDetails = {
        "id": userData.username,
        "password": userData.password,
        "profileId": Number(userData.profileId),
        "name": "",
        "mailId": userData.mailId,
        "mobile": userData.mobile,
        "sequrityQuestion1": "",
        "sequrityQuestion2": "",
        "sequrityAnswer1": "",
        "sequrityAnswer2": ""
    };
    console.log(userDetails)
    if(userData.password !== userData.confirmPassword){
        toast({
            variant: "destructive",
            // title: "Scheduled: Catch up",
            description: "Password and Confirm Password does not match",
            duration:3000
          })
          return;
    
    }
    try{
        const userRes = await addUser(userDetails)
        console.log(userRes)
        toast({
            variant: "success",
            // title: "Scheduled: Catch up",
            description: "Saved successfully",
            duration:3000
          })
          setOpen(false)
          setUsersList()
          getUsersList()
    } catch (err){
        console.log(err)
        toast({
            variant: "destructive",
            // title: "Scheduled: Catch up",
            description: err.message,
            duration:3000
          })
    }
  }

  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} autocomplete="off" className="space-y-8 mt-4">
        <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
                <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Username" {...field} className="py-2" autocomplete="off" />
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="w-full">
                {/* {JSON.stringify(roleList)} */}
                <FormField
                control={form.control}
                name="profileId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Role *</FormLabel>
                    <FormControl>
                    {/* field.onChange */}
                    <Select  onValueChange={value=>field.onChange(value)} defaultValue={field.value}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Role" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Select Role</SelectLabel>
                            {roleList.map((item, index) => {
                                return (
                                <SelectItem key={index} value={item.profileId.toString()}>
                                    {item.profileName}
                                </SelectItem>
                                );
                            })}
                            </SelectGroup>
                        </SelectContent>
                        </Select>
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="w-full">
                <FormField
                control={form.control}
                name="mailId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Email" {...field} className="py-2" />
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="w-full">
                <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Mobile Number" {...field} className="py-2" />
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="w-full">
            <div className="w-full">
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input  type="password" placeholder="Enter Password" autocomplete="new-password" {...field} className="py-2" />
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                </div>
               
            </div>
            <div className="w-full">
                <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                        <Input  type="password" placeholder="Confirm Password" {...field} className="py-2" />
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                </div>
        </div>
        <div>
        
            

        </div>
        <div className="flex justify-end space-x-2">
        <Button type="submit">Add</Button>
        </div>
      </form>
    </Form>
  )
}
