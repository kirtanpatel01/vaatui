/**
 * Formats a message timestamp into standard messenger display rules:
 * - If today: "3:14 pm"
 * - If yesterday: "Yesterday"
 * - If within the past 7 days: Day name (e.g. "Monday", "Friday")
 * - If older than 7 days (same year): "12/04" or "12 Apr"
 * - If different year: "12/04/25"
 *
 * Can accept ISO string, Date object, or existing pre-formatted strings directly.
 */
export function formatChatTimestamp(timestamp: string | Date | number): string {
  if (!timestamp) return ""

  // If already a pre-formatted short label like "3:14 pm", "Yesterday", "Mon", return as-is
  if (typeof timestamp === "string") {
    const isIsoOrEpoch =
      timestamp.includes("T") ||
      timestamp.includes("-") ||
      /^\d+$/.test(timestamp)

    if (!isIsoOrEpoch) {
      return timestamp
    }
  }

  const date = new Date(timestamp)
  if (isNaN(date.getTime())) {
    return String(timestamp)
  }

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const msgDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

  const diffTime = today.getTime() - msgDate.getTime()
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24))

  // Today -> "3:14 pm"
  if (diffDays === 0) {
    return date.toLocaleTimeString([], { hour: "numeric", minute: "2-digit", hour12: true })
  }

  // Yesterday
  if (diffDays === 1) {
    return "Yesterday"
  }

  // Within past 6 days -> "Mon", "Tue", etc.
  if (diffDays < 7) {
    return date.toLocaleDateString([], { weekday: "short" })
  }

  // Same year -> "DD/MM" (e.g. 15/10)
  if (now.getFullYear() === date.getFullYear()) {
    return date.toLocaleDateString([], { day: "2-digit", month: "2-digit" })
  }

  // Different year -> "DD/MM/YY"
  return date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}

