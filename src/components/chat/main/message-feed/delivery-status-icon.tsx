import * as React from "react"
import { IconCheck, IconChecks, IconClock, IconAlertCircle } from "@tabler/icons-react"
import { cn } from "cn"

export interface DeliveryStatusIconProps {
  status?: "sending" | "sent" | "delivered" | "read" | "failed" | string
  className?: string
}

export function DeliveryStatusIcon({ status, className }: DeliveryStatusIconProps) {
  if (!status) return null

  switch (status) {
    case "sending":
      return <IconClock className={cn("size-3 text-muted-foreground stroke-[2]", className)} />
    case "sent":
      return <IconCheck className={cn("size-3 text-muted-foreground stroke-[2]", className)} />
    case "delivered":
      return <IconChecks className={cn("size-3 text-muted-foreground stroke-[2]", className)} />
    case "read":
      return <IconChecks className={cn("size-3 text-sky-500 stroke-[2.2]", className)} />
    case "failed":
      return <IconAlertCircle className={cn("size-3 text-destructive stroke-[2]", className)} />
    default:
      return null
  }
}

export default DeliveryStatusIcon
