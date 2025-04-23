import React from "react"
import Link from "next/link"
import { Button as ShadcnButton, buttonVariants } from "@/components/ui/button"
import { Icon, IconName } from "@/components/icons"
import { cn } from "@/lib/utils"
import { type VariantProps } from "class-variance-authority"

// shadcn/uiの元のButtonPropsの代わりに独自に定義
type ButtonBaseProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  VariantProps<typeof buttonVariants>

interface CustomButtonProps extends Omit<ButtonBaseProps, "asChild"> {
  icon?: IconName
  fullWidth?: boolean
  className?: string
  children: React.ReactNode
}

export function Button({ 
  icon, 
  fullWidth, 
  className, 
  children,
  ...props 
}: CustomButtonProps) {
  return (
    <ShadcnButton 
      className={cn(
        fullWidth && "w-full",
        icon && "flex items-center gap-2",
        className
      )} 
      {...props}
    >
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </ShadcnButton>
  )
}

export function LinkButton({
  href,
  icon,
  fullWidth,
  className,
  children,
  ...props
}: CustomButtonProps & { href: string }) {
  return (
    <Link 
      href={href} 
      className={cn(
        buttonVariants({ 
          variant: props.variant, 
          size: props.size 
        }),
        fullWidth && "w-full",
        icon && "flex items-center gap-2",
        className
      )}
    >
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </Link>
  )
} 