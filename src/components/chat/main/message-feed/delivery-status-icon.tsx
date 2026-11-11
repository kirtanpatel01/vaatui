import * as React from "react"
import { IconCheck, IconChecks, IconClock } from "@tabler/icons-react"

export interface DeliveryStatusIconProps {
  status?: "sending" | "sent" | "delivered" | "read" | string
}

export function DeliveryStatusIcon({ status }: DeliveryStatusIconProps) {
  if (!status) return null

  switch (status) {
    case "sending":
      return <IconClock className="size-3 text-muted-foreground stroke-[2]" />
    case "sent":
      return <IconCheck className="size-3 text-muted-foreground stroke-[2]" />
    case "delivered":
      return <IconChecks className="size-3 text-muted-foreground stroke-[2]" />
    case "read":
      return <IconChecks className="size-3 text-sky-500 stroke-[2.2]" />
    default:
      return null
  }
}

export default DeliveryStatusIcon

