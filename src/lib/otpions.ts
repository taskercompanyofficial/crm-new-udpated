import {
  ShieldCheck,
  Building2,
  Building,
  Wrench,
  Calculator,
  HeadsetIcon,
  Truck,
  BarChart3,
  BadgeDollarSign,
  ShoppingBag,
  HeartHandshake,
  UserCheck,
  HelpingHand,
  CheckCircle2,
  XCircle,
  PauseCircle,
} from "lucide-react";
import useFetch from "@/hooks/usefetch";
import { API_URL } from "./apiEndPoints";

export const getRoleOptions = [
  { value: "administrator", label: "Administrator", icon: ShieldCheck },
  { value: "general-manager", label: "General Manager", icon: Building2 },
  { value: "branch-manager", label: "Branch Manager", icon: Building },
  { value: "technician", label: "Technician", icon: Wrench },
  { value: "accountant", label: "Accountant", icon: Calculator },
  { value: "receptionist", label: "Receptionist", icon: HeadsetIcon },
  { value: "driver", label: "Driver", icon: Truck },
  { value: "sales-manager", label: "Sales Manager", icon: BarChart3 },
  { value: "sales-executive", label: "Sales Executive", icon: BadgeDollarSign },
  { value: "sales-assistant", label: "Sales Assistant", icon: ShoppingBag },
  { value: "cso", label: "CSO", icon: HeartHandshake },
  { value: "csr", label: "CSR", icon: UserCheck },
  { value: "helper", label: "Helper", icon: HelpingHand },
];

export const StatusOptions = [
  {
    value: "active",
    label: "Active",
    color: "255, 159, 67",
    icon: CheckCircle2,
  },
  { value: "inactive", label: "Inactive", color: "234, 84, 85", icon: XCircle },
  { value: "paused", label: "Paused", color: "234, 84, 85", icon: PauseCircle },
];
export const PriorityOptions = [{
  value: "high",
  label: "High",
  color: "255, 159, 67",
}
  ,
{
  value: "medium",
  label: "Medium",
  color: "255, 159, 67",
},
{
  value: "low",
  label: "Low",
  color: "255, 159, 67",
}

]
export const ComplaintStatusOptions = [
  { value: "open", label: "Open", color: "255, 159, 67" },
  { value: "objection", label: "Objecction", color: "121, 85, 72" },
  { value: "hold-by-brand", label: "Hold by Brand", color: "233, 30, 99" },
  { value: "hold-by-customer", label: "Hold by Customer", color: "103, 58, 183" },
  {
    value: "assigned-to-technician",
    label: "Assigned to Technician",
    color: "63, 81, 181",
  },
  {
    value: "part-demand",
    label: "Part Demand",
    color: "33, 150, 243",
  },
  {
    value: "service-lifting",
    label: "Service Lifting",
    color: "0, 188, 212",
  },
  {
    value: "party-lifting",
    label: "Party Lifting",
    color: "0, 150, 136",
  },
  {
    value: "unit-in-service-center",
    label: "Unit in Service Center",
    color: "76, 175, 80",
  },
  {
    value: "reinstallation-pending",
    label: "Reinstallation Pending",
    color: "76, 175, 80",
  },
  {
    value: "kit-in-service-center",
    label: "Kit in Service Center",
    color: "139, 195, 74",
  },
  {
    value: "delivery-pending",
    label: "Delivery Pending",
    color: "205, 220, 57",
  },
  {
    value: "quotation-applied",
    label: "Quotation Applied",
    color: "255, 235, 59",
  },
  {
    value: "installation-pending",
    label: "Installation Pending",
    color: "255, 193, 7",
  },
  {
    value: "in-progress",
    label: "In Progress",
    color: "255, 152, 0",
  },
  { value: "delivered", label: "Delivered", color: "255, 87, 34" },
  {
    value: "pending-by-brand",
    label: "Pending by Brand",
    color: "244, 67, 54",
  },
  {
    value: "feedback-pending",
    label: "Feedback Pending",
    color: "156, 39, 176",
  },
  {
    value: "completed",
    label: "Completed",
    color: "76, 175, 80",
  },
  {
    value: "amount-pending",
    label: "Amount Pending",
    color: "96, 125, 139",
  },
  {
    value: "closed",
    label: "Closed",
    color: "158, 158, 158",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "117, 117, 117",
  },
];

export const CallStatusOptions = [
  { value: "pending", label: "Pending", color: "241, 196, 15" }, // Yellow
  { value: "phone-off", label: "Phone Off", color: "231, 76, 60" }, // Dark Red
  { value: "not-responding", label: "Not Responding", color: "192, 57, 43" }, // Dark Red
  { value: "wrong-number", label: "Wrong Number", color: "255, 99, 132" }, // Soft Red
  { value: "busy", label: "Busy", color: "155, 89, 182" }, // Purple
  { value: "rescheduled", label: "Rescheduled", color: "52, 152, 219" }, // Blue
  { value: "not-interested", label: "Not Interested", color: "230, 126, 34" }, // Dark Orange
  { value: "callback-requested", label: "Callback Requested", color: "41, 128, 185" }, // Blue
  { value: "done", label: "Done", color: "39, 174, 96" }, // Green
];

