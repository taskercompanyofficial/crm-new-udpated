export interface User {
  id: number;
  unique_id: string;
  full_name: string;
  username: string;
  contact_email: string;
  phone_number: string;
  skype: string;
  whats_app: string;
  age: string;
  gender: string;
  dob: string;
  country: string;
  province: string;
  city: string;
  details: string;
  language: string;
  time_zone: string;
  role: string;
  profile_image: string;
  email_verified_at: string;
  isVerified: string;
  status: string;
  notification: string;
  rate: string;
  domain_id: string;
  token: string;
}
export type workersType = {
  id: string;
  username: string;
  full_name: string;
  father_name: string;
  contact_email: string;
  phone_number: string;
  secondary_phone_number: string;
  branch_id: string;
  salary: string;
  full_address: string;
  state: string;
  city: string;
  zip_code: string;
  cnic_front: string;
  cnic_back: string;
  account_maintenance_certificate: string;
  blank_check: string;
  reference_1_name: string;
  reference_1_number: string;
  reference_1_cnic: string;
  reference_2_name: string;
  reference_2_number: string;
  reference_2_cnic: string;
  profile_image: string;
  role: string;
  status: string;
  is_verified: string;
  notification: string;
  has_crm_access: string;
};
export type BranchesType = {
  id: string;
  unique_id: string;
  name: string;
  branch_contact_no: string;
  branch_address: string;
  open: number;
  closed: number;
  others: number;
  status: string;
  created_at: string;
  updated_at: string;
};
export type BrandsType = {
  id: string;
  unique_id: string;
  name: string;
  log: strig;
  open: number;
  closed: number;
  others: number;
  status: string;
  created_at: string;
  updated_at: string;
};
export type CategoriesType = {
  id: string;
  unique_id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string;
  image: string;
  hero_image: string;
  open: number;
  closed: number;
  others: number;
  status: string;
  created_at: string;
  updated_at: string;
};
export type ServicesType = {
  id: string;
  unique_id: string;
  name: string;
  slug: string;
  description: string;
  keywords: string;
  icon: string;
  status: string;
  color: string;
  created_at: string;
  updated_at: string;
};
export type WorkersType = {
  id: string;
  unique_id: string;
  full_name: string;
  father_name: string;
  contact_email: string;
  phone_number: string;
  secondary_phone_number: string;
  password: string;
  full_address: string;
  state: string;
  city: string;
  salary: string;
  branch_id: number;
  cnic_front: string | null;
  cnic_back: string | null;
  account_maintanance_certificate: string | null;
  blank_check: string | null;
  reference_1_name: string | null;
  reference_1_number: string | null;
  reference_1_cnic: string | null;
  reference_2_name: string | null;
  reference_2_number: string | null;
  reference_2_cnic: string | null;
  profile_image: string | null;
  role: string;
  status: string;
  is_verified: string;
  notification: string;
  created_at: string;
  updated_at: string;
};
export type SubServicesType = {
  id: string;
  unique_id: string;
  category_id: string;
  service_id: string;
  category_name: string;
  service_name: string;
  name: string;
  slug: string;
  price: string;
  discount: string;
  description: string;
  keywords: string;
  image: string;
  hero_image: string;
  open: number;
  closed: number;
  others: number;
  status: string;
  created_at: string;
  updated_at: string;
};
export type ComplaintsType = {
  id: id;
  brand_complaint_no: string;
  applicant_name: string;

  applicant_phone: string;
  applicant_whatsapp: string;
  applicant_adress: string;
  complain_num: string;
  description: string;
  brand_id: string;
  branch_id: string;
  extra_numbers: string | null;
  reference_by: string | null;
  dealer: string | null;
  extra: string | null;
  company_complaint_no: string | null;
  product: string;
  model: string;
  serial_number_ind: string | null;
  serial_number_oud: string | null;
  mq_nmb: string | null;
  product_type: string | null;
  p_date: string | null;
  complete_date: string | null;
  amount: number | null;
  technician: string | null;
  complaint_type: string;
  provided_services: string;
  warranty_type: string;
  working_details: string | null;
  happy_call_remarks: string | null;
  status: string;
  files: any;
  send_message_to_customer: boolean;
  message_type: string;
  comments_for_technician: string | null;
  created_at: string;
  updated_at: string;
  call_status: string;
};
export type ComplaintDetailsType = {
  id: number;
  complaint_id: number;
};
export type DomainsType = {
  id: string;
  unique_id: string;
  value: string;
  clicks: number;
  conversions: number;
  cvr: number;
  progress: number;
  chart_data: array;
  status: string;
  created_at: string;
  updated_at: string;
};
export type dataTypeIds = {
  id: string;
  value: string;
  label: string;
  image: string;
};
export type TrackerType = {
  id: string;
  unique_id: string;
  name: string;
  param: string;
  value: string;
  clicks: number;
  conversions: number;
  cvr: number;
  status: string;
  visiblity: string;
  created_at: string;
  updated_at: string;
};
export type OfferType = {
  id: string;
  unique_id: string;
  name: string;
  title: string;
  description: string;
  keywords: string;
  offer_name: string;
  image: string;
  age: string;
  rate: string;
  encryption: string;
  network_id: string;
  domain_id: string;
  category_id: string;
  urls: [];
  countries: string;
  proxy: string;
  clicks: string;
  conversions: string;
  cvr: string;
  url: string;
  status: string;
  appliableFor: string;
};
export type UserType = {
  id: string;
  unique_id: string;
  name: string;
  profile_pic: string;
  username: string;
  email: string;
  phone: string;
  age: string;
  rate: string;
  clicks: string;
  conversions: string;
  cvr: string;
  role: string;
  manager_username: string;
  admin_username: string;
  created_at: string;
  updated_at: string;
  status: string;
};

