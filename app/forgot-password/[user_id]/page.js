"use client"

import React, { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"

import { siteConfig } from "@/config/site"
import { getLoginUserSecurityQuestions } from "@/lib/api"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loginscreen } from "@/components/login-screen"
import { HLBHelvetica } from "@/lib/fonts"

export default function IndexPage({ params }) {
  let brandClass = `${HLBHelvetica.className} mx-auto w-80 text-center text-2xl font-semibold text-primary`
  const router = useRouter()
  const user_id = params.user_id
  const [questionArray, setquestionArray] = useState([])
  const [showError, setShowError] = useState(false)
  useEffect(() => {
    async function myFunction() {
      const response = await getLoginUserSecurityQuestions(user_id)
      let questions = response.data.result;
      setquestionArray(questions)
      questions.length < 2  || questions[0] == null || questions[1] == null ? setShowError(true) : setShowError(false)
    }
    myFunction()
  }, [user_id])
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const onSubmit = (data) => {
    const userinfo = [user_id, data.answer1, data.answer2]
    localStorage.setItem("reset-password-user-info", userinfo)
    router.push("/reset-password")
  }
  return (
    <div className="flex min-h-screen w-full">
      <Loginscreen />
      <div className="w-full px-6 sm:px-10 md:w-1/2 md:px-14 lg:px-20 lg:py-16 xl:px-32 bg-white">
        <div className="flex w-full justify-center">
          <Image src="/images/logo.svg" width="80" height="80" alt="logo" />
        </div>
        <p className={brandClass}>
           Traffic Management System
        </p>
        <p className="w-full text-center text-[12px] font-normal text-[#9F9F9F]">V2.3.4</p>
        {questionArray?.length == 2 && questionArray[0] !== null && questionArray[1] !== null? (
          <div className="pt-20">
            <p className="text-2xl font-semibold">Forgot Password</p>
            <form
              className="mt-6 flex w-full flex-col gap-3"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className="max-full grid w-full items-center gap-1.5">
                <Label htmlFor="answer1" className="text-base">
                  {questionArray[0]}
                </Label>
                <Input
                  onChange={(e) => {
                    setAnswer1(e.target.value)
                  }}
                  type="text"
                  id="answer1"
                  placeholder="Answer the question"
                  {...register("answer1", { required: "Answer the question" })}
                />
                <p className="h-5 text-sm text-red-600">
                  {errors.answer1?.message}
                </p>
              </div>
              <div className="max-full grid w-full items-center gap-1.5">
                <Label htmlFor="answer2" className="text-base">
                  {questionArray[1]}
                </Label>
                <Input
                  type="text"
                  id="answer2"
                  placeholder="Answer the question"
                  {...register("answer2", { required: "Answer the question" })}
                />
                <p className="h-5 text-sm text-red-600">
                  {errors.answer2?.message}
                </p>
              </div>
              <div>
                <Button className="w-full" type="submit">
                  Reset Password
                </Button>
              </div>
              <div>
                <Link href="/login">
                  <Button variant="outline" className="w-full">
                    Login
                  </Button>
                </Link>
              </div>
            </form>
          </div>
        ) : showError ? (
            <div class="flex items-center rounded-xl bg-[#fef2f2] p-6 shadow-lg mt-[100px]">
              <div>
                  <div class="text-xl font-medium text-[#ef4444]">Error</div>
                <p class="text-[#f87171]">Security questions are not available.</p>
              </div>
            </div>
        )
      :
      <></>
      }
      </div>
    </div>
  )
}
