import * as React from "react"
import { IconUsers, IconSpeakerphone } from "@tabler/icons-react"
import { cva, type VariantProps } from "class-variance-authority"
import { type UserProfile, type ContactType } from "@/data/mock-contacts"
import { cn } from "cn"

export const chatAvatarVariants = cva(
  "relative flex shrink-0 items-center justify-center rounded-full bg-muted text-foreground font-semibold select-none overflow-hidden ring-1 ring-border/40",
  {
    variants: {
      size: {
        xs: "size-6 text-[10px]",
        sm: "size-8 text-xs",
        default: "size-10 text-sm",
        md: "size-12 text-base",
        lg: "size-16 text-lg",
        xl: "size-20 text-xl font-bold border-2 border-border/80 shadow-xs",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

const statusDotVariants = cva(
  "absolute rounded-full bg-online ring-2 ring-background shrink-0",
  {
    variants: {
      size: {
        xs: "size-1.5 -bottom-0.5 -right-0.5",
        sm: "size-2.5 bottom-0 right-0",
        default: "size-3 bottom-0 right-0",
        md: "size-3.5 bottom-0.5 right-0.5",
        lg: "size-4 bottom-1 right-1",
        xl: "size-4.5 bottom-1 right-1",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
)

export interface ChatAvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatAvatarVariants> {
  contact?: Partial<UserProfile>
  src?: string
  alt?: string
  name?: string
  type?: ContactType
  isOnline?: boolean
  showStatus?: boolean
}

export function ChatAvatar({
  contact,
  src,
  alt,
  name,
  type,
  isOnline,
  showStatus = false,
  size = "default",
  className,
  ...props
}: ChatAvatarProps) {
  const effectiveSrc = src ?? contact?.avatar
  const effectiveName = name ?? contact?.name ?? ""
  const effectiveType = type ?? contact?.type ?? "direct"
  const effectiveOnline = isOnline ?? contact?.isOnline ?? false

  const initial = effectiveName.trim().charAt(0).toUpperCase() || "?"

  return (
    <div className="relative inline-block shrink-0">
      <div
        className={cn(chatAvatarVariants({ size }), className)}
        {...props}
      >
        {effectiveType === "group" ? (
          <IconUsers className={cn(size === "xl" ? "size-9 stroke-[1.5]" : size === "xs" || size === "sm" ? "size-4" : "size-5", "text-muted-foreground")} />
        ) : effectiveType === "announcement" ? (
          <IconSpeakerphone className={cn(size === "xl" ? "size-9 stroke-[1.5]" : size === "xs" || size === "sm" ? "size-4" : "size-5", "text-muted-foreground")} />
        ) : effectiveSrc ? (
          <img
            src={effectiveSrc}
            alt={alt ?? effectiveName}
            className="size-full rounded-full object-cover"
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>

      {showStatus && effectiveType === "direct" && effectiveOnline && (
        <span
          className={cn(statusDotVariants({ size }))}
          title="Online"
          aria-label="Online status"
        />
      )}
    </div>
  )
}

export default ChatAvatar
