import { Card } from '@/components/ui/card'
import React from 'react'

export default async function page() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="p-6 max-w-md">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
        <p className="text-gray-600">
          Sorry, you do not have permission to access this page. Please contact your administrator if you believe this is a mistake.
        </p>
      </Card>
    </div>
  )
}
