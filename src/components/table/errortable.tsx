"use client"
import { ServerCrash } from 'lucide-react'
import React from 'react'

interface ErrorTableProps {
  error?: string
}

export function ErrorTable({ error }: ErrorTableProps) {
  return (
    <div className="flex min-h-72 w-full flex-col items-center justify-center rounded border border-gray-200 bg-white px-2 py-4 text-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-600">
      <div className="text-[70px]">
        <ServerCrash />
      </div>
      <div>{error || 'Something went wrong please try to refresh the page.'}</div>
    </div>
  )
}
