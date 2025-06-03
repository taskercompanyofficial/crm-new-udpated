"use client";
import { Input, InputRef } from "antd";
import { useQueryState } from "nuqs";
import { useRef, useEffect } from "react";

export default function SearchInput() {
  const [searchQuery, setSearchQuery] = useQueryState("q", {
    shallow: true,
    defaultValue: ""
  });
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle Ctrl+F keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'f') {
        e.preventDefault(); // Prevent default browser search
        if (inputRef.current) {
          inputRef.current.focus();
          // Scroll input into view if needed
          inputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value || null);
  };

  return (
    <div className="relative w-full md:w-[300px]">
      <Input
        ref={inputRef as unknown as React.RefObject<InputRef>}
        type="search"
        placeholder="Search..."
        onChange={handleSearch}
        value={searchQuery ?? ""}
        autoFocus={true}
        className="w-full rounded bg-background h-8"
      />
    </div>
  );
}
