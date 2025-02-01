import { cn } from "@/lib/utils";
import { StatusOptions, ComplaintStatusOptions } from "@/lib/otpions";

type StatusOption = {
  value: string;
  color: string;
};

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusColor = (status: string): StatusOption | undefined => {
    const allStatuses = [...StatusOptions, ...ComplaintStatusOptions];
    return allStatuses.find(
      (option) => option.value.toLowerCase() === status.toLowerCase()
    );
  };

  const statusOption = getStatusColor(status);

  if (!statusOption) {
    return null;
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium text-white min-w-28 text-center",
        className
      )}
      style={{
        backgroundColor: `rgba(${statusOption.color})`,
        borderColor: `rgba(${statusOption.color})`,
      }}
    >
      {status}
    </span>
  );
}
