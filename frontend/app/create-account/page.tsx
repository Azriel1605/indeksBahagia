"use client"

import { Suspense } from "react"
import CreateAccountContent from "./CreateAccountContent"

export default function CreateAccountPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CreateAccountContent />
    </Suspense>
  )
}
