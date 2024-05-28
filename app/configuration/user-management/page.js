"use client"
import dynamic from 'next/dynamic';

// import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import UserList from './components/user-list'
// import RolesList from './components/roles'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, } from "@/components/ui/dialog"
// import AdminProfileDialog from "./components/adminProfileDialog"
// import ChangePasswordDialog from "./components/changePasswordDialog"
import {useState} from 'react';
const Image = dynamic(() => import("next/image"));
const UserList = dynamic(()=>import("./components/user-list"))
const RolesList = dynamic(()=>import("./components/roles"))
const AdminProfileDialog = dynamic(()=>import("./components/adminProfileDialog"))
const ChangePasswordDialog = dynamic(()=>import("./components/changePasswordDialog"))


const UserManagementConfig = ()=>{
    const [openAdminProfile, setOpenAdminProfile] = useState(false);
    const [openAdminPassword, setOpenAdminPassword] = useState(false);
    return <div className=" w-full p-4">
        <div className="flex w-full">
            <div className="py-4 font-medium">User Management</div>
            

            <div className="flex grow justify-end ">
                
                <Dialog open={openAdminProfile} onOpenChange={setOpenAdminProfile}>
                    <DialogTrigger> <Button variant="adminprofile" size="ul" > <div className="p-3 bg-[#EEF8FF] rounded-full"><Image src="/images/user_icon_blue.svg"  alt="icon"  width={24} height={24} /></div> Admin Profile
                    <Image src="/images/edit_icon_grey.svg"  width={18} height={18} alt="icon" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className={"max-h-screen overflow-y-scroll lg:max-w-screen-md"}>
                        <DialogHeader>
                        <DialogTitle>Admin Profile</DialogTitle>
                        <DialogDescription>
                            <AdminProfileDialog setOpenAdminProfile={setOpenAdminProfile} setOpenAdminPassword={setOpenAdminPassword}/>
                        </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                    </Dialog>

                    <Dialog open={openAdminPassword} onOpenChange={setOpenAdminPassword}>
                    {/* <DialogTrigger> <Button variant="adminprofile" size="ul" > <div className="p-3 bg-[#EEF8FF] rounded-full"><Image src="/images/user_icon_blue.svg"  alt="icon"  width={24} height={24} /></div> Admin Profile
                    <Image src="/images/edit_icon_grey.svg"  width={18} height={18} alt="icon" />
                        </Button>
                    </DialogTrigger> */}
                    <DialogContent className={"max-h-screen overflow-y-scroll"}>
                        <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            <ChangePasswordDialog setOpenAdminPassword={setOpenAdminPassword} />
                        </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                    </Dialog>
               
                </div>
        </div>
        <div>
        <Tabs defaultValue="account" className="w-full">
        <TabsList>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200" value="account">Users</TabsTrigger>
            <TabsTrigger className="hover:bg-primary hover:text-white data-[state=active]:bg-primary data-[state=active]:text-white border border-slate-200" value="password">Roles & Permissions</TabsTrigger>
        </TabsList>
        <TabsContent value="account"><UserList /></TabsContent>
        <TabsContent value="password"><RolesList /></TabsContent>
        </Tabs>
        </div>
    </div> 
}

export default UserManagementConfig