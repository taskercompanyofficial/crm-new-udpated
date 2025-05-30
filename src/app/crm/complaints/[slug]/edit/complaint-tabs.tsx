import React, { useEffect } from 'react';
import { Tabs } from 'antd';
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
  role: string;
  jobDone?: boolean;
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
  jobDone,
}: ComplaintTabsProps) {
  const tabs = [
    {
      key: "basic",
      label: "Basic",
      children: <BasicForm data={data} setData={setData} errors={errors} jobDone={jobDone} />
    },
    {
      key: "advanced", 
      label: "Advanced",
      children: <ComplaintDetailsForm
        data={data}
        setData={setData}
        errors={errors}
        technician={technician}
        jobDone={jobDone}
      />
    },
    {
      key: "attachments",
      label: "Attachments", 
      children: <FilesForm data={data} setData={setData} errors={errors} jobDone={jobDone} />
    },
    {
      key: "store",
      label: "Store",
      children: <Store />
    },
    {
      key: "remarks",
      label: "Remarks",
      children: <Remarks complaintId={complaintId || 0} />
    },
    {
      key: "history",
      label: "History",
      children: <History id={complaintId} token={token} />
    }
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) {
        // Arrow key navigation
        if (e.key === 'ArrowRight') {
          const currentIndex = tabs.findIndex(t => t.key === tab);
          if (currentIndex < tabs.length - 1) {
            setTab(tabs[currentIndex + 1].key);
          }
        } else if (e.key === 'ArrowLeft') {
          const currentIndex = tabs.findIndex(t => t.key === tab);
          if (currentIndex > 0) {
            setTab(tabs[currentIndex - 1].key);
          }
        }
        // Direct tab shortcuts
        else if (e.key.toLowerCase() === '1') {
          setTab('basic');
        } else if (e.key.toLowerCase() === '2') {
          setTab('advanced');
        } else if (e.key.toLowerCase() === '3') {
          setTab('attachments');
        } else if (e.key.toLowerCase() === '4') {
          setTab('store');
        } else if (e.key.toLowerCase() === '5') {
          setTab('remarks');
        } else if (e.key.toLowerCase() === '6') {
          setTab('history');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tab, tabs, setTab]);

  return (
    <Tabs
      activeKey={tab}
      onChange={setTab}
      defaultActiveKey="basic"
      items={tabs}
      type="line"
      className="w-full px-2 rounded-md"
      style={{ backgroundColor: 'white' }}
    />
  );
}
