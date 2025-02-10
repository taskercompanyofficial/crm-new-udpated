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
  CircleDot,
  Package,
  Wrench as WrenchIcon,
  ArrowUpCircle,
  Users,
  Building as BuildingIcon,
  Clock,
  Clock1 as ClockIcon,
  Box,
  CheckCircle,
  AlertCircle,
  XCircle as XCircleIcon,
  FileText,
  ClipboardList,
  Receipt,
  Truck as TruckIcon,
  FileSpreadsheet,
  Component,
  Image,
  Home,
  Warehouse,
  CircleDollarSign,
  CircleOff,
  Snowflake,
  LucideWrench,
  CircleCheck,
  DollarSign,
  Settings,
  MessageCircle,
  MessagesSquare,
  PhoneOff,
  PhoneOutgoing,
  PhoneMissed,
  CalendarClock,
  ThumbsDown,
  PhoneCall,
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
  { value: "open", label: "Open", color: "255, 159, 67", icon: CircleDot }, // Orange
  { value: "hold-by-us", label: "Hold by Us", color: "255, 87, 34", icon: CircleDot }, // Deep Orange
  { value: "hold-by-brand", label: "Hold by Brand", color: "233, 30, 99", icon: CircleDot }, // Pink
  { value: "hold-by-customer", label: "Hold by Customer", color: "103, 58, 183", icon: CircleDot }, // Purple

  {
    value: "assigned-to-technician",
    label: "Assigned to Technician",
    color: "234, 84, 85",
    icon: UserCheck, // Red
  },
  {
    value: "part-demand",
    label: "Part Demand",
    color: "244, 67, 54",
    icon: Package, // Bright Red
  },
  {
    value: "service-lifting",
    label: "Service Lifting",
    color: "46, 204, 113",
    icon: ArrowUpCircle, // Green
  },
  {
    value: "party-lifting",
    label: "Party Lifting",
    color: "52, 152, 219",
    icon: Users, // Blue
  },
  {
    value: "unit-in-service-center",
    label: "Unit in Service Center",
    color: "155, 89, 182",
    icon: BuildingIcon, // Purple
  },
  {
    value: "installation-pending",
    label: "Installation Pending",
    color: "230, 126, 34",
    icon: Clock, // Dark Orange
  },
  {
    value: "in-progress",
    label: "In Progress",
    color: "241, 196, 15",
    icon: ClockIcon, // Yellow
  },
  { value: "delivered", label: "Delivered", color: "26, 188, 156", icon: Box }, // Teal
  {
    value: "pending-by-brand",
    label: "Pending by Brand",
    color: "231, 76, 60",
    icon: AlertCircle, // Dark Red
  },
  {
    value: "feedback-pending",
    label: "Feedback Pending", 
    color: "255, 159, 64",
    icon: Clock, // Orange
  },
  {
    value: "completed",
    label: "Completed",
    color: "39, 174, 96",
    icon: CheckCircle, // Green
  },
  {
    value: "amount-pending",
    label: "Amount Pending",
    color: "255, 99, 132",
    icon: AlertCircle, // Soft Red
  },
  {
    value: "closed",
    label: "Closed",
    color: "41, 128, 185",
    icon: CheckCircle, // Blue
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "192, 57, 43",
    icon: XCircleIcon, // Dark Red
  },
];

export const CallStatusOptions = [
  { value: "pending", label: "Pending", icon: CircleDot },
  { value: "phone-off", label: "Phone Off", icon: PhoneOff },
  { value: "not-responding", label: "Not Responding", icon: PhoneOutgoing },
  { value: "wrong-number", label: "Wrong Number", icon: XCircle },
  { value: "busy", label: "Busy", icon: PhoneMissed },
  { value: "rescheduled", label: "Rescheduled", icon: CalendarClock },
  { value: "not-interested", label: "Not Interested", icon: ThumbsDown },
  { value: "callback-requested", label: "Callback Requested", icon: PhoneCall },
  { value: "done", label: "Done", icon: CheckCircle },
];

export const warrantyTypeOptions = [
  { value: "warrenty-card", label: "Warrenty Card", icon: FileText },
  { value: "jobsheet", label: "Jobsheet", icon: ClipboardList },
  { value: "invoice", label: "Invoice", icon: Receipt },
  { value: "delivery-challan", label: "Delivery Challan", icon: TruckIcon },
  { value: "service-challan", label: "Service Challan", icon: FileSpreadsheet },
  { value: "defective-part", label: "Defective Part", icon: Component },
  { value: "defective-picture", label: "Defective Picture", icon: Image },
  { value: "indoor", label: "Indoor", icon: Home },
  { value: "outdoor", label: "Outdoor", icon: Warehouse },
  { value: "ind-sr", label: "Ind-SR", icon: CircleDollarSign },
  { value: "out-sr", label: "Out-SR", icon: CircleOff },
];

export const complaintTypeOptions = [
  {
    value: "new-ac-free-installation",
    label: "New AC Free Installation",
    icon: Snowflake,
  },
  {
    value: "old-ac-free-installation",
    label: "Old AC Free Installation",
    icon: LucideWrench,
  },
  {
    value: "old-c/o-free-installation",
    label: "Old C/O Free Installation",
    icon: CircleCheck,
  },
  {
    value: "old-c/o-installation",
    label: "Old C/O Installation",
    icon: Settings,
  },
  { value: "free-installation", label: "Free Installation", icon: CircleCheck },
  { value: "paid-installation", label: "Paid Installation", icon: DollarSign },
  { value: "warranty", label: "Warranty", icon: ShieldCheck },
  { value: "revenue", label: "Revenue", icon: CircleDollarSign },
  { value: "service", label: "Service", icon: WrenchIcon },
  { value: "warrenty-revenue", label: "Warrenty+Revenue", icon: DollarSign },
  { value: "other", label: "Other", icon: CircleDot },
];

export const MessageTypeOptions = [
  {
    value: "auto_pay_reminder_2",
    label: "Update Complaint",
    icon: MessageCircle,
  },
  {
    value: "complaint_create_template",
    label: "Complaint Create Template",
    icon: MessagesSquare,
  },
];
