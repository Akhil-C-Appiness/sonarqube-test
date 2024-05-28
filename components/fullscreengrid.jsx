"use client"

import Image from "next/image"

import { CameraGrid } from "@/components/camera-grid"

import { Button } from "./ui/button"

const FullscreenGrid = ({
  gridSize,
  numberOfGrids,
  selectedChannel,
  handleMenuOptions,
  playerRefs,
  handleFullGrid,
  handleSessionId,
}) => {
  return (
    <>
      <main className="ml-[5em] h-5/6 w-[93%] bg-[#FFFFFF]">
        <section className="flex items-center  justify-end">
          <Button
            variant="outline"
            className="mt-[1em]"
            onClick={() => handleFullGrid(false)}
          >
            <Image
              alt="fullscreen-icon"
              src="/vectors/exit.svg"
              width={15}
              height={15}
              className="mr-auto"
            />
            Exit Full Screen
          </Button>
        </section>
        <section>
          <CameraGrid
            gridSize={gridSize}
            numberOfGrids={numberOfGrids}
            selectedChannel={selectedChannel}
            handleMenuOptions={handleMenuOptions}
            playerRefs={playerRefs}
            handleSessionId={handleSessionId}
          />
        </section>
      </main>
    </>
  )
}

export default FullscreenGrid
