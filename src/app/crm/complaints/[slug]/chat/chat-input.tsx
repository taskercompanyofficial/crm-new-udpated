'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Paperclip, Send, Mic, X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import axios from 'axios'
import { API_URL, MESSAGE_CHAT_MESSAGES } from '@/lib/apiEndPoints'
import { useSession } from 'next-auth/react'
import { revalidate } from '@/actions/revalidate'

export default function ChatInput({ chatRoomId, onSendMessage }: { chatRoomId: number, onSendMessage: (message: string) => void }) {
    const { data: session } = useSession();
    const [message, setMessage] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [mediaFile, setMediaFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaPreviewRef = useRef<HTMLDivElement>(null);
    const [isTyping, setIsTyping] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const recordingInterval = useRef<NodeJS.Timeout>();

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = message.trim();
        if (!trimmed && !mediaFile) return;

        setIsTyping(true);

        try {
            const formData = new FormData();
            formData.append('chat_room_id', chatRoomId.toString());
            formData.append('sender_type', 'support');

            if (mediaFile) {
                formData.append('media', mediaFile);
                formData.append('type', mediaFile.type.startsWith('image/') ? 'image' :
                    mediaFile.type.startsWith('audio/') ? 'audio' :
                        mediaFile.type.startsWith('video/') ? 'video' : 'file');
            }

            if (trimmed) {
                formData.append('message', trimmed);
                formData.append('type', mediaFile ? 'mixed' : 'text');
            }

            await axios.post(API_URL + MESSAGE_CHAT_MESSAGES, formData, {
                headers: {
                    'Authorization': `Bearer ${session?.user?.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            revalidate({ path: `/crm/complaints/${chatRoomId}` })
            setMessage('');
            setMediaFile(null);
            onSendMessage(trimmed);
        } catch (error) {
            console.error("Message send failed", error);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setMediaFile(file);
        }
    };

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            const audioChunks: BlobPart[] = [];

            mediaRecorder.ondataavailable = (e) => {
                audioChunks.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                const audioFile = new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' });
                setMediaFile(audioFile);
            };

            mediaRecorder.start();
            setIsRecording(true);

            recordingInterval.current = setInterval(() => {
                setRecordingTime((prev) => prev + 1);
            }, 1000);

            // Stop recording after 1 minute
            setTimeout(() => {
                if (mediaRecorder.state === 'recording') {
                    mediaRecorder.stop();
                    stream.getTracks().forEach(track => track.stop());
                    stopRecording();
                }
            }, 60000);
        } catch (error) {
            console.error("Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        setIsRecording(false);
        if (recordingInterval.current) {
            clearInterval(recordingInterval.current);
        }
        setRecordingTime(0);
    };

    const formatRecordingTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="p-4 border-t bg-background/95 backdrop-blur-sm">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                accept="image/*,video/*,audio/*,application/*"
                className="hidden"
            />

            {mediaFile && (
                <div ref={mediaPreviewRef} className="mb-2 p-2 bg-muted rounded-md flex items-center justify-between">
                    <span className="text-sm truncate">{mediaFile.name}</span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setMediaFile(null)}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            )}

            <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="flex-shrink-0 h-10 w-10"
                    onClick={() => fileInputRef.current?.click()}
                >
                    <Paperclip className="h-4 w-4" />
                </Button>

                <Button
                    type="button"
                    variant={isRecording ? "destructive" : "ghost"}
                    size="icon"
                    className="flex-shrink-0 h-10 w-10"
                    onClick={isRecording ? stopRecording : startRecording}
                >
                    <Mic className="h-4 w-4" />
                    {isRecording && <span className="absolute -top-6 text-xs">{formatRecordingTime(recordingTime)}</span>}
                </Button>

                <div className="flex-1 relative">
                    <Input
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type your message..."
                        className="pr-12 h-10 bg-muted/50 border-muted-foreground/20 focus:bg-background"
                        maxLength={1000}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                        {message.length}/1000
                    </div>
                </div>

                <Button
                    type="submit"
                    disabled={(!message.trim() && !mediaFile) || isTyping}
                    size="icon"
                    className="flex-shrink-0 h-10 w-10 transition-all duration-200"
                >
                    <Send className="h-4 w-4" />
                </Button>
            </form>
        </div>
    )
}
