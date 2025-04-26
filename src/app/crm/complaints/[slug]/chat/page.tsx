import React from 'react'
import ChatArea from './chat-area';

interface ChatPageProps {
    params: {
        slug: Promise<string>;
    }
}
export default async function page({ params }: ChatPageProps) {
    const slug = await params.slug;
    const messages = [
        {
            id: 1,
            content: "Hello, how are you?",
            sender: {
                id: 1,
                name: "John Doe",
                avatar: "https://via.placeholder.com/150"
            },
            timestamp: "2023-01-01 12:00:00"
        },
        {
            id: 2,
            content: "I'm fine, thank you!",
            sender: {
                id: 2,
                name: "Jane Smith",
                avatar: "https://via.placeholder.com/150"
            },
            timestamp: "2023-01-01 12:01:00"
        },
        {
            id: 3,
            content: "What's your name?",
            sender: {
                id: 1,
                name: "John Doe",
                avatar: "https://via.placeholder.com/150"
            },
            timestamp: "2023-01-01 12:02:00"
        },
        {
            id: 4,
            content: "I'm John Doe",
            sender: {
                id: 2,
                name: "Jane Smith",
                avatar: "https://via.placeholder.com/150"
            },
            timestamp: "2023-01-01 12:03:00"
        },
        {
            id: 5,
            content: "Hello, how are you?",
            sender: {
                id: 1,
                name: "John Doe",
                avatar: "https://via.placeholder.com/150"
            },
            timestamp: "2023-01-01 12:04:00"
        },
        {
            id: 6,
            content: "I'm fine, thank you!",
            sender: {
                id: 2,
                name: "Jane Smith",
                avatar: "https://via.placeholder.com/150"
            },
            timestamp: "2023-01-01 12:05:00"
        },
        {
            id: 7,
            content: "Hello, how are you?",
            sender: {
                id: 1,
                name: "John Doe",
                avatar: "https://via.placeholder.com/150"
            },
            timestamp: "2023-01-01 12:06:00"
        },
        {
            id: 8,
            content: "I'm fine, thank you!",
            sender: {
                id: 2,
                name: "Jane Smith",
                avatar: "https://via.placeholder.com/150"
            },
            timestamp: "2023-01-01 12:07:00"
        }

    ]
    return (
        <ChatArea messages={messages || []} slug={slug} />
    )
}
