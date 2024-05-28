import Image from "next/image"

export function Loginscreen() {
  return (
    <div className="hidden w-1/2 items-center justify-center bg-[#F2F8FF] md:flex">
      <Image
        src="/images/login-image.jpeg"
        width="1000"
        height="1500"
        className="h-full w-full object-cover"
        alt="ITMS Login"
        quality={100}
      />
    </div>
  )
}
