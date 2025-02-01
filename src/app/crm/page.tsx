"use client";
import { auth } from "auth";
import { useSession } from "next-auth/react";
import React from "react";

export default function Authenticated() {
  const session = useSession();
  return (
    <div>
      <pre>{JSON.stringify(session.data?.user, null, 2)}</pre>
    </div>
  );
}
