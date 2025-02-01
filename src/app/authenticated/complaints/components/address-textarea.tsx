"use client";
import React, { useState, useCallback } from 'react';
import { TextareaInput } from "@/components/custom/TextareaInput";
import { fetchSuggestions } from "@/lib/google";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import debounce from 'lodash/debounce';

interface AddressTextareaProps {
  value: string;
  onChange: (value: string) => void;
  errorMessage?: string;
}

export default function AddressTextarea({ value, onChange, errorMessage }: AddressTextareaProps) {
  const [suggestions, setSuggestions] = useState<PlaceAutocompleteResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce(async (searchValue: string) => {
      if (searchValue.length > 2) {
        const results = await fetchSuggestions(searchValue);
        setSuggestions(results);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300),
    []
  );

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
    debouncedFetch(newValue);
  };

  return (
    <div className="relative">
      <TextareaInput
        label="Address"
        placeholder="Enter applicant address..."
        maxLength={250}
        value={value}
        onChange={handleChange}
        errorMessage={errorMessage}
        className="bg-gray-50"
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg">
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.place_id}
              className="px-4 py-2 cursor-pointer hover:bg-gray-100"
              onClick={() => {
                onChange(suggestion.description);
                setShowSuggestions(false);
                setSuggestions([]);
              }}
            >
              {suggestion.description}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
