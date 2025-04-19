import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import BasicForm from "../../components/basic-form";
import ComplaintDetailsForm from "../../components/complaint-details-form";
import FilesForm from "../../components/files-form";
import Store from "../../components/strore";
import Remarks from "../../components/remarks";
import History from "../../components/history";
import { dataTypeIds } from "@/types";

interface ComplaintTabsProps {
  tab: string;
  setTab: (tab: string) => void;
  data: any;
  setData: (data: any) => void;
  errors: any;
  technician?: dataTypeIds[];
  complaintId: number;
  token: string;
  role: string
}

export default function ComplaintTabs({
  tab,
  setTab,
  data,
  setData,
  errors,
  technician,
  complaintId,
  token,
  role
}: ComplaintTabsProps) {
  const tabs = role === "administrator"
    ? [
      "basic",
      "advanced",
      "attachments",
      "store",
      "remarks",
      "history",
    ]
    : [
      "basic",
      "advanced",
      "attachments",
      "store",
      "remarks",
    ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        if (e.key === 'ArrowRight') {
          const currentIndex = tabs.indexOf(tab);
          if (currentIndex < tabs.length - 1) {
            setTab(tabs[currentIndex + 1]);
          }
        } else if (e.key === 'ArrowLeft') {
          const currentIndex = tabs.indexOf(tab);
          if (currentIndex > 0) {
            setTab(tabs[currentIndex - 1]);
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tab, tabs, setTab]);

  return (
    <Tabs defaultValue="basic" value={tab} onValueChange={setTab}>
      <ScrollArea>
        <TabsList className="min-w-max bg-primary text-white">
          {tabs.map((tabItem) => (
            <TabsTrigger
              key={tabItem}
              value={tabItem}
              className="min-w-[100px] flex-1"
            >
              {tabItem.charAt(0).toUpperCase() + tabItem.slice(1)}
            </TabsTrigger>
          ))}
        </TabsList>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <Separator className="my-2" />
      <TabsContent value="basic">
        <BasicForm data={data} setData={setData} errors={errors} />
      </TabsContent>
      <TabsContent value="advanced">
        <ComplaintDetailsForm
          data={data}
          setData={setData}
          errors={errors}
          technician={technician}
        />
      </TabsContent>
      <TabsContent value="attachments">
        <FilesForm data={data} setData={setData} errors={errors} />
      </TabsContent>
      <TabsContent value="store">
        <Store />
      </TabsContent>
      <TabsContent value="remarks">
        <Remarks complaintId={complaintId || 0} />
      </TabsContent>
      <TabsContent value="history">
        <History id={complaintId} token={token} />
      </TabsContent>
    </Tabs>
  );
}
