import React from "react"
import Image from "next/image"

import { AspectRatio } from "./ui/aspect-ratio"

export const SearchGrid = ({}) => {
  return (
    <div>
      <AspectRatio ratio={5 / 4} className="bg-muted">
        <Image src="" alt="Photo" fill className="rounded-md object-cover" />
      </AspectRatio>
      <AspectRatio ratio={5 / 4} className="bg-muted">
        <Image src="" alt="Photo" fill className="rounded-md object-cover" />
      </AspectRatio>
    </div>
  )
}
