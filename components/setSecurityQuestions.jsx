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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { updateUserDetails, userLogout } from "@/lib/api"
import Image from 'next/image'
import {useState} from 'react';
import { useRouter } from "next/navigation"
export default function SetSecurityQuestions({newPassword}) { 
    const router = useRouter()
    const userInfoString = localStorage.getItem("user-info")
    const userInfo = JSON.parse(userInfoString)
    const { toast } = useToast()
    console.log(userInfo)
    const form = useForm({
        defaultValues: {
          id: userInfo.id,
          password: newPassword,
          mailId: userInfo.mailId,
          mobile: userInfo.mobile,
          sequrityQuestion1: userInfo.sequrityQuestion1,
          sequrityQuestion2: userInfo.sequrityQuestion2,
          sequrityAnswer1: userInfo.sequrityAnswer1,
          sequrityAnswer2: userInfo.sequrityAnswer2
        },
    })
    const questionSet1 = [
        "Which town were you born in?",
        "Which town was your father born in?",
        "What is the name of the hospital in which you were born?",
        "What is the first name of your best childhood friend?",
        "What was the name of your primary school?",
        "Which town was your mother born in?",
        "What is the name of the first company / organization you worked for?"
    ];

    const questionSet2 = [
        "What was your favourite food as a child?",
        "What is the title of your favourite book?",
        "Who is your favourite author?",
        "Who is your all-time favourite sports personality?",
        "Who is your all-time favourite movie character?",
        "What was your favourite childhood game?",
        "What was your favourite cartoon character as a child?"
    ];
    const onLogout = async () => {
        await userLogout()
    }
    const onSubmit = async(values) => {
        console.log("values",values)
        const response = await updateUserDetails(values)
        console.log("response",response)
        if(response.status === 200){
            toast({
                variant: "success",
                // title: "Scheduled: Catch up",
                description: "Saved successfully",
                duration:3000
            })
            onLogout();
            router.push("/login")
        }
        else{
            toast({
                variant: "destructive",
                description: "Error",
                duration:3000
            })
        }
        // setOpenAdminPassword(false)
      }
    return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-4">
        <div className="grid grid-cols-2 gap-4">
            {/* <div className="w-full">
                <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Username" {...field} className="py-2" required/>
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div> */}
            {/* <div className="w-full">
                <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                        <Input  type="password" disabled={true} placeholder="Enter Password" {...field} className="py-2" required/>
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="button" variant="link" className="h-6 p-0" onClick={setOpenAdminPassword}>Change Password</Button>
            </div> */}
            {/* <div className="w-full">
                <FormField
                control={form.control}
                name="mailId"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Email" {...field} className="py-2" required/>
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div> */}
            {/* <div className="w-full">
                <FormField
                control={form.control}
                name="mobile"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Mobile Number</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Mobile Number" {...field} className="py-2" required/>
                    </FormControl>
                    <FormDescription>
                        
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div> */}
        </div>
        <div>
        <div className="w-full">
                <FormField
                control={form.control}
                name="sequrityQuestion1"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Security Question 1</FormLabel>
                    <FormControl>
                    <Select onValueChange={field.onChange} defaultValue={field.value} required>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select security question 1" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Select Security Question</SelectLabel>
                            {questionSet1.map(question=>(
                                <SelectItem value={question}>{question}</SelectItem>
                            ))}
                            
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
                name="sequrityAnswer1"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Answer</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Your Answer" {...field} className="py-2" required/>
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
                name="sequrityQuestion2"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Security Question 2</FormLabel>
                    <FormControl>
                    <Select  onValueChange={field.onChange} defaultValue={field.value} required>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select security question 2" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                            <SelectLabel>Select Security Question</SelectLabel>
                            {questionSet2.map(question=>(
                                <SelectItem value={question}>{question}</SelectItem>
                            ))}
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
                name="sequrityAnswer2"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Your Answer</FormLabel>
                    <FormControl>
                        <Input placeholder="Enter Your Answer" {...field} className="py-2" required/>
                    </FormControl>
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
    )
}