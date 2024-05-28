import React, { useState } from "react"

import { Button } from "@/components/ui/button"

const Pagination = ({
  data,
  pageHandler,
  handleNextPage,
  handlePrevPage,
  totalPages,
  currentPage,
  handleFirstPage,
  handleLastPage
}) => {
  // let pageNumbers = []
  // for (let i = 1; i < Math.ceil(data?.length / 100); i++) {
  //   pageNumbers.push(i)
  // }
  return (
    <div
      className="flex flex-wrap items-center justify-center gap-[2em]"
      style={{ marginBottom: "2em", marginTop: "1em" }}
    >
      <Button
        onClick={handleFirstPage}
        disabled={currentPage === 1}
        variant="blueoutline"
      >
        Go to First
      </Button>
      <Button
        onClick={handlePrevPage}
        disabled={currentPage === 1}
        variant="blueoutline"
      >
        Previous
      </Button>
      <Button
        onClick={handleNextPage}
        disabled={currentPage === totalPages}
        variant="blueoutline"
        className=""
      >
        Next
      </Button>
      <Button
        onClick={handleLastPage}
        disabled={currentPage === totalPages}
        variant="blueoutline"
        className=""
      >
        Go to Last
      </Button>
      {/* <div>Total Pages : {totalPages}</div> */}

      {/* {pageNumbers.map((page, index) => (
        <div
          key={index}
          className=" flex h-8 w-8 cursor-pointer  items-center justify-center rounded-md border border-[#2A94E5]"
          onClick={() => pageHandler(page)}
        >
          {page}
        </div>
      ))} */}
    </div>
  )
}

export default Pagination
