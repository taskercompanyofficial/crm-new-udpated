"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Search, Plus, MoreVertical, X, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ChatSidebarProps {
  selectedChat: string
  onSelectChat: (chatId: string) => void
  onClose: () => void
  data: {
    data: {
      id: number
      phone: string
      status: string
      created_at: string
      updated_at: string
      messages_count: number
    }[]
  }
}

export function ChatSidebar({ selectedChat, onSelectChat, onClose, data }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filter, setFilter] = useState<string>("all")

  const filteredConversations = data?.data?.filter((conv) => {
    const matchesSearch = conv.phone.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === "all" || filter === conv.status
    return matchesSearch && matchesFilter
  }) || []

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Messages
          </h2>
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              className="hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem>New Chat</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 rounded-full border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 transition-colors"
            />
          </div>

          <div className="flex gap-2">
            {["all", "open", "closed"].map((type) => (
              <Button
                key={type}
                size="sm"
                variant={filter === type ? "default" : "outline"}
                onClick={() => setFilter(type)}
                className="text-xs capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <ScrollArea className="flex-1 p-4">
        <div className="p-2">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No conversations found
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`
                  flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200
                  hover:bg-gray-50 dark:hover:bg-gray-800 group
                  ${selectedChat === conversation.id.toString() ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-700" : ""}
                `}
                onClick={() => {
                  onSelectChat(conversation.id.toString())
                  onClose()
                }}
              >
                <div className="relative">
                  <Avatar className="h-12 w-12 ring-2 ring-transparent group-hover:ring-blue-200 transition-all">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                      {conversation.phone.slice(-4)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-900 ${conversation.status === 'open' ? 'bg-green-500' : 'bg-gray-400'}`}
                  />
                </div>

                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <h3 className="font-semibold text-sm truncate text-gray-900 dark:text-gray-100 flex-1">
                        {conversation.phone}
                      </h3>
                      <Badge variant="secondary" className={`text-xs flex-shrink-0 ${conversation.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {conversation.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate flex-1 mr-2">
                      {new Date(conversation.updated_at).toLocaleDateString()}
                    </p>
                    {conversation.messages_count > 0 && (
                      <Badge
                        variant="destructive"
                        className="h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-gradient-to-r from-red-500 to-pink-500 flex-shrink-0"
                      >
                        {conversation.messages_count}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  )
}