export const warrantyTypeOptions = [
  { value: "clipping-wire", label: "Clipping Wire", color: "189, 189, 189" }, // Light Grey
  { value: "customer-info-slip", label: "Customer Info Slip", color: "189, 189, 189" }, // Light Grey
  { value: "connection", label: "Connection", color: "96, 125, 139" }, // Blue Grey
  { value: "complaint-picture", label: "Complaint Picture", color: "233, 30, 99" }, // Pink
  { value: "customer-feedback", label: "Customer Feedback", color: "0, 188, 212" }, // Cyan
  { value: "defective-part", label: "Defective Part", color: "231, 76, 60" }, // Dark Red
  { value: "defective-picture", label: "Defective Picture", color: "255, 99, 132" }, // Soft Red
  { value: "delivery-challan", label: "Delivery Challan", color: "230, 126, 34" }, // Dark Orange
  { value: "demonstration", label: "Demonstration", color: "156, 39, 176" }, // Purple
  { value: "hole-picture", label: "Hole Picture", color: "158, 158, 158" }, // Grey
  { value: "ind-sr", label: "Ind-SR", color: "192, 57, 43" }, // Dark Red
  { value: "indoor", label: "Indoor", color: "26, 188, 156" }, // Teal
  { value: "indoor-leakage-test", label: "Indoor Leakage Test", color: "103, 58, 183" }, // Deep Purple
  { value: "indoor-technician", label: "Technician with Indoor", color: "121, 85, 72" }, // Brown
  { value: "installation-picture", label: "Installation Picture", color: "156, 39, 176" }, // Purple
  { value: "installation-report", label: "Installation Report", color: "33, 150, 243" }, // Light Blue
  { value: "invoice", label: "Invoice", color: "39, 174, 96" }, // Green
  { value: "jobsheet", label: "Jobsheet", color: "241, 196, 15" }, // Yellow
  { value: "leakage-test", label: "Leakage Test", color: "117, 117, 117" }, // Dark Grey
  { value: "out-sr", label: "Out-SR", color: "255, 159, 64" }, // Orange
  { value: "outdoor", label: "Outdoor", color: "41, 128, 185" }, // Blue
  { value: "outdoor-leakage-test", label: "Outdoor Leakage Test", color: "63, 81, 181" }, // Indigo
  { value: "outdoor-technician", label: "Technician with Outdoor", color: "121, 85, 72" }, // Brown
  { value: "part-slip", label: "Part Slip", color: "230, 126, 34" }, // Dark Orange
  { value: "pipe-pic", label: "Pipe Picture", color: "117, 117, 117" }, // Dark Grey
  { value: "product-demonstration", label: "Product Demonstration", color: "0, 150, 136" }, // Teal
  { value: "service-challan", label: "Service Challan", color: "155, 89, 182" }, // Purple
  { value: "service-report", label: "Service Report", color: "63, 81, 181" }, // Indigo
  { value: "technician-with-customer", label: "Technician with Customer", color: "121, 85, 72" }, // Brown
  { value: "usage-demonstration", label: "Usage Demonstration", color: "0, 121, 107" }, // Dark Teal
  { value: "warranty-bill", label: "Warranty Bill", color: "103, 58, 183" }, // Deep Purple
  { value: "warranty-card", label: "Warranty Card", color: "52, 152, 219" }, // Blue
  { value: "wiring-joint", label: "Wiring Joint", color: "121, 85, 72" } // Brown
];

export const complaintTypeOptions = [
  {
    value: "new-ac-free-installation",
    label: "New AC Free Installation",
    color: "52, 152, 219" // Blue
  },
  {
    value: "old-ac-free-installation",
    label: "Old AC Free Installation",
    color: "230, 126, 34" // Dark Orange
  },
  {
    value: "old-c/o-free-installation",
    label: "Old C/O Free Installation",
    color: "39, 174, 96" // Green
  },
  {
    value: "old-c/o-installation",
    label: "Old C/O Installation",
    color: "155, 89, 182" // Purple
  },

  { value: "free-installation", label: "Free Installation", color: "26, 188, 156" }, // Teal
  { value: "paid-installation", label: "Paid Installation", color: "241, 196, 15" }, // Yellow
  { value: "warranty", label: "Warranty", color: "41, 128, 185" }, // Blue
  { value: "revenue", label: "Revenue", color: "231, 76, 60" }, // Dark Red
  { value: "service", label: "Service", color: "255, 159, 64" }, // Orange
  { value: "warrenty-revenue", label: "Warrenty+Revenue", color: "192, 57, 43" }, // Dark Red
  { value: "other", label: "Other", color: "255, 99, 132" } // Soft Red
];

