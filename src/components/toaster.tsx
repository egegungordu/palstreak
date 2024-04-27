"use client"
 
import { Toaster as Sonner } from "sonner"
 
type ToasterProps = React.ComponentProps<typeof Sonner>

export default function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        duration: 6000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-foreground group-[.toaster]:shadow-lg shadow-shadow text-text border border-border",
          description: "group-[.toast]:text-text-faded",
          actionButton:
            "group-[.toast]:bg-neutral-800 group-[.toast]:text-neutral-200",
          cancelButton:
            "",
        },
      }}
      {...props}
    />
  )
}
