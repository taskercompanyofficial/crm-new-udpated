"use client";

import * as React from "react";
import {
  MessagesSquare,
  MoreVertical,
  Search,
  Send,
  Archive,
  Inbox,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AccountSwitcher } from "./account-switcher";
import { MailList } from "./mail-list";
import { Nav } from "./nav";
import { ChatRoom } from "../data";
import { useSelectedChat } from "../use-mail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

interface MailProps {
  accounts: {
    label: string;
    email: string;
    icon: React.ReactNode;
  }[];
  mails: ChatRoom[];
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function Mail({
  accounts,
  mails,
  defaultCollapsed = false,
  navCollapsedSize,
}: MailProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);
  const [selectedChat, setSelectedChat] = useSelectedChat();
  const [messageInput, setMessageInput] = React.useState("");
  const [isMobile, setIsMobile] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);

  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  React.useEffect(() => {
    if (selectedChat.chatRoomId && isMobile) {
      setIsSheetOpen(true);
    }
  }, [selectedChat.chatRoomId, isMobile]);

  const selectedRoom = mails.find(
    (item) => item.id === selectedChat.chatRoomId,
  );

  const links = [
    {
      title: "All Chats",
      icon: MessagesSquare,
      variant: "default" as const,
      label: "",
    },
    { title: "Open", icon: Inbox, variant: "ghost" as const, label: "" },
    { title: "Closed", icon: Archive, variant: "ghost" as const, label: "" },
    { title: "Trash", icon: Trash2, variant: "ghost" as const, label: "" },
  ];

  const ChatView = () => (
    <div className="flex h-full flex-col">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="font-semibold">
              Complaint ID: {selectedRoom?.complaint_id}
            </h2>
            <Badge
              variant={
                selectedRoom?.status === "open"
                  ? "default"
                  : "secondary"
              }
            >
              {selectedRoom?.status}
            </Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Close Chat</DropdownMenuItem>
              <DropdownMenuItem>Delete Chat</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">
          WhatsApp: {selectedRoom?.applicant_whatsapp}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {selectedRoom?.messages.map((message, i) => (
          <div
            key={i}
            className={cn(
              "mb-4 flex",
              message.sender_type === "user"
                ? "justify-end"
                : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-lg p-4",
                message.sender_type === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted",
              )}
            >
              <div className="text-sm">{message.message}</div>
              <div className="mt-1 text-xs opacity-70">
                {new Date(message.created_at).toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t p-4">
        <div className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="Type a message..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                setMessageInput("");
              }
            }}
          />
          <Button
            size="icon"
            onClick={() => {
              setMessageInput("");
            }}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="flex h-[calc(100vh-4rem)] min-h-[600px] flex-col overflow-hidden rounded-[0.5rem] border bg-background shadow-md md:h-[800px]">
        <div className="flex h-full">
          {!isMobile && (
            <div className="w-64 border-r">
              <div className="flex h-[52px] items-center justify-center px-2">
                <AccountSwitcher
                  isCollapsed={isCollapsed}
                  accounts={accounts}
                />
              </div>
              <Separator />
              <Nav links={links} />
            </div>
          )}

          <div className="flex-1">
            <Tabs defaultValue="all">
              <div className="flex items-center px-4 py-2">
                <h1 className="text-xl font-bold">Chats</h1>
                <TabsList className="ml-auto">
                  <TabsTrigger value="all">All chats</TabsTrigger>
                  <TabsTrigger value="open">Open</TabsTrigger>
                </TabsList>
              </div>
              <Separator />
              <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <form>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search" className="pl-8" />
                  </div>
                </form>
              </div>
              <TabsContent value="all" className="m-0">
                <MailList items={mails} />
              </TabsContent>
              <TabsContent value="open" className="m-0">
                <MailList
                  items={mails.filter((item) => item.status === "open")}
                />
              </TabsContent>
            </Tabs>
          </div>

          {!isMobile && selectedChat.chatRoomId && (
            <div className="w-[500px] border-l">
              {selectedChat.chatRoomId ? (
                <ChatView />
              ) : (
                <div className="p-8 text-center text-muted-foreground">
                  No chat selected
                </div>
              )}
            </div>
          )}
        </div>

        {isMobile && (
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent side="bottom" className="h-[90vh]">
              <SheetHeader>
                <SheetTitle>Chat</SheetTitle>
              </SheetHeader>
              {selectedChat.chatRoomId && <ChatView />}
            </SheetContent>
          </Sheet>
        )}
      </div>
    </TooltipProvider>
  );
}
