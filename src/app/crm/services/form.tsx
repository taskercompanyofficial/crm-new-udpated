"use client";
import React, { useState } from 'react';
import * as LucideIcons from 'lucide-react';

export default function Page() {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedIcon, setSelectedIcon] = useState('');
    const [serviceName, setServiceName] = useState('');
    const [serviceDescription, setServiceDescription] = useState('');
    const itemsPerPage = 50;

    const filteredIcons = Object.entries(LucideIcons).filter(([name]) =>
        name.toLowerCase().includes(search.toLowerCase())
    );

    const totalPages = Math.ceil(filteredIcons.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedIcons = filteredIcons.slice(startIndex, startIndex + itemsPerPage);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you can handle the form submission
        console.log({
            serviceName,
            selectedIcon,
            serviceDescription
        });
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="mb-8 space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Service Name</label>
                    <input
                        type="text"
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter service name"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Service Description</label>
                    <textarea
                        value={serviceDescription}
                        onChange={(e) => setServiceDescription(e.target.value)}
                        className="w-full p-2 border rounded"
                        rows={4}
                        placeholder="Enter service description"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Selected Icon: {selectedIcon}</label>
                    <input
                        type="text"
                        placeholder="Search icons..."
                        className="w-full p-2 border rounded mb-4"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className="grid grid-cols-5 gap-4 mb-4 border p-4 rounded max-h-[400px] overflow-y-auto">
                        {paginatedIcons.map(([name, Icon]) => (
                            <div
                                key={name}
                                className={`flex flex-col items-center cursor-pointer p-2 rounded ${selectedIcon === name ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                                onClick={() => setSelectedIcon(name)}
                            >
                                {React.createElement(Icon as any, { size: 32 })}
                                <span className="text-sm mt-2">{name}</span>
                            </div>
                        ))}
                    </div>

                    <div className="flex justify-center gap-2">
                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="px-4 py-2">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            type="button"
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="px-4 py-2 border rounded disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50"
                    disabled={!serviceName || !selectedIcon || !serviceDescription}
                >
                    Create Service
                </button>
            </form>
        </div>
    );
}
