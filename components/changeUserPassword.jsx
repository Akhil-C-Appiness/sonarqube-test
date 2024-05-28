"use client"
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { changePassword, userLogout } from "@/lib/api"
import Image from 'next/image'
import {useState} from 'react';
import { useRouter } from "next/navigation"
import SetSecurityQuestions from "@/components/setSecurityQuestions"
 
export default function ChangeUserPassword({setOpenAdminPassword}) { 
    const router = useRouter()
    const [openSetQuestions, setOpenSetQuestions] = useState(false)
    const [newPassword, setNewPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setshowNewPassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleNewPasswordVisibility = () => {
        setshowNewPassword(!showNewPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setshowConfirmPassword(!showConfirmPassword);
    }; 
    const userInfoString = localStorage.getItem("user-info")
    const userInfo = JSON.parse(userInfoString)
    const { toast } = useToast()
    // console.log(userInfo)
    
    const form = useForm({
        defaultValues: {
          password: userInfo.password,
        },
      })
    // const onLogout = async () => {
    //     await userLogout()
    // }
    const onSubmit = async(values) => {
    if(values.newpassword === values.repeatenewpassword){
        let data = {
            "id" : userInfo.id,
            "password" : values.newpassword
        }
        const response = await changePassword(data)
        if(response.status === 200){
            setNewPassword(values.newpassword)
            toast({
                variant: "success",
                description: response.data.message,
                duration:3000
            })
            setOpenSetQuestions(true)
            // setTimeout(()=>setOpenSetQuestions(true),500)
            // onLogout();
            // router.push("/login")
        }
        else{
            toast({
                variant: "destructive",
                description: "Error",
                duration:3000
            })
        }
    }
    else{
        toast({
            variant: "destructive",
            description: "The password and confirm password do not match.",
            duration:3000
        })
    }
    // let data = {
    //     "id" : userInfo.id,
    //     "password" : "Admin@123"
    // }
    // console.log("values",values)
    // setOpenAdminPassword(false)
  }
  return (
    <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <div className="grid grid-cols-1 gap-4">
            <div className="relative w-full">
                <FormField control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Current Password</FormLabel>
                    <FormControl>
                        <Input type={showPassword ? 'text' : 'password'} placeholder="Enter Current Password" {...field} className="py-2" required/>
                    </FormControl>
                    <Image src="/vectors/Eye.svg" width="24" height="24" className="absolute right-4 top-[35%]" alt="icon" onClick={togglePasswordVisibility}/>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="relative w-full">
                <FormField control={form.control}
                name="newpassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                        <Input type={showNewPassword ? 'text' : 'password'} placeholder="Enter New Current" {...field} className="py-2" required/>
                    </FormControl>
                    <Image src="/vectors/Eye.svg" width="24" height="24" className="absolute right-4 top-[35%]" alt="icon" onClick={toggleNewPasswordVisibility}/>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
            <div className="relative w-full">
                <FormField control={form.control}
                name="repeatenewpassword"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                        <Input type={showConfirmPassword ? 'text' : 'password'} placeholder="Enter Confirm Password" {...field} className="py-2" required/>
                    </FormControl>
                    <Image src="/vectors/Eye.svg" width="24" height="24" className="absolute right-4 top-[35%]" alt="icon" onClick={toggleConfirmPasswordVisibility}/>
                    <FormDescription>
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
        </div>
        <div className="flex justify-end space-x-2">
        <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </Form>
    <Dialog open={openSetQuestions}>
        <DialogContent className={"max-h-screen overflow-y-scroll"}>
            <DialogHeader>
            <DialogTitle>Set Security Questions</DialogTitle>
            <DialogDescription>
                <SetSecurityQuestions setOpenSetQuestions={setOpenSetQuestions} newPassword={newPassword} setOpenAdminPassword={setOpenAdminPassword}/>
            </DialogDescription>
            </DialogHeader>
        </DialogContent>
    </Dialog>
    </>
  )
}
