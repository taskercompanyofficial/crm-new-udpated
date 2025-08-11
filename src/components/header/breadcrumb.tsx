"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function BreadcrumbNav() {
  const pathname = usePathname();
  const router = useRouter();
  const paths = pathname.split("/").filter(Boolean);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleDoubleClick = (index: number, path: string) => {
    setEditingIndex(index);
    setEditValue(path);
  };

  const handleSubmit = (index: number) => {
    const newPaths = [...paths];
    newPaths[index] = editValue;
    const newPath = "/" + newPaths.slice(0, index + 1).join("/");
    router.push(newPath);
    setEditingIndex(null);
    setDialogOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Enter") {
      handleSubmit(index);
    }
  };

  const formatPathDisplay = (path: string) => {
    return path.replace(/-/g, " ");
  };

  const openEditDialog = (index: number, path: string) => {
    setSelectedIndex(index);
    setEditValue(path);
    setDialogOpen(true);
  };

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyboardShortcut = (e: KeyboardEvent) => {
      // Alt+E to edit the current (last) breadcrumb
      if (e.altKey && e.key === "e" && paths.length > 0) {
        e.preventDefault();
        const lastIndex = paths.length - 1;
        openEditDialog(lastIndex, paths[lastIndex]);
      }

      // Alt+number to edit specific breadcrumb (1-based index)
      if (e.altKey && !isNaN(parseInt(e.key)) && parseInt(e.key) > 0) {
        const index = parseInt(e.key) - 1;
        if (index < paths.length) {
          e.preventDefault();
          openEditDialog(index, paths[index]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcut);
    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcut);
    };
  }, [paths]);

  return (
    <>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />

          {paths.map((path, index) => {
            const href = `/${paths.slice(0, index + 1).join("/")}`;
            const isLast = index === paths.length - 1;
            const displayPath = formatPathDisplay(path);

            return (
              <React.Fragment key={path}>
                <BreadcrumbItem>
                  {editingIndex === index ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onBlur={() => handleSubmit(index)}
                      autoFocus
                      className="px-2 py-1 border rounded"
                    />
                  ) : isLast ? (
                    <BreadcrumbPage
                      onDoubleClick={() => handleDoubleClick(index, path)}
                      title={`Alt+${index + 1} to edit`}
                    >
                      {displayPath}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <span
                        onDoubleClick={() => handleDoubleClick(index, path)}
                        title={`Alt+${index + 1} to edit`}
                      >
                        <Link href={href}>{displayPath}</Link>
                      </span>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Navigation Path</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) =>
                selectedIndex !== null &&
                e.key === "Enter" &&
                handleSubmit(selectedIndex)
              }
              autoFocus
              placeholder="Enter path segment"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={() =>
                selectedIndex !== null && handleSubmit(selectedIndex)
              }
            >
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
