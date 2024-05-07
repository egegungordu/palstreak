"use client";

import { cn } from "@/lib/utils";
import * as _Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Children, forwardRef } from "react";

const Tabs = _Tabs.Root;

const TabsList = forwardRef<
  React.ElementRef<typeof _Tabs.List>,
  React.ComponentPropsWithoutRef<typeof _Tabs.List>
>(({ className, ...props }, ref) => (
  <_Tabs.List
    ref={ref}
    className={cn(
      "shrink-0 flex p-1 bg-foreground-dark gap-1 rounded-xl mb-2 w-full",
      className,
    )}
    {...props}
  />
));

TabsList.displayName = _Tabs.List.displayName;

const TabsTrigger = forwardRef<
  React.ElementRef<typeof _Tabs.Trigger>,
  React.ComponentPropsWithoutRef<typeof _Tabs.Trigger>
>(({ className, ...props }, ref) => (
  <_Tabs.Trigger
    ref={ref}
    className={cn(
      "grow flex-1 data-[state='active']:bg-foreground data-[state='active']:shadow data-[state='active']:shadow-shadow data-[state='active']:text-text font-medium text-text-faded flex items-center justify-center leading-none outline-none h-7 px-8 rounded-lg transition-all",
      className,
    )}
    {...props}
  />
));
TabsTrigger.displayName = _Tabs.Trigger.displayName;

const TabsContent = forwardRef<
  React.ElementRef<typeof _Tabs.Content>,
  React.ComponentPropsWithoutRef<typeof _Tabs.Content>
>(({ className, ...props }, ref) => (
  <_Tabs.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    )}
    {...props}
  >
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={className}
    >
      {props.children}
    </motion.div>
  </_Tabs.Content>
));
TabsContent.displayName = _Tabs.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
