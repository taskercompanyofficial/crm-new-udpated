import { format } from "date-fns"
import { Send, MoreVertical } from "lucide-react"
import { ChatRoom, Message } from "../data"
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ChatDisplayProps {
  chatRoom: ChatRoom | null;
  onSendMessage?: (message: string) => void;
}

export function ChatDisplay({ chatRoom }: ChatDisplayProps) {
  if (!chatRoom) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No chat selected
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center p-2">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold">Complaint ID: {chatRoom.complaint_id}</h3>
          <Badge variant={chatRoom.status === 'open' ? 'default' : 'secondary'}>
            {chatRoom.status}
          </Badge>
        </div>
        <div className="ml-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Close Chat</DropdownMenuItem>
              <DropdownMenuItem>Export Chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Separator />
      
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {chatRoom.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex gap-3 max-w-[80%]",
                message.sender_type === "user" ? "ml-auto" : "mr-auto"
              )}
            >
              <div
                className={cn(
                  "rounded-lg p-4",
                  message.sender_type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                )}
              >
                <p className="text-sm">{message.message}</p>
                <span className="text-xs opacity-70">
                  {format(new Date(message.created_at), "p")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <Separator className="mt-auto" />
      <div className="p-4">
        <form onSubmit={(e) => {
          e.preventDefault()
          // Handle message submit
        }}>
          <div className="flex gap-2">
            <Textarea
              placeholder="Type your message..."
              className="flex-1"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