export const MessageTypeOptions = [
  {
    value: "auto_pay_reminder_2",
    label: "Update Complaint",
    color: "52, 152, 219" // Blue
  },
  {
    value: "complaint_create_template",
    label: "Complaint Create Template",
    color: "39, 174, 96" // Green
  }
];
export const Dealers = [
  { value: "metro", label: "Metro" },
  { value: "metro", label: "" },
  { value: "metro", label: "Metro" },
  { value: "metro", label: "Metro" },
  { value: "metro", label: "Metro" },
]
export const ProductOptions = [
  { value: "Refrigerator", label: "Refrigerator", id: "1", image: "" },
  { value: "Refrigerator Side by Side", label: "Refrigerator Side by Side", id: "2", image: "" },
  { value: "Refrigerator French Door", label: "Refrigerator French Door", id: "3", image: "" },
  { value: "Refrigerator Top Freezer", label: "Refrigerator Top Freezer", id: "4", image: "" },
  { value: "Refrigerator Bottom Freezer", label: "Refrigerator Bottom Freezer", id: "5", image: "" },
  { value: "Washing Machine", label: "Washing Machine", id: "6", image: "" },
  { value: "Washing Machine Top Load", label: "Washing Machine Top Load", id: "7", image: "" },
  { value: "Washing Machine Front Load", label: "Washing Machine Front Load", id: "8", image: "" },
  { value: "Washing Machine Semi-Automatic", label: "Washing Machine Semi-Automatic", id: "9", image: "" },
  { value: "Air Conditioner", label: "Air Conditioner", id: "10", image: "" },
  { value: "Microwave", label: "Microwave", id: "11", image: "" },
  { value: "Dishwasher", label: "Dishwasher", id: "12", image: "" },
  { value: "Water Heater", label: "Water Heater", id: "13", image: "" },
  { value: "Dryer", label: "Dryer", id: "14", image: "" },
  { value: "Stove", label: "Stove", id: "15", image: "" },
  { value: "Oven", label: "Oven", id: "16", image: "" },
  { value: "LCD TV", label: "LCD TV", id: "17", image: "" },
  { value: "LCD Monitor", label: "LCD Monitor", id: "18", image: "" },
  { value: "Water Dispenser", label: "Water Dispenser", id: "19", image: "" }
];
export const DealerOptions = [
  { value: "Lahore Center", label: "Lahore Center", id: "1", image: "" },
  { value: "Multi Electronics", label: "Multi Electronics", id: "2", image: "" },
  { value: "Afzal Electronics", label: "Afzal Electronics", id: "3", image: "" },
  { value: "Madina Electronics", label: "Madina Electronics", id: "4", image: "" },
  { value: "Metro Cash & Carry LHR", label: "Metro Cash & Carry LHR", id: "5", image: "" },
  { value: "Metro Cash & Carry ISB", label: "Metro Cash & Carry ISB", id: "6", image: "" },
  { value: "Imtiaz Store", label: "Imtiaz Store", id: "7", image: "" },
  { value: "E-Lux", label: "E-Lux", id: "8", image: "" },
  { value: "Dawlance Experience Store", label: "Dawlance Experience Store", id: "9", image: "" },
  { value: "Al-Mumtaz Group", label: "Al-Mumtaz Group", id: "10", image: "" },
  { value: "Japan ELC ISB/RWP", label: "Japan ELC ISB/RWP", id: "11", image: "" },
  { value: "Friends ELc ISB/RWP", label: "Friends ELc ISB/RWP", id: "12", image: "" },
  { value: "Minhaj Trader Bedian RD", label: "Minhaj Trader Bedian RD", id: "12", image: "" },
  { value: "Minhaj Trader Bedian Walton", label: "Minhaj Trader Bedian Walton", id: "12", image: "" },
  { value: "Itfaq Electronincs", label: "Itfaq Electronincs", id: "12", image: "" },
  { value: "Modern Center Collage Road LHR", label: "Modern Center Collage Road LHR", id: "13", image: "" },
  { value: "Alfatah Electronics", label: "Alfatah Electronics", id: "14", image: "" },
  { value: "Fridge Center", label: "Fridge Center", id: "14", image: "" },
  { value: "Subhan Electronics", label: "Subhan Electronics", id: "15", image: "" },
  { value: "AM Electronics", label: "AM Electronics", id: "16", image: "" },
  { value: "Friends Electronics", label: "Friends Electronics", id: "17", image: "" },
  { value: "CC", label: "CC", id: "18", image: "" },
  { value: "Dealer Pending", label: "Dealer Pending", id: "19", image: "" }
];

export const useFetchBranches = () => {
  const { data, isLoading, error } = useFetch<any>(`${API_URL}/crm/fetch-branches`);
  return { data, isLoading, error };
};

export const useFetchBrands = () => {
  const { data, isLoading, error } = useFetch<any>(`${API_URL}/crm/fetch-authorized-brands`);
  return { data, isLoading, error };
};

export const useFetchTechnicians = () => {
  const { data, isLoading, error } = useFetch<any>(`${API_URL}/crm/fetch-technicians`);
  return { data, isLoading, error };
};

