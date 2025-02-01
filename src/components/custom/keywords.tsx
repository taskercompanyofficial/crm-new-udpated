"use client";

import React, {
  useState,
  KeyboardEvent,
  ChangeEvent,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface KeywordInputProps {
  onChange: (value: string) => void;
  maxValue?: number;
  label?: string;
  errorMessage?: string;
  value: string;
  placeholder?: string;
  allowCustomTags?: boolean;
  predefinedTags?: string;
}

export default function KeywordInput({
  onChange,
  maxValue,
  label,
  errorMessage,
  value,
  placeholder = "Type and press Enter...",
  allowCustomTags = true,
  predefinedTags = "",
}: KeywordInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [predefinedTagsList, setPredefinedTagsList] = useState<string[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  const keywords = value.split(",").filter(Boolean);

  useEffect(() => {
    if (predefinedTags) {
      setPredefinedTagsList(
        predefinedTags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      );
    }
  }, [predefinedTags]);

  const addKeyword = useCallback(
    (keyword: string) => {
      const trimmedKeyword = keyword.trim();
      if (
        trimmedKeyword &&
        !keywords.includes(trimmedKeyword) &&
        (!maxValue || keywords.length < maxValue)
      ) {
        if (allowCustomTags || predefinedTagsList.includes(trimmedKeyword)) {
          const newKeywords = [...keywords, trimmedKeyword];
          onChange(newKeywords.join(","));
          setInputValue("");
          setSuggestions([]);
          setSelectedSuggestionIndex(-1);
        }
      }
    },
    [keywords, maxValue, allowCustomTags, predefinedTagsList, onChange],
  );

  const removeKeyword = useCallback(
    (index: number) => {
      const newKeywords = keywords.filter((_, i) => i !== index);
      onChange(newKeywords.join(","));
    },
    [keywords, onChange],
  );

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    updateSuggestions(value);
  };

  const updateSuggestions = (value: string) => {
    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }
    const filteredSuggestions = predefinedTagsList.filter(
      (tag) =>
        tag.toLowerCase().includes(value.toLowerCase()) &&
        !keywords.includes(tag),
    );
    setSuggestions(filteredSuggestions);
    setSelectedSuggestionIndex(-1);
  };

  const handleInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedSuggestionIndex !== -1) {
        addKeyword(suggestions[selectedSuggestionIndex]);
      } else if (allowCustomTags && inputValue.trim()) {
        addKeyword(inputValue);
      }
    } else if (
      e.key === "Backspace" &&
      inputValue === "" &&
      keywords.length > 0
    ) {
      removeKeyword(keywords.length - 1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) =>
        prev < suggestions.length - 1 ? prev + 1 : prev,
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedSuggestionIndex((prev) => (prev > 0 ? prev - 1 : prev));
    }
  };

  const handleInputKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") {
      updateSuggestions(e.currentTarget.value);
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      {label && <Label htmlFor="keyword-input">{label}</Label>}
      <div className="relative">
        <div className="flex min-h-[38px] flex-wrap gap-1 rounded-md border bg-background p-2">
          {keywords.map((keyword, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-2 py-0.5 text-xs"
            >
              {keyword}
              <X
                className="ml-1 h-3 w-3 cursor-pointer"
                onClick={() => removeKeyword(index)}
              />
            </Badge>
          ))}
          <input
            ref={inputRef}
            id="keyword-input"
            type="text"
            className="flex-grow bg-gray-50 bg-transparent outline-none dark:bg-slate-950"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            onKeyUp={handleInputKeyUp}
            placeholder={keywords.length === 0 ? placeholder : ""}
          />
        </div>
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-md border bg-background shadow-lg">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                className={`cursor-pointer px-3 py-2 ${
                  index === selectedSuggestionIndex
                    ? "bg-accent"
                    : "hover:bg-accent"
                }`}
                onClick={() => addKeyword(suggestion)}
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>
      {errorMessage && (
        <p className="text-sm text-destructive">{errorMessage}</p>
      )}
      {maxValue && keywords.length >= maxValue && (
        <p className="text-warning text-sm">
          Maximum number of keywords reached.
        </p>
      )}
    </div>
  );
}
