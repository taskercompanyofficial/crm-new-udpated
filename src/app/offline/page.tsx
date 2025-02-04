"use client"
import React from 'react';

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="mb-4 text-2xl font-bold">You&apos;re Offline</h1>
      <p className="mb-4 text-center text-gray-600">
        Please check your internet connection and try again.
      </p>
      <button 
        onClick={() => window.location.reload()} 
        className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600"
      >
        Retry Connection
      </button>
    </div>
  );
}
  