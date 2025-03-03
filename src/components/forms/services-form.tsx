"use client";
import React, { FormEventHandler, useState } from "react";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { toast } from "react-toastify";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import useForm from "@/hooks/use-form";
import { API_URL, SERVICES } from "@/lib/apiEndPoints";
import SubmitBtn from "@/components/custom/submit-button";
import { useSession } from "next-auth/react";
import { revalidate } from "@/actions/revalidate";
import * as LucideIcons from 'lucide-react';

export default function ServicesForm({ row }: { row?: any }) {
    const session = useSession();
    const token = session.data?.user?.token || "";
    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: row?.name || "",
        status: row?.status || "",
        description: row?.description || "",
        icon: row?.icon || "",
        color: row?.color || "#000000",
    });

    const [search, setSearch] = useState(row?.icon || "");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 50;

    const filteredIcons = Object.entries(LucideIcons).filter(([name]) =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredIcons.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedIcons = filteredIcons.slice(startIndex, startIndex + itemsPerPage);

    const endPoint = row ? API_URL + SERVICES + `/${row.id}` : API_URL + SERVICES;
    const method = row ? put : post;

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        method(
            endPoint,
            {
                onSuccess: (response) => {
                    toast.success(response.message);
                    revalidate({ path: "/" });
                    if (!row) {
                        reset();
                    }
                },
                onError: (error) => {
                    toast.error(error.message);
                },
            },
            token,
        );
    };

    return (
        <form className="w-full max-h-[80vh] overflow-y-auto px-4 py-6" onSubmit={submit}>
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-4">
                    <LabelInputContainer
                        label="Service Name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        required
                        placeholder="Enter service name"
                        errorMessage={errors.name}
                    />

                    <div>
                        <Label>Service Description</Label>
                        <textarea
                            value={data.description}
                            onChange={(e) => setData("description", e.target.value)}
                            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="Enter service description"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label>Service Color</Label>
                            <input
                                type="color"
                                value={data.color}
                                onChange={(e) => setData("color", e.target.value)}
                                className="w-full h-10 p-1 border rounded cursor-pointer"
                            />
                        </div>

                        <div>
                            <Label>Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(status) => setData({ ...data, status })}
                            >
                                <SelectTrigger className="h-10">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent side="top">
                                    {["active", "inactive"].map((statusOption) => (
                                        <SelectItem key={statusOption} value={statusOption}>
                                            {statusOption}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <Label>Selected Icon: {data.icon}</Label>
                    <input
                        type="text"
                        placeholder="Search icons..."
                        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 border p-4 rounded max-h-[300px] overflow-y-auto">
                        {paginatedIcons.map(([name, Icon]) => (
                            <div
                                key={name}
                                className={`flex flex-col items-center justify-center cursor-pointer p-3 rounded transition-all ${data.icon === name
                                        ? 'bg-blue-100 shadow-md'
                                        : 'hover:bg-gray-50'
                                    }`}
                                onClick={() => setData("icon", name)}
                            >
                                {React.createElement(Icon as any, {
                                    size: 24,
                                    color: data.color,
                                    strokeWidth: 1.5
                                })}
                                <span className="text-xs mt-2 text-center truncate w-full">
                                    {name}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-center gap-3 mt-4">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-3 py-1.5 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Previous
                        </button>
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-3 py-1.5 border rounded-md disabled:opacity-50 hover:bg-gray-50 transition-colors"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            <SubmitBtn processing={processing} className="w-full mt-6">
                {row ? `Update ${row.name}` : "Create new service"}
            </SubmitBtn>
        </form>
    );
}
