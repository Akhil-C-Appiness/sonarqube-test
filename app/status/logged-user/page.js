"use client"
import { Button } from "@/components/ui/button"
import React, { useEffect, useState } from "react"
import { getAllLoggedUsersStatus, sendLoginUserMessage } from "@/lib/api"
import { useForm } from "react-hook-form"
import Link from "next/link"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function IndexPage() {
    let trodd = "bg-[#F6F6F6]";
    let treven = "bg-[#FFFFFF]";
    let tdstyle= "h-[56px] p-4 text-left text-[12px] leading-4 text-[#3F3F40]";
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
      } = useForm()
    let [userArray, setuserArray] = useState([])
    const [open, setOpen] = useState(false)
    let [activeUserid, setActiveUserId] = useState();
    let [responsemsg, setresponsemsg] = useState(false);
    useEffect(()=>{
        async function loggedUsersStatus(){
            const response = await getAllLoggedUsersStatus();
            setuserArray(response.data.result);
        }
        loggedUsersStatus();
    },[])
    useEffect(()=>{
        // console.log("Array",userArray )
    },[userArray])
    function sendMessage(data){
        setActiveUserId(data);
        setOpen(true)
    }
    const onSubmit = async (data) => {
        const message = data.message
        const userId = activeUserid;
        let isloggedin = localStorage.getItem("isloggedin");
        let userName;
        if(isloggedin){
            let userInfo = JSON.parse(localStorage.getItem("user-info"));
            userName = userInfo.id;
        }
        let formData = {
            fromUser: userName,
            message: message,
            timestamp: 0,
            toUser: activeUserid,
          }
        const msgResponse = await sendLoginUserMessage(formData)
        setActiveUserId("");
        setOpen(false);
        if(msgResponse.status === 2007){
            setresponsemsg(true)
        }
        // alert(msgResponse.message)
    }
    return (
    <div className="flex flex-col">
        <div className="flex w-full flex-row items-center justify-between px-8 py-4">
            <h1 className="text-md font-semibold leading-6 text-[#0F0F10]">Site Name (ITMS-2500) / Logged User</h1>
            <Button variant="ghost" className="text-[#2A94E5]">Refresh</Button>
        </div>
        <div className="w-full px-8">
            <table className="w-full">
                <tr>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Username</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Host Address</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Login Time</th>
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Message for User</th>
                    {/* <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Remote Desktop View</th> */}
                    <th className="h-[56px] bg-[#EEF8FF] p-4 text-left text-sm font-semibold leading-6 text-[#0F0F10]">Force Logout</th>
                </tr>
                {userArray?.map((item,index) => (
                    
                    <tr className={index%2 == 0 ? trodd : treven}>
                        <td className={tdstyle}>{item.user.id}</td>
                        <td className={tdstyle}>{item.clientAddress}</td>
                        <td className={tdstyle}>{new Date(item.loginTime).toLocaleString()}</td>
                        <td className={tdstyle}><Button variant="link" onClick={() => {sendMessage(item.user.id)}}>Send</Button></td>
                        {/* <td className={tdstyle}></td> */}
                        <td className={tdstyle}>---</td>
                    </tr>
                ))}
            </table>
            {/* {userArray[0]} */}
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Send Message</DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-lg">
                    <form
                    className="flex flex-col gap-2 mt-6 w-full"
                    onSubmit={handleSubmit(onSubmit)}>
                        <Input 
                        type="text"
                        id="message"
                        placeholder="Enter your message"
                        {...register("message", { required: "Enter your message" })}/>
                        <br />
                        <Button className="w-full">
                            Send Message
                        </Button>
                    </form>
                </DialogDescription>
            
            </DialogContent>
        </Dialog>
        <Dialog open={responsemsg} onOpenChange={setresponsemsg}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>message sent successfully</DialogTitle>
                </DialogHeader> 
            </DialogContent>
        </Dialog>
    </div>
  )
}
