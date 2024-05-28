"use client"

import { useEffect, useState } from "react"
import dynamic from 'next/dynamic';

// import Image from "next/image"
import useStore from "@/store/store"

import { deleteUser, updateUser } from "@/lib/api"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

// import AddUserDialog from "../components/addUserDialog"
// import DataTable from "../components/table"

const Image = dynamic(() => import("next/image"));
const AddUserDialog = dynamic(() => import("../components/addUserDialog"));
const DataTable = dynamic(() => import("../components/table"));

const UserList = () => {
  const setRoleList = useStore((state) => state.setRoleList)
  const roleList = useStore((state) => state.roleList)
  const setUsersList = useStore((state) => state.setUsersList)
  const usersList = useStore((state) => state.usersList)
  const { toast } = useToast()
  const [userListFiltered, setUserListFiltered] = useState([...usersList])
  // openAddUser
  const [openAddUser, setOpenAddUser] = useState(false)
  useEffect(() => {
    setRoleList()
    setUsersList()
  }, [])

  useEffect(() => {
    setUserListFiltered(usersList)
  }, [usersList])
  useEffect(() => {
    console.log(usersList)
  }, [usersList])
  console.log(usersList)
  const deleteUserWithId = async (userId) => {
    console.log(userId)
    try {
      const updatedRes = await deleteUser(userId)

      setUsersList()
      toast({
        variant: "success",
        description: "User Deleted Successfully",
        duration: 3000,
      })
    } catch (err) {
      console.log(err)
    }
  }

  const updateUserRole = async ({ selectedValue, user }) => {
    console.log("selectedValue", selectedValue, user)
    // const updatedUser = {...user, profileId:selectedValue}
    const updatedUser = {
      id: user.id,
      password: user.password,
      profileId: selectedValue,
      name: user.name,
      mailId: user.mailId,
      mobile: user.mobile,
      sequrityQuestion1: user.sequrityQuestion1,
      sequrityQuestion2: user.sequrityQuestion2,
      sequrityAnswer1: user.sequrityAnswer1,
      sequrityAnswer2: user.sequrityAnswer2,
    }
    console.log(updatedUser)
    try {
      const updatedRes = await updateUser(updatedUser)
      console.log("updatedRes", updatedRes)
      setUsersList()
      toast({
        variant: "success",
        description: "Role Updated Successfully",
        duration: 3000,
      })
    } catch (err) {
      console.log(err)
    }
  }
  const filterUserByRole = (selectedVal) => {
    const filteredUsers = usersList.filter((user) => {
      if (selectedVal === "All") {
        return user
      } else {
        return user.userProfile.profileName === selectedVal
      }
    })

    setUserListFiltered(() => {
      return [...filteredUsers]
    })
  }
  const tableColumns = [
    {
      accessorKey: "id",
      header: "User Name",
      cell: ({ row }) => <div>{row.getValue("id")}</div>,
    },
    {
      accessorKey: "mailId",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("mailId")}</div>,
    },
    {
      accessorKey: "userProfile.profileName",
      header: "Role",
      cell: ({ row }) => (
        <div>
          <Select
            onValueChange={(selectedVal) =>
              updateUserRole({ selectedValue: selectedVal, user: row.original })
            }
            defaultValue={row.original?.userProfile?.profileId}
          >
            <SelectTrigger className="w-[180px] border-none font-medium">
              <SelectValue id="roles" placeholder="Select ROLE" />
            </SelectTrigger>
            <SelectContent>
              {roleList.map((item, index) => {
                return (
                  <SelectItem key={item.profileName} value={item.profileId}>
                    {item.profileName}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          {/* {row.original?.userProfile?.profileName} */}
        </div>
      ),
    },
    {
      accessorKey: "createdOn",
      header: "Created On",
      cell: ({ row }) => <div>{row.getValue("createdOn")}</div>,
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div>
          <Dialog>
            <DialogTrigger>
              {" "}
              <span className="inline-flex rounded-md shadow-sm">
                <Image
                  src="/images/message-icon-grey.svg"
                  width="20"
                  height="20"
                  alt="icon"
                />
              </span>
            </DialogTrigger>
            <DialogContent
              className={"max-h-screen overflow-y-scroll lg:max-w-screen-md"}
            >
              <DialogHeader>
                <DialogTitle>Message</DialogTitle>
                <DialogDescription></DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <span className="ml-4 inline-flex rounded-md shadow-sm">
                <Image
                  src="/images/delete-icon-red.svg"
                  width="20"
                  height="20"
                  alt="icon"
                />
              </span>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  Do you want to delete this user{" "}
                  <strong> ({row.original.id})</strong>?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => deleteUserWithId(row.original.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      ),
    },
  ]
  return (
    <div className="flex w-full flex-col pt-4">
      <div className="flex w-full">
        <div className="flex w-56  flex-col">
          <Select
            onValueChange={(selectedVal) => filterUserByRole(selectedVal)}
            defaultValue={"All"}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue id="roles" placeholder="Select ROLE" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>

              {roleList.map((item, index) => {
                return (
                  <SelectItem key={item.profileName} value={item.profileName}>
                    {item.profileName}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>
        <div className="flex grow justify-end ">
          <Dialog open={openAddUser} onOpenChange={setOpenAddUser}>
            <DialogTrigger>
              {" "}
              <Button variant="blueoutline">
                {" "}
                <Image
                  className="mr-2"
                  src="/images/add-user-blue-icon.svg"
                  width="24"
                  height="24"
                  alt="icon"
                />{" "}
                Add New User
              </Button>
            </DialogTrigger>
            <DialogContent
              className={"max-h-screen overflow-y-scroll lg:max-w-screen-md"}
            >
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  <AddUserDialog setOpen={setOpenAddUser} />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col">
        <DataTable data={userListFiltered} columns={tableColumns} />
      </div>
    </div>
  )
}

export default UserList
