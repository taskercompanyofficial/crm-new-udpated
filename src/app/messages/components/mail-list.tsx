import { ComponentProps } from "react";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, Pin, Archive, Trash2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChatRoom } from "../data";
import { useSelectedChat } from "../use-mail";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { Button } from "@/components/ui/button";

interface MailListProps {
  items: ChatRoom[];
}

export function MailList({ items }: MailListProps) {
  const [selectedChat, setSelectedChat] = useSelectedChat();

  return (
    <ScrollArea className="h-[calc(100vh-10rem)]">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {items.map((item) => {
          const lastMessage = item.messages[item.messages.length - 1];
          return (
            <ContextMenu key={item.id}>
              <ContextMenuTrigger>
                <button
                  className={cn(
                    "flex w-full flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
                    selectedChat.chatRoomId === item.id && "bg-muted",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                  )}
                  onClick={() =>
                    setSelectedChat({
                      chatRoomId: item.id,
                      messageId: null,
                    })
                  }
                >
                  <div className="flex w-full flex-col gap-1">
                    <div className="flex items-center">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">
                          Complaint ID: {item.complaint_id}
                        </div>
                        {item.status === "open" && (
                          <span className="flex h-2 w-2 animate-pulse rounded-full bg-blue-600" />
                        )}
                      </div>
                      <div
                        className={cn(
                          "ml-auto flex items-center gap-2 text-xs",
                          selectedChat.chatRoomId === item.id
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {formatDistanceToNow(new Date(item.created_at), {
                          addSuffix: true,
                        })}
                      </div>
                    </div>
                    <div className="text-xs font-medium">
                      WhatsApp: {item.applicant_whatsapp}
                    </div>
                  </div>
                  {lastMessage && (
                    <div className="line-clamp-2 text-xs text-muted-foreground group-hover:text-foreground">
                      <span className="font-medium">
                        {lastMessage.sender_type === "user"
                          ? "You: "
                          : "Customer: "}
                      </span>
                      {lastMessage.message}
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={item.status === "open" ? "default" : "secondary"}
                      className="transition-colors"
                    >
                      {item.status}
                    </Badge>
                    {item.messages.some((m) => m.message_status === "unread") && (
                      <Badge variant="destructive">New</Badge>
                    )}
                  </div>
                </button>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-64">
                <ContextMenuItem onClick={() => console.log("Mark as read")}>
                  Mark as Read
                </ContextMenuItem>
                <ContextMenuItem onClick={() => console.log("Pin chat")}>
                  <Pin className="mr-2 h-4 w-4" /> Pin Chat
                </ContextMenuItem>
                <ContextMenuSeparator />
                <ContextMenuItem onClick={() => console.log("Archive")}>
                  <Archive className="mr-2 h-4 w-4" /> Archive Chat
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => console.log("Delete")}
                  className="text-red-600 focus:text-red-600"
                >
                  <Trash2 className="mr-2 h-4 w-4" /> Delete Chat
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          );
        })}
      </div>
    </ScrollArea>
  );
}
