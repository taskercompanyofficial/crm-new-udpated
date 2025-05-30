"use client"

import * as React from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { DatePicker } from "antd"
import { CalendarOutlined } from "@ant-design/icons"
import dayjs from "dayjs"

const { RangePicker } = DatePicker

interface DateRangePickerProps {
  /**
   * The selected date range.
   * @default undefined
   * @type {from: Date, to: Date}
   * @example { from: new Date(), to: new Date() }
   */
  dateRange?: {
    from: Date;
    to: Date;
  }

  /**
   * The number of days to display in the date range picker.
   * @default undefined
   * @type number
   * @example 7
   */
  dayCount?: number

  /**
   * The placeholder text of the calendar trigger button.
   * @default "Pick a date"
   * @type string | undefined
   */
  placeholder?: string

  /**
   * The class name of the calendar trigger button.
   * @default undefined
   * @type string
   */
  className?: string
}

export function DateRangePicker({
  dateRange,
  dayCount,
  placeholder = "Pick a date",
  className,
}: DateRangePickerProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [dates, setDates] = React.useState<[Date | null, Date | null]>([
    dateRange?.from || null,
    dateRange?.to || null
  ])

  // Update query string
  React.useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (dates[0]) {
      newSearchParams.set("from", format(dates[0], "yyyy-MM-dd"))
    } else {
      newSearchParams.delete("from")
    }

    if (dates[1]) {
      newSearchParams.set("to", format(dates[1], "yyyy-MM-dd"))
    } else {
      newSearchParams.delete("to")
    }

    router.push(`${pathname}?${newSearchParams.toString()}`, {
      scroll: false,
    })
  }, [dates, pathname, router, searchParams])

  return (
    <div className="grid gap-2">
      <RangePicker
        className={className}
        value={dates[0] && dates[1] ? [dayjs(dates[0]), dayjs(dates[1])] : null}
        onChange={(dates) => {
          setDates([
            dates?.[0]?.toDate() || null,
            dates?.[1]?.toDate() || null
          ])
        }}
        placeholder={[placeholder, placeholder]}
        suffixIcon={<CalendarOutlined />}
        format="MMM DD, YYYY"
        allowClear={true}
        style={{ width: '100%', borderRadius: '9999px' }}
      />
    </div>
  )
}
