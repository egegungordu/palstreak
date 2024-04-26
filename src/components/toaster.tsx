"use client"
 
import { Toaster as Sonner } from "sonner"
 
type ToasterProps = React.ComponentProps<typeof Sonner>

export default function Toaster({ ...props }: ToasterProps) {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        duration: 4000,
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-neutral-500",
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
