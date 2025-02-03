"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, UserMinus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

type UserData = {
  id: string;
  name: string;
  image: string;
  assignedJobs: number;
  acceptedJobs: number;
  closedJobs: number;
  message?: string;
};

const dummyData: { present: UserData[]; absent: UserData[] } = {
  present: [
    {
      id: "1",
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 5,
      acceptedJobs: 3,
      closedJobs: 2,
    },
    {
      id: "2",
      name: "Jane Smith",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 4,
      acceptedJobs: 2,
      closedJobs: 1,
    },
    {
      id: "3",
      name: "Alice Johnson",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 0,
      acceptedJobs: 0,
      closedJobs: 0,
      message: "User marked as absent",
    },
    {
      id: "4",
      name: "Bob Brown",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 0,
      acceptedJobs: 0,
      closedJobs: 0,
      message: "User marked as absent",
    },
    {
      id: "3",
      name: "Alice Johnson",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 0,
      acceptedJobs: 0,
      closedJobs: 0,
      message: "User marked as absent",
    },
    {
      id: "4",
      name: "Bob Brown",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 0,
      acceptedJobs: 0,
      closedJobs: 0,
      message: "User marked as absent",
    },
    {
      id: "3",
      name: "Alice Johnson",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 0,
      acceptedJobs: 0,
      closedJobs: 0,
      message: "User marked as absent",
    },
    {
      id: "4",
      name: "Bob Brown",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 0,
      acceptedJobs: 0,
      closedJobs: 0,
      message: "User marked as absent",
    },
    {
      id: "3",
      name: "Alice Johnson",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 0,
      acceptedJobs: 0,
      closedJobs: 0,
      message: "User marked as absent",
    },
    {
      id: "4",
      name: "Bob Brown",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 0,
      acceptedJobs: 0,
      closedJobs: 0,
      message: "User marked as absent",
    },
  ],
  absent: [
    {
      id: "3",
      name: "Alice Johnson",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 0,
      acceptedJobs: 0,
      closedJobs: 0,
      message: "User marked as absent",
    },
    {
      id: "4",
      name: "Bob Brown",
      image: "/placeholder.svg?height=40&width=40",
      assignedJobs: 0,
      acceptedJobs: 0,
      closedJobs: 0,
      message: "User marked as absent",
    },
  ],
};

export function AttendanceStatus() {
  const [presentUsers, setPresentUsers] = React.useState(dummyData.present);
  const [absentUsers, setAbsentUsers] = React.useState(dummyData.absent);

  const toggleUserStatus = (
    user: UserData,
    currentStatus: "present" | "absent",
  ) => {
    if (currentStatus === "present") {
      setPresentUsers(presentUsers.filter((u) => u.id !== user.id));
      setAbsentUsers([
        ...absentUsers,
        { ...user, message: "User marked as absent" },
      ]);
    } else {
      setAbsentUsers(absentUsers.filter((u) => u.id !== user.id));
      setPresentUsers([...presentUsers, { ...user, message: undefined }]);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6">
        <Tabs defaultValue="present" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="present" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Present
            </TabsTrigger>
            <TabsTrigger value="absent" className="flex items-center gap-2">
              <UserMinus className="h-4 w-4" />
              Absent
            </TabsTrigger>
          </TabsList>
          <TabsContent value="present">
            <ScrollArea className="h-[350px] w-full rounded-md border">
              <div className="w-max min-w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] bg-background">
                        User
                      </TableHead>
                      <TableHead className="bg-background">Name</TableHead>
                      <TableHead className="bg-background text-right">
                        Assigned
                      </TableHead>
                      <TableHead className="bg-background text-right">
                        Accepted
                      </TableHead>
                      <TableHead className="bg-background text-right">
                        Closed
                      </TableHead>
                      <TableHead className="bg-background text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {presentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <Avatar>
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell className="text-right">
                          {user.assignedJobs}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.acceptedJobs}
                        </TableCell>
                        <TableCell className="text-right">
                          {user.closedJobs}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(user, "present")}
                          >
                            Mark Absent
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
          <TabsContent value="absent">
            <ScrollArea className="h-[400px] w-full rounded-md border">
              <div className="w-max min-w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px] bg-background">
                        User
                      </TableHead>
                      <TableHead className="bg-background">Name</TableHead>
                      <TableHead className="bg-background">Status</TableHead>
                      <TableHead className="bg-background text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {absentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">
                          <Avatar>
                            <AvatarImage src={user.image} alt={user.name} />
                            <AvatarFallback>
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                        </TableCell>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">Absent</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleUserStatus(user, "absent")}
                          >
                            Mark Present
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
