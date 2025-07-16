import React from 'react'
import ChatArea from './chat-area';
import { fetchData } from '@/hooks/fetchData';
import { API_URL, MESSAGE_CHAT_ROOMS } from '@/lib/apiEndPoints';

interface ChatPageProps {
    params: {
        slug: Promise<string>;
    }
}
export default async function page({ params }: ChatPageProps) {
    const slug = await params.slug;
    const endPoint = `${API_URL}${MESSAGE_CHAT_ROOMS}/${slug}`;
    const response = await fetchData({ endPoint });
    return (
        <ChatArea messages={response?.data?.data?.messages || []} slug={slug} />
    )
}
