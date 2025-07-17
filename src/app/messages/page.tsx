"use client"

import { useState } from "react"
import { ChatSidebar } from "./components/chat-sidebar"
import { ChatMain } from "./components/chat-main"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useSession } from "next-auth/react"
import useFetch from "@/hooks/usefetch"
import { MESSAGE_CHAT_ROOMS, API_URL } from "@/lib/apiEndPoints"

export default function ChatApp() {
    const { data: session } = useSession()
    const token = session?.user?.token;
    const { data, isLoading } = useFetch(`${API_URL}${MESSAGE_CHAT_ROOMS}`, token)
    const role = session?.user?.role
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [selectedChat, setSelectedChat] = useState("1")

    return (
        <div className="flex h-screen bg-background overflow-hidden">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
            )}

            {/* Sidebar */}
            <div
                className={`
        fixed lg:static inset-y-0 left-0 z-50 w-80 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
            >
                <ChatSidebar selectedChat={selectedChat} onSelectChat={setSelectedChat} onClose={() => setSidebarOpen(false)} data={data as any} />
            </div>
            {/* Main chat area */}
            <div className="flex-1 flex flex-col min-w-0 h-full">
                {/* Mobile header */}
                <div className="lg:hidden flex items-center p-4 border-b bg-background shrink-0">
                    <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-5 w-5" />
                    </Button>
                    <h1 className="ml-2 font-semibold">Chat</h1>
                </div>
                <ChatMain selectedChat={selectedChat} />
            </div>
        </div>
    )
}
