"use client";

import * as _Tabs from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";
import { Children } from "react";

function TabTrigger({ name, value }: { name: string; value: string }) {
  return (
    <_Tabs.Trigger
      className="grow flex-1 data-[state='active']:bg-foreground data-[state='active']:shadow data-[state='active']:shadow-shadow data-[state='active']:text-text font-medium text-text-faded flex items-center justify-center leading-none outline-none h-7 px-6 rounded-lg transition-all"
      value={value}
    >
      {name}
    </_Tabs.Trigger>
  );
}

export default function Tabs({
  tabNames,
  defaultValue,
  children,
}: {
  tabNames: string[];
  defaultValue: string;
  children?: React.ReactNode;
}) {
  if (tabNames.length !== Children.count(children)) {
    throw new Error(
      "The number of tab names must match the number of children",
    );
  }

  return (
    <_Tabs.Root className="flex flex-col" defaultValue={defaultValue}>
      <_Tabs.List className="shrink-0 flex p-1 bg-foreground-dark gap-1 rounded-xl max-w-fit mb-4">
        {tabNames.map((name, index) => (
          <TabTrigger key={index} name={name} value={name} />
        ))}
      </_Tabs.List>
      <AnimatePresence mode="sync">
        {children &&
          Children.map(children, (child, index) => (
            <_Tabs.Content value={tabNames[index]}>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {child}
              </motion.div>
            </_Tabs.Content>
          ))}
      </AnimatePresence>
    </_Tabs.Root>
  );
}
