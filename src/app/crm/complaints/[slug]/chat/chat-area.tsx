"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, Paperclip, ArrowLeft, Phone, Video, MoreVertical, MessageSquare } from "lucide-react";
import Link from "next/link";

interface Message {
    id: number;
    content: string;
    sender: {
        id: number;
        name: string;
        avatar?: string;
    };
    timestamp: string;
}

interface ChatAreaProps {
    messages?: Message[];
    slug: string;
}

export default function ChatArea({ messages = [], slug }: ChatAreaProps) {
    const [message, setMessage] = React.useState("");
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    // Focus input on mount
    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSendMessage = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        // Handle sending message
        // TODO: Implement actual message sending logic

        setMessage("");

        // Refocus input after sending
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [message]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
    }, [handleSendMessage]);

    const renderMessage = useCallback((msg: Message) => {
        const isOwnMessage = msg.sender.id === 1;
        return (
            <div
                key={msg.id}
                className={`flex animate-fade-in ${isOwnMessage ? "justify-end" : "justify-start"} mb-4`}
            >
                {!isOwnMessage && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 mr-2 overflow-hidden">
                        {msg.sender.avatar ? (
                            <img src={msg.sender.avatar} alt={msg.sender.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                                {msg.sender.name[0]}
                            </div>
                        )}
                    </div>
                )}
                <div
                    className={`max-w-[70%] rounded-2xl p-4 shadow-md ${isOwnMessage
                        ? "bg-primary text-white rounded-tr-none"
                        : "bg-gray-100 text-gray-900 hover:bg-gray-200 rounded-tl-none"
                        }`}
                >
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold">{msg.sender.name}</span>
                        <time className="text-[10px] opacity-70">{msg.timestamp}</time>
                    </div>
                    <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">{msg.content}</p>
                </div>
                {isOwnMessage && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 ml-2 overflow-hidden">
                        {msg.sender.avatar ? (
                            <img src={msg.sender.avatar} alt={msg.sender.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-500 text-sm font-medium">
                                {msg.sender.name[0]}
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }, []);

    return (
        <Card className="flex flex-col h-[calc(100vh-8rem)] bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/75">
            <div className="p-4 border-b bg-white/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" asChild className="mr-2">
                            <Link href={`/crm/complaints/${slug}`}>
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Chat Support</h2>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1">
                                    <span className="h-2 w-2 rounded-full bg-green-500"></span>
                                    Connected with support
                                </span>
                                <span className="text-gray-300">•</span>
                                <span>Complaint #{slug}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon">
                            <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </div>

            <ScrollArea className="flex-1 px-6 py-4" ref={scrollRef}>
                {messages.length > 0 ? (
                    <div className="space-y-2">
                        {messages.map(renderMessage)}
                    </div>
                ) : (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500">
                        <MessageSquare className="h-16 w-16 mb-4 opacity-20" />
                        <h3 className="text-lg font-medium mb-2">No messages yet</h3>
                        <p className="text-sm text-center max-w-sm">
                            Start the conversation by sending a message. Our support team will respond as soon as possible.
                        </p>
                    </div>
                )}
            </ScrollArea>

            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white/50">
                <div className="flex items-center gap-3">
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <Paperclip className="h-5 w-5" />
                        <span className="sr-only">Attach file</span>
                    </Button>
                    <Input
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="flex-1 focus-visible:ring-primary rounded-full py-6 px-4 bg-gray-100"
                        maxLength={1000}
                    />
                    <Button
                        type="submit"
                        size="icon"
                        disabled={!message.trim()}
                        className="rounded-full h-12 w-12 transition-transform active:scale-95"
                    >
                        <Send className="h-5 w-5" />
                        <span className="sr-only">Send message</span>
                    </Button>
                </div>
            </form>
        </Card>
    );
}