type CountryType = {
  id: number;
  name: string;
  unique_id: string;
  iso2: string;
};
type SettingsType = {
  id: number;
  key: string;
  value: string;
  description: string;
  status: string;
  created_at: string;
  updated_at: string;
};
type ClickType = {
  id: number;
  created_at: string;
  updated_at: string;
  click_id: number;
  offer_id: string;
  network_id: string;
  tracker_id: string;
  domain_id: string;
  user_id: string;
  manager_id: any;
  admin_id: any;
  ip_address: string;
  source_id: string;
  country: string;
  city: string;
  device: string;
  device_version: any;
  browser: string;
  version: any;
  user_agent: any;
  status: string;
};
interface MetaDataType {
  title: string;
  description: string;
  image: string;
  keywords: string;
  author: string;
  canonical: string;
}
type FetchResult<T> = {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
};

export type AttendanceType = {
  id: number;
  staff_id: string;
  check_in: string;
  check_in_location: string;
  check_in_longitude: string;
  check_in_latitude: string;
  check_out: string;
  check_out_location: string;
  check_out_longitude: string;
  check_out_latitude: string;
  total_hours: string;
  status: string;
};

export interface DataTableAdvancedFilterField<TData>
  extends DataTableFilterField<TData> {
  type: ColumnType;
}
import type { ColumnSort, Row } from "@tanstack/react-table";

import type { DataTableConfig } from "@/config/data-table";
import type { filterSchema } from "@/lib/parsers";

export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type StringKeyOf<TData> = Extract<keyof TData, string>;

export interface SearchParams {
  [key: string]: string | string[] | undefined;
}

export interface Option {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  count?: number;
}

export interface ExtendedColumnSort<TData> extends Omit<ColumnSort, "id"> {
  id: StringKeyOf<TData>;
}

export type ExtendedSortingState<TData> = ExtendedColumnSort<TData>[];

export type ColumnType = DataTableConfig["columnTypes"][number];

export type FilterOperator = DataTableConfig["globalOperators"][number];

export type JoinOperator = DataTableConfig["joinOperators"][number]["value"];

export interface DataTableFilterField<TData> {
  id: StringKeyOf<TData>;
  label: string;
  placeholder?: string;
  options?: Option[];
}

export interface DataTableAdvancedFilterField<TData>
  extends DataTableFilterField<TData> {
  type: ColumnType;
}

export type Filter<TData> = Prettify<
  Omit<z.infer<typeof filterSchema>, "id"> & {
    id: StringKeyOf<TData>;
  }
>;

export interface DataTableRowAction<TData> {
  row: Row<TData>;
  type: "update" | "delete";
}

export interface QueryBuilderOpts {
  where?: SQL;
  orderBy?: SQL;
  distinct?: boolean;
  nullish?: boolean;
}
interface InventoryType {
  id: string;
  name: string;
  image: string;
  quantity_type: string;
  quantity: string;
  model: string;
  price: string;
  description: string;
}
interface ReviewType {
  id: number;
  rating: number;
  reason: string;
  comment: string;
  complaint_id: number;
  created_at: string;
  updated_at: string;
  user: User;
}