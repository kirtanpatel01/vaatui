import * as React from "react"
import { cn } from "cn"

export interface LogoProps extends React.SVGProps<SVGSVGElement> {
  size?: number
}

export function Logo({ className, size = 26, ...props }: LogoProps) {
  const maskId = React.useId()

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
      {...props}
    >
      <defs>
        <mask id={maskId}>
          {/* Solid white preserves the outer dialogue shape */}
          <rect width="32" height="32" fill="white" />
          {/* Black cuts out the letter 'V' completely into negative space */}
          <path
            d="M10 10.5L16 20.5L22 10.5"
            stroke="black"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </mask>
      </defs>

      {/* Outer Dialogue Bubble with bottom center apex tail */}
      <path
        mask={`url(#${maskId})`}
        d="M6 5C4.34315 5 3 6.34315 3 8V20C3 21.6569 4.34315 23 6 23H10.5L14.7 27.8C15.4 28.5 16.6 28.5 17.3 27.8L21.5 23H26C27.6569 23 29 21.6569 29 20V8C29 6.34315 27.6569 5 26 5H6Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default Logo
