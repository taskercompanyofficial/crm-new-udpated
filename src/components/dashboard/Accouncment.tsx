"use client";
import React, { useState, useEffect } from "react";
import Marquee from "react-fast-marquee";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function Announcement({
  username = "user",
}: {
  username?: string;
}) {
  const messages = [
    "Hello, welcome!",
    "System update scheduled for tomorrow.",
    "Don't miss our new features.",
    "Stay tuned for upcoming events.",
    "Thank you for using our service.",
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNext = () => {
    setCurrentMessageIndex((prevIndex) =>
      prevIndex === messages.length - 1 ? 0 : prevIndex + 1,
    );
  };

  const handleBack = () => {
    setCurrentMessageIndex((prevIndex) =>
      prevIndex === 0 ? messages.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-md border bg-white shadow-sm dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between bg-sidebar p-1.5">
        <p className="font-mono text-sm font-bold text-sidebar-accent-foreground">
          Important:
        </p>
        <p className="text-xs text-primary-foreground">
          {username} is <span className="font-bold text-green-500">Online</span>
        </p>
      </div>

      {/* Marquee with message display */}
      <div className="flex items-center justify-between p-1.5">
        <Button onClick={handleBack} variant="ghost" size="icon" className="h-6 w-6">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-grow">
          <Marquee speed={50} gradient={false} direction="left">
            <p className="text-sm font-medium">
              {messages[currentMessageIndex]}
            </p>
          </Marquee>
        </div>
        <Button variant="ghost" onClick={handleNext} size="icon" className="h-6 w-6">
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Live Time */}
      <div className="bg-gray-100 p-1.5 text-right text-xs dark:bg-gray-800">
        Live Time:{" "}
        <span className="font-mono">
          {time.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        </span>
      </div>
    </div>
  );
}
