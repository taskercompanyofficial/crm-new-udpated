"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
    Send,
    Paperclip,
    ArrowLeft,
    Phone,
    Video,
    MoreVertical,
    MessageCircle,
    Clock,
    Check,
    CheckCheck,
    Heart,
    ThumbsUp,
    Smile,
    Download,
    ExternalLink,
    Maximize2,
    X,
    Share2,
    Copy,
    Reply,
    Forward
} from "lucide-react";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils";
import { cn } from "@/lib/utils";
import ChatInput from "./chat-input";

interface Message {
    id: number;
    chat_room_id: number;
    sender_type: 'customer' | 'support' | 'bot';
    message: string | null;
    media_url: string | null;
    type: 'text' | 'image' | 'audio' | 'video';
    created_at: string;
    updated_at: string;
    reactions?: { [key: string]: number };
    userReaction?: string;
}

interface ChatAreaProps {
    messages?: Message[];
    slug: string;
}

interface MediaModalProps {
    isOpen: boolean;
    onClose: () => void;
    media: {
        url: string;
        type: 'image' | 'video';
        message?: Message;
    } | null;
    onReact: (messageId: number, reaction: string) => void;
}

const reactions = [
    { emoji: '❤️', name: 'heart', icon: Heart },
    { emoji: '👍', name: 'thumbs_up', icon: ThumbsUp },
    { emoji: '😂', name: 'laugh', icon: Smile },
    { emoji: '😮', name: 'wow', icon: Smile },
    { emoji: '😢', name: 'sad', icon: Smile },
    { emoji: '😡', name: 'angry', icon: Smile },
];

