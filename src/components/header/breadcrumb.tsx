"use client";

import React from 'react'
import { SidebarTrigger } from '../ui/sidebar'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
  } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { usePathname } from 'next/navigation';

export default function BreadcrumbComponent() {
    const pathname = usePathname();
    const pathSegments = pathname.split('/').filter(Boolean);
    
    // Convert segment text to proper case
    const formatSegment = (segment: string) => {
        return segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase();
    };
    
    return (
        <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    {pathSegments.map((segment, index) => (
                        <React.Fragment key={index}>
                            <BreadcrumbSeparator className="hidden md:block" />
                            <BreadcrumbItem>
                                {index === pathSegments.length - 1 ? (
                                    <BreadcrumbPage>{formatSegment(segment)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink href={`/${pathSegments.slice(0, index + 1).join('/')}`}>
                                        {formatSegment(segment)}
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}
