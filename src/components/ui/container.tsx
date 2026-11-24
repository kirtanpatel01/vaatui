import * as React from "react"
import { cn } from "cn"

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: React.ElementType
}

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ as: Component = "div", className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn("mx-auto w-full max-w-5xl px-4 sm:px-6", className)}
        {...props}
      >
        {children}
      </Component>
    )
  }
)

Container.displayName = "Container"

export default Container
