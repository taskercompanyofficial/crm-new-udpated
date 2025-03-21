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

export const ComplaintStatusOptions = [
  { value: "open", label: "Open", color: "255, 159, 67" }, // Orange - Attention needed
  { value: "hold-by-us", label: "Hold by Us", color: "121, 85, 72" }, // Brown - Internal delay
  { value: "hold-by-brand", label: "Hold by Brand", color: "233, 30, 99" }, // Pink - External delay (brand)
  { value: "hold-by-customer", label: "Hold by Customer", color: "103, 58, 183" }, // Purple - Customer delay

  {
    value: "assigned-to-technician",
    label: "Assigned to Technician",
    color: "63, 81, 181", // Indigo - In technician's queue
  },
  {
    value: "part-demand",
    label: "Part Demand",
    color: "33, 150, 243", // Blue - Waiting for parts
  },
  {
    value: "service-lifting",
    label: "Service Lifting",
    color: "0, 188, 212", // Cyan - Service in progress
  },
  {
    value: "party-lifting",
    label: "Party Lifting",
    color: "0, 150, 136", // Teal - Third party handling
  },
  {
    value: "unit-in-service-center",
    label: "Unit in Service Center",
    color: "76, 175, 80", // Green - Being serviced
  },
  {
    value: "kit-in-service-center",
    label: "Kit in Service Center",
    color: "139, 195, 74", // Light Green - Parts being serviced
  },
  {
    value: "delivery-pending",
    label: "Delivery Pending", 
    color: "205, 220, 57", // Lime - Ready for delivery
  },
  {
    value: "quotation-applied",
    label: "Quotation Applied",
    color: "255, 235, 59", // Yellow - Waiting for approval
  },
  {
    value: "installation-pending",
    label: "Installation Pending",
    color: "255, 193, 7", // Amber - Ready for installation
  },
  {
    value: "in-progress",
    label: "In Progress",
    color: "255, 152, 0", // Orange - Active work happening
  },
  { value: "delivered", label: "Delivered", color: "255, 87, 34" }, // Deep Orange - Delivered but not complete
  {
    value: "pending-by-brand",
    label: "Pending by Brand",
    color: "244, 67, 54", // Red - Blocked by brand
  },
  {
    value: "feedback-pending",
    label: "Feedback Pending",
    color: "156, 39, 176", // Purple - Waiting for customer feedback
  },
  {
    value: "completed",
    label: "Completed",
    color: "76, 175, 80", // Green - Successfully resolved
  },
  {
    value: "amount-pending",
    label: "Amount Pending",
    color: "96, 125, 139", // Blue Grey - Payment pending
  },
  {
    value: "closed",
    label: "Closed",
    color: "158, 158, 158", // Grey - No further action needed
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "117, 117, 117", // Dark Grey - Terminated
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
  { value: "warranty-card", label: "Warranty Card", color: "52, 152, 219" }, // Blue
  { value: "jobsheet", label: "Jobsheet", color: "241, 196, 15" }, // Yellow
  { value: "invoice", label: "Invoice", color: "39, 174, 96" }, // Green
  { value: "delivery-challan", label: "Delivery Challan", color: "230, 126, 34" }, // Dark Orange
  { value: "service-challan", label: "Service Challan", color: "155, 89, 182" }, // Purple
  { value: "defective-part", label: "Defective Part", color: "231, 76, 60" }, // Dark Red
  { value: "defective-picture", label: "Defective Picture", color: "255, 99, 132" }, // Soft Red
  { value: "indoor", label: "Indoor", color: "26, 188, 156" }, // Teal
  { value: "outdoor", label: "Outdoor", color: "41, 128, 185" }, // Blue
  { value: "ind-sr", label: "Ind-SR", color: "192, 57, 43" }, // Dark Red
  { value: "out-sr", label: "Out-SR", color: "255, 159, 64" }, // Orange
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
export const Dealers =[
  {value: "metro", label: "Metro"},
  {value: "metro", label: ""},
  {value: "metro", label: "Metro"},
  {value: "metro", label: "Metro"},
  {value: "metro", label: "Metro"},
]
