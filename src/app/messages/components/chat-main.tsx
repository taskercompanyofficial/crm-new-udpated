"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from "@/components/ui/context-menu"
import {
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Info,
  Check,
  CheckCheck,
  Mic,
  MicOff,
  ImageIcon,
  File,
  Play,
  Pause,
  Download,
  Reply,
  Forward,
  Trash2,
  Copy,
  Star,
  X,
  ArrowLeft,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useSession } from "next-auth/react"
import useFetch from "@/hooks/usefetch"
import { API_URL, MESSAGE_CHAT_ROOMS } from "@/lib/apiEndPoints"
import ChatInput from "@/app/crm/complaints/[slug]/chat/chat-input"

interface ChatMainProps {
  selectedChat: string
}

interface ApiMessage {
  id: number
  chat_room_id: number
  sender_type: string
  message: string
  media_url: string | null
  type: string
  created_at: string
  updated_at: string
}

interface Message {
  id: string
  sender: string
  content?: string
  timestamp: string
  isOwn: boolean
  status: "sent" | "delivered" | "read"
  type: "text" | "image" | "file" | "voice"
  fileUrl?: string
  fileName?: string
  fileSize?: string
  duration?: string
  isStarred: boolean
}

interface ChatData {
  data: {
    phone: string
    status: string
    messages: ApiMessage[]
  }
}