function MediaModal({ isOpen, onClose, media, onReact }: MediaModalProps) {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedText, setSelectedText] = useState('');

    const handleDownload = async () => {
        if (!media) return;

        try {
            const response = await fetch(media.url);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `media_${Date.now()}.${media.type === 'image' ? 'jpg' : 'mp4'}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleOpenInNewWindow = () => {
        if (!media) return;
        window.open(media.url, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
    };

    const handleShare = async () => {
        if (!media) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'Shared Media',
                    url: media.url
                });
            } catch (error) {
                console.error('Share failed:', error);
            }
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(media.url);
        }
    };

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection) {
            setSelectedText(selection.toString());
        }
    };

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            return () => document.removeEventListener('keydown', handleKeyDown);
        }
    }, [isOpen, onClose]);

    if (!media) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className={cn(
                "max-w-4xl w-full h-[90vh] p-0 bg-black/95 border-0",
                isFullscreen && "max-w-none w-screen h-screen"
            )}>
                <DialogHeader className="p-4 bg-background/10 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-white">
                            {media.type === 'image' ? 'Image Viewer' : 'Video Player'}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleDownload}
                                className="text-white hover:bg-white/10"
                            >
                                <Download className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleShare}
                                className="text-white hover:bg-white/10"
                            >
                                <Share2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={handleOpenInNewWindow}
                                className="text-white hover:bg-white/10"
                            >
                                <ExternalLink className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="text-white hover:bg-white/10"
                            >
                                <Maximize2 className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={onClose}
                                className="text-white hover:bg-white/10"
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 flex items-center justify-center p-4">
                    {media.type === 'image' ? (
                        <img
                            src={media.url}
                            alt="Media viewer"
                            className="max-w-full max-h-full object-contain select-none"
                            onMouseUp={handleTextSelection}
                            draggable={false}
                        />
                    ) : (
                        <video
                            src={media.url}
                            controls
                            className="max-w-full max-h-full object-contain"
                            autoPlay
                        />
                    )}
                </div>

                {media.message && (
                    <div className="p-4 bg-background/10 backdrop-blur-sm">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <Avatar className="w-8 h-8">
                                    <AvatarFallback className="text-xs">
                                        {media.message.sender_type === 'support' ? 'S' : 'C'}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-white/80">
                                    {media.message.sender_type === 'support' ? 'Support' : 'Customer'}
                                </span>
                                <span className="text-xs text-white/60">
                                    {new Date(media.message.created_at).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:bg-white/10">
                                    <Reply className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:bg-white/10">
                                    <Forward className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-white/80 hover:bg-white/10">
                                    <Copy className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {media.message.message && (
                            <p className="text-sm text-white/90 mb-3 select-text">
                                {media.message.message}
                            </p>
                        )}

                        <div className="flex items-center gap-2">
                            <span className="text-sm text-white/60">Quick reactions:</span>
                            <div className="flex gap-1">
                                {reactions.map((reaction) => (
                                    <Button
                                        key={reaction.name}
                                        variant="ghost"
                                        size="sm"
                                        className={cn(
                                            "h-8 px-2 hover:bg-white/10 transition-all",
                                            media.message?.userReaction === reaction.name && "bg-white/20"
                                        )}
                                        onClick={() => onReact(media.message!.id, reaction.name)}
                                    >
                                        <span className="text-base">{reaction.emoji}</span>
                                        {media.message?.reactions?.[reaction.name] && (
                                            <span className="ml-1 text-xs text-white/80">
                                                {media.message.reactions[reaction.name]}
                                            </span>
                                        )}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default function ChatArea({ messages = [], slug }: ChatAreaProps) {
    const [message, setMessage] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState<Set<number>>(new Set());
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [mediaModal, setMediaModal] = useState<{
        isOpen: boolean;
        media: { url: string; type: 'image' | 'video'; message?: Message } | null;
    }>({ isOpen: false, media: null });

    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Scroll to bottom whenever messages change
    useEffect(() => {
        if (scrollRef.current) {
            const scrollElement = scrollRef.current;
            requestAnimationFrame(() => {
                scrollElement.scrollTo({
                    top: scrollElement.scrollHeight,
                    behavior: 'smooth'
                });
            });
        }
    }, [messages]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    const handleSendMessage = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsTyping(true);

        try {
            const response = await fetch(`/crm/complaints/${slug}/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message,
                    type: 'text'
                })
            });

            if (!response.ok) {
                throw new Error('Failed to send message');
            }

            setMessage("");

            if (inputRef.current) {
                inputRef.current.focus();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsTyping(false);
        }
    }, [message, slug]);

    const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e as any);
        }
    }, [handleSendMessage]);

    const handleReaction = useCallback(async (messageId: number, reaction: string) => {
        try {
            const response = await fetch(`/crm/complaints/${slug}/chat/${messageId}/react`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reaction })
            });

            if (!response.ok) {
                throw new Error('Failed to add reaction');
            }
        } catch (error) {
            console.error('Error adding reaction:', error);
        }
    }, [slug]);

    const handleMessageSelect = useCallback((messageId: number) => {
        if (!isSelectionMode) {
            setIsSelectionMode(true);
            setSelectedMessages(new Set([messageId]));
        } else {
            const newSelected = new Set(selectedMessages);
            if (newSelected.has(messageId)) {
                newSelected.delete(messageId);
            } else {
                newSelected.add(messageId);
            }
            setSelectedMessages(newSelected);

            if (newSelected.size === 0) {
                setIsSelectionMode(false);
            }
        }
    }, [isSelectionMode, selectedMessages]);

    const handleMediaClick = useCallback((media_url: string, type: 'image' | 'video', message?: Message) => {
        setMediaModal({
            isOpen: true,
            media: { url: getImageUrl(media_url), type, message }
        });
    }, []);

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const isToday = date.toDateString() === now.toDateString();

        if (isToday) {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const renderMessage = useCallback((msg: Message, index: number) => {
        const isOwnMessage = msg.sender_type === 'support';
        const isSelected = selectedMessages.has(msg.id);

        const renderContent = () => {
            switch (msg.type) {
                case 'image':
                    return (
                        <div className="relative group cursor-pointer">
                            <img
                                src={getImageUrl(msg.media_url!)}
                                alt="Message attachment"
                                className="max-w-full max-h-64 rounded-lg object-cover shadow-sm transition-all duration-200 group-hover:scale-[1.02]"
                                onClick={() => handleMediaClick(msg.media_url!, 'image', msg)}
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/50 rounded-full p-2">
                                        <Maximize2 className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 'video':
                    return (
                        <div className="relative group cursor-pointer">
                            <video
                                className="max-w-full max-h-64 rounded-lg shadow-sm transition-all duration-200 group-hover:scale-[1.02]"
                                poster={getImageUrl(msg.media_url!)}
                                onClick={() => handleMediaClick(msg.media_url!, 'video', msg)}
                            >
                                <source src={getImageUrl(msg.media_url!)} />
                            </video>
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="bg-black/50 rounded-full p-3">
                                        <Video className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                case 'audio':
                    return (
                        <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg min-w-[200px]">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                                <span className="text-xs">🎵</span>
                            </div>
                            <audio controls className="flex-1">
                                <source src={getImageUrl(msg.media_url!)} type="audio/mpeg" />
                                Your browser does not support audio playback.
                            </audio>
                        </div>
                    );
                default:
                    return (
                        <div className="space-y-2">
                            <p className="text-sm whitespace-pre-wrap break-words leading-relaxed select-text">
                                {msg.message}
                            </p>
                            {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                                <div className="flex gap-1 flex-wrap">
                                    {Object.entries(msg.reactions).map(([reaction, count]) => {
                                        const reactionData = reactions.find(r => r.name === reaction);
                                        if (!reactionData || count === 0) return null;

                                        return (
                                            <Button
                                                key={reaction}
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    "h-6 px-2 py-1 text-xs hover:bg-muted/50 transition-all",
                                                    msg.userReaction === reaction && "bg-primary/10 text-primary"
                                                )}
                                                onClick={() => handleReaction(msg.id, reaction)}
                                            >
                                                <span className="text-xs">{reactionData.emoji}</span>
                                                <span className="ml-1">{count}</span>
                                            </Button>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
            }
        };

        return (
            <div
                key={msg.id}
                className={cn(
                    "flex items-end gap-3 mb-4 animate-in fade-in-0 slide-in-from-bottom-2 group",
                    isOwnMessage ? "justify-end" : "justify-start",
                    isSelected && "bg-primary/5 -mx-4 px-4 py-2 rounded-lg"
                )}
            >
                {!isOwnMessage && (
                    <Avatar className="w-8 h-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                            C
                        </AvatarFallback>
                    </Avatar>
                )}

                <div className={cn(
                    "relative max-w-[70%] md:max-w-[60%]",
                    isOwnMessage ? "order-1" : "order-2"
                )}>
                    <div
                        className={cn(
                            "px-4 py-3 rounded-2xl shadow-sm transition-all duration-200 cursor-pointer",
                            isOwnMessage
                                ? "bg-primary text-primary-foreground rounded-br-md"
                                : "bg-muted/80 text-foreground rounded-bl-md border border-border/50",
                            isSelected && "ring-2 ring-primary"
                        )}
                        onClick={(e) => {
                            if (e.detail === 2) { // Double click
                                handleMessageSelect(msg.id);
                            }
                        }}
                    >
                        {renderContent()}
                    </div>

                    <div className={cn(
                        "flex items-center gap-2 mt-1 text-xs text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity",
                        isOwnMessage ? "justify-end" : "justify-start"
                    )}>
                        <Clock className="w-3 h-3" />
                        <span>{formatTime(msg.created_at)}</span>
                        {isOwnMessage && (
                            <CheckCheck className="w-3 h-3 text-primary/60" />
                        )}

                        {/* Quick reaction buttons */}
                        {msg.type === 'text' && (
                            <div className="flex gap-1 ml-2">
                                {reactions.slice(0, 3).map((reaction) => (
                                    <Button
                                        key={reaction.name}
                                        variant="ghost"
                                        size="sm"
                                        className="h-6 w-6 p-0 hover:bg-muted/50"
                                        onClick={() => handleReaction(msg.id, reaction.name)}
                                    >
                                        <span className="text-xs">{reaction.emoji}</span>
                                    </Button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {isOwnMessage && (
                    <Avatar className="w-8 h-8 flex-shrink-0 order-2">
                        <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            S
                        </AvatarFallback>
                    </Avatar>
                )}
            </div>
        );
    }, [selectedMessages, handleReaction, handleMediaClick, handleMessageSelect]);

    return (
        <>
            <Card className="h-[calc(100vh-8rem)] flex flex-col shadow-lg border-0 bg-background">
                {/* Header */}
                <CardHeader className="p-4 border-b bg-background/95 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/crm/complaints/${slug}`}>
                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                            </Link>

                            <div className="flex items-center gap-3">
                                <Avatar className="w-10 h-10">
                                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                                        CS
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="text-lg font-semibold">Chat Support</h2>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Badge variant="secondary" className="flex items-center gap-1 px-2 py-0.5">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                            Active Now
                                        </Badge>
                                        <Separator orientation="vertical" className="h-4" />
                                        <span>Case #{slug}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-1">
                            {isSelectionMode && (
                                <div className="flex items-center gap-2 mr-2">
                                    <span className="text-sm text-muted-foreground">
                                        {selectedMessages.size} selected
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            setSelectedMessages(new Set());
                                            setIsSelectionMode(false);
                                        }}
                                    >
                                        Clear
                                    </Button>
                                </div>
                            )}
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Phone className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <Video className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </CardHeader>

                {/* Messages */}
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full px-4 py-4" ref={scrollRef}>
                        {messages.length > 0 ? (
                            <div className="space-y-1">
                                {messages.map(renderMessage)}
                                {isTyping && (
                                    <div className="flex items-center gap-3 mb-4">
                                        <Avatar className="w-8 h-8">
                                            <AvatarFallback className="text-xs bg-orange-100 text-orange-700">
                                                C
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="bg-muted/80 px-4 py-3 rounded-2xl rounded-bl-md">
                                            <div className="flex gap-1">
                                                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" />
                                                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                                                <div className="w-2 h-2 bg-muted-foreground/40 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
                                <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                                    <MessageCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-medium mb-2 text-foreground">No messages yet</h3>
                                <p className="text-sm text-center max-w-sm">
                                    Start the conversation. We typically reply within a few minutes.
                                </p>
                            </div>
                        )}
                    </ScrollArea>
                </CardContent>
                <ChatInput chatRoomId={slug as unknown as number} />
            </Card>

            {/* Media Modal */}
            <MediaModal
                isOpen={mediaModal.isOpen}
                onClose={() => setMediaModal({ isOpen: false, media: null })}
                media={mediaModal.media}
                onReact={handleReaction}
            />
        </>
    );
}