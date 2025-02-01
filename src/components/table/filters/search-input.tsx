"use client";
import { LabelInputContainer } from "@/components/ui/LabelInputContainer";
import { debounce } from "lodash";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function SearchInput() {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  const debouncedSearchRef = useRef(
    debounce((query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300),
  );

  // Update the debounced function when dependencies change
  useEffect(() => {
    debouncedSearchRef.current = debounce((query: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (query) {
        params.set("q", query);
      } else {
        params.delete("q");
      }
      replace(`${pathname}?${params.toString()}`);
    }, 300);

    // Cleanup the debounce function
    return () => {
      debouncedSearchRef.current.cancel();
    };
  }, [searchParams, replace, pathname]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    debouncedSearchRef.current(value);
  };

  return (
    <div className="relative w-full md:w-[300px]">
      <LabelInputContainer
        type="search"
        placeholder="Search..."
        onChange={handleSearch}
        value={searchValue}
        autoFocus={true}
        className="w-full rounded bg-background h-8"
      />
    </div>
  );
}