export function ChatMain({ selectedChat }: ChatMainProps): JSX.Element {
  const { data: session } = useSession()
  const token = session?.user?.token
  const [refresh, setRefresh] = useState(false);
  const { data: chatData } = useFetch<ChatData>(`${API_URL}${MESSAGE_CHAT_ROOMS}/${selectedChat}`, token, refresh)

  useEffect(() => {
    const interval = setInterval(() => {
      setRefresh(prev => !prev);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const [messages, setMessages] = useState<Message[]>([])
  const [isRecording, setIsRecording] = useState<boolean>(false)
  const [recordingTime, setRecordingTime] = useState<number>(0)
  const [playingVoice, setPlayingVoice] = useState<string | null>(null)
  const [selectedMessages, setSelectedMessages] = useState<Set<string>>(new Set())
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const recordingInterval = useRef<NodeJS.Timeout>()
  // Transform API messages to component format
  const transformApiMessage = (apiMsg: ApiMessage): Message => {
    return {
      id: apiMsg.id.toString(),
      sender: apiMsg.sender_type === "support" ? "Support" : "User",
      content: apiMsg.message,
      timestamp: new Date(apiMsg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: apiMsg.sender_type === "support", // Assuming support messages are "own" messages
      status: "read", // Default status
      type: apiMsg.type as "text" | "image" | "file" | "voice",
      fileUrl: apiMsg.media_url || undefined,
      fileName: apiMsg.media_url ? apiMsg.media_url.split('/').pop() : undefined,
      fileSize: undefined, // Not provided in API
      duration: undefined, // Not provided in API
      isStarred: false,
    }
  }

  useEffect(() => {
    if (chatData?.data?.messages) {
      const transformedMessages = chatData.data.messages.map(transformApiMessage)
      setMessages(transformedMessages)
    }
  }, [chatData])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (isRecording) {
      recordingInterval.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } else {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
      setRecordingTime(0)
    }

    return () => {
      if (recordingInterval.current) {
        clearInterval(recordingInterval.current)
      }
    }
  }, [isRecording])



  const stopRecording = (): void => {
    setIsRecording(false)

    if (recordingTime > 0) {
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: "Support",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: true,
        status: "sent",
        type: "voice",
        duration: `${Math.floor(recordingTime / 60)}:${(recordingTime % 60).toString().padStart(2, "0")}`,
        fileUrl: "#",
        isStarred: false,
      }

      setMessages((prev) => [...prev, newMessage])
    }
  }

  const toggleVoicePlay = (messageId: string): void => {
    if (playingVoice === messageId) {
      setPlayingVoice(null)
    } else {
      setPlayingVoice(messageId)
      setTimeout(() => setPlayingVoice(null), 3000)
    }
  }

  const formatRecordingTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleMessageSelect = (messageId: string): void => {
    const newSelected = new Set(selectedMessages)
    if (newSelected.has(messageId)) {
      newSelected.delete(messageId)
    } else {
      newSelected.add(messageId)
    }
    setSelectedMessages(newSelected)

    if (newSelected.size === 0) {
      setIsMultiSelectMode(false)
    }
  }

  const enterMultiSelectMode = (messageId: string): void => {
    setIsMultiSelectMode(true)
    setSelectedMessages(new Set([messageId]))
  }

  const exitMultiSelectMode = (): void => {
    setIsMultiSelectMode(false)
    setSelectedMessages(new Set())
  }

  const handleStarMessage = (messageId: string): void => {
    setMessages((prev) => prev.map((msg) => (msg.id === messageId ? { ...msg, isStarred: !msg.isStarred } : msg)))
  }

  const handleDeleteMessages = (): void => {
    setMessages((prev) => prev.filter((msg) => !selectedMessages.has(msg.id)))
    exitMultiSelectMode()
  }

  const handleReplyToMessage = (message: Message): void => {
    setReplyingTo(message)
  }

  const getStatusIcon = (status: string): JSX.Element | null => {
    switch (status) {
      case "sent":
        return <Check className="h-3 w-3" />
      case "delivered":
        return <CheckCheck className="h-3 w-3" />
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "open":
        return "bg-green-500"
      case "closed":
        return "bg-red-500"
      case "pending":
        return "bg-yellow-500"
      default:
        return "bg-gray-400"
    }
  }

  const getTypeColor = (type: string): string => {
    switch (type) {
      case "open":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      case "closed":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
    }
  }

  const renderMessage = (msg: Message): JSX.Element => {
    const isSelected = selectedMessages.has(msg.id)

    switch (msg.type) {
      case "image":
        return (
          <div
            className={`rounded-2xl overflow-hidden transition-all duration-200 ${msg.isOwn
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
          >
            <Dialog>
              <DialogTrigger asChild>
                <div className="cursor-pointer hover:opacity-90 transition-opacity">
                  <img
                    src={msg.fileUrl || "/placeholder.svg"}
                    alt={msg.fileName || "Image"}
                    className="max-w-[280px] max-h-[200px] object-cover w-full"
                  />
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95">
                <div className="relative">
                  <img
                    src={msg.fileUrl || "/placeholder.svg"}
                    alt={msg.fileName || "Image"}
                    className="w-full h-auto max-h-[80vh] object-contain"
                  />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-4 right-4 bg-black/50 hover:bg-black/70"
                    asChild
                  >
                    <a href={msg.fileUrl} download={msg.fileName}>
                      <Download className="h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            <div className="p-3">
              <div className={`flex items-center gap-1 ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                {msg.isStarred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                <span className="text-xs opacity-70">{msg.timestamp}</span>
                {msg.isOwn && getStatusIcon(msg.status)}
              </div>
            </div>
          </div>
        )

      case "voice":
        return (
          <div
            className={`rounded-2xl p-4 flex items-center gap-3 min-w-[220px] transition-all duration-200 ${msg.isOwn
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
          >
            <Button
              size="icon"
              variant={msg.isOwn ? "secondary" : "default"}
              className="h-10 w-10 rounded-full shadow-lg"
              onClick={() => toggleVoicePlay(msg.id)}
            >
              {playingVoice === msg.id ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-2 bg-current opacity-20 rounded-full">
                  <div className="h-full bg-current rounded-full w-1/3 transition-all duration-300"></div>
                </div>
                <span className="text-sm font-medium">{msg.duration}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {msg.isStarred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
              <span className="text-xs opacity-70">{msg.timestamp}</span>
              {msg.isOwn && getStatusIcon(msg.status)}
            </div>
          </div>
        )

      case "file":
        return (
          <div
            className={`rounded-2xl p-4 transition-all duration-200 ${msg.isOwn
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-xl ${msg.isOwn ? "bg-white/20" : "bg-blue-100 dark:bg-blue-900/30"}`}>
                <File className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{msg.fileName}</p>
                <p className="text-xs opacity-70">{msg.fileSize}</p>
              </div>
              <Button size="icon" variant={msg.isOwn ? "secondary" : "default"} className="h-10 w-10 rounded-full">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className={`flex items-center gap-1 mt-3 ${msg.isOwn ? "justify-end" : "justify-start"}`}>
              {msg.isStarred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
              <span className="text-xs opacity-70">{msg.timestamp}</span>
              {msg.isOwn && getStatusIcon(msg.status)}
            </div>
          </div>
        )

      default:
        return (
          <div
            className={`rounded-2xl p-4 max-w-[400px] transition-all duration-200 ${msg.isOwn
              ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
              : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
              } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
          >
            <p className="text-sm leading-relaxed">{msg.content}</p>
            <div className={`flex items-center gap-1 mt-2 ${msg.isOwn ? "justify-end" : "justify-start"}`}>
              {msg.isStarred && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
              <span className="text-xs opacity-70">{msg.timestamp}</span>
              {msg.isOwn && getStatusIcon(msg.status)}
            </div>
          </div>
        )
    }
  }

  if (!chatData?.data) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Send className="h-12 w-12 text-white" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select a conversation</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Choose a conversation from the sidebar to start chatting
          </p>
        </div>
      </div>
    )
  }

  const handleSendMessage = (message: string): void => {
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      sender: "support",
      content: message,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
      status: "sent",
      type: "text",
      isStarred: false,
    }])
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Multi-select toolbar */}
      {isMultiSelectMode && (
        <div className="flex items-center justify-between p-4 bg-blue-500 text-white">
          <div className="flex items-center gap-3">
            <Button size="icon" variant="ghost" onClick={exitMultiSelectMode} className="text-white hover:bg-white/20">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium">{selectedMessages.size} selected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <Forward className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" className="text-white hover:bg-white/20">
              <Star className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleDeleteMessages}
              className="text-white hover:bg-red-500/20"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Chat Header */}
      <div className="flex items-center justify-between p-4 border-b bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-12 w-12 ring-2 ring-blue-500/20">
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                {chatData.data.phone.slice(-4)}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${getStatusColor(chatData.data.status)}`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">{chatData.data.phone}</h3>
              <Badge variant="secondary" className={`text-xs ${getTypeColor(chatData.data.status)}`}>
                {chatData.data.status}
              </Badge>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{chatData.data.status}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <Phone className="h-4 w-4" />
          </Button>
          <Button size="icon" variant="ghost" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
            <Info className="h-4 w-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="hover:bg-blue-50 dark:hover:bg-blue-900/20">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>View Profile</DropdownMenuItem>
              <DropdownMenuItem>Mute Notifications</DropdownMenuItem>
              <DropdownMenuItem>Archive Chat</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">Block Contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="p-4 space-y-4">
            {messages.map((msg) => (
              <ContextMenu key={msg.id}>
                <ContextMenuTrigger>
                  <div className={`flex ${msg.isOwn ? "justify-end" : "justify-start"} group`}>
                    <div className={`flex gap-3 max-w-[70%] ${msg.isOwn ? "flex-row-reverse" : "flex-row"}`}>
                      {isMultiSelectMode && (
                        <div className="flex items-start pt-2">
                          <Checkbox
                            checked={selectedMessages.has(msg.id)}
                            onCheckedChange={() => handleMessageSelect(msg.id)}
                            className="mt-1"
                          />
                        </div>
                      )}
                      {!msg.isOwn && (
                        <Avatar className="h-8 w-8 mt-1 shrink-0">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {chatData.data.phone.slice(-4)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="min-w-0 relative mt-2">{renderMessage(msg)}</div>
                    </div>
                  </div>
                </ContextMenuTrigger>
                <ContextMenuContent>
                  <ContextMenuItem onClick={() => handleReplyToMessage(msg)}>
                    <Reply className="h-4 w-4 mr-2" />
                    Reply
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Forward className="h-4 w-4 mr-2" />
                    Forward
                  </ContextMenuItem>
                  <ContextMenuItem onClick={() => handleStarMessage(msg.id)}>
                    <Star className="h-4 w-4 mr-2" />
                    {msg.isStarred ? "Unstar" : "Star"}
                  </ContextMenuItem>
                  <ContextMenuItem>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </ContextMenuItem>
                  <ContextMenuSeparator />
                  <ContextMenuItem onClick={() => enterMultiSelectMode(msg.id)}>
                    <Check className="h-4 w-4 mr-2" />
                    Select
                  </ContextMenuItem>
                  <ContextMenuItem className="text-destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
      </div>

      {/* Reply Preview */}
      {replyingTo && (
        <div className="px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Replying to {replyingTo.sender}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                {replyingTo.content || `${replyingTo.type} message`}
              </p>
            </div>
            <Button size="icon" variant="ghost" onClick={() => setReplyingTo(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Recording Indicator */}
      {isRecording && (
        <div className="mx-4 mb-4 p-4 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
            <span className="font-medium">Recording... {formatRecordingTime(recordingTime)}</span>
          </div>
          <Button variant="secondary" size="sm" onClick={stopRecording} className="bg-white/20 hover:bg-white/30">
            <MicOff className="h-4 w-4 mr-2" />
            Stop
          </Button>
        </div>
      )}

      {/* Message Input */}
      <ChatInput
        chatRoomId={parseInt(selectedChat)}
        onSendMessage={handleSendMessage}
      />
    </div>
  )
}
