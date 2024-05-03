"use client";

import { forwardRef } from "react";
import { useTheme } from "next-themes";
import * as Select from "@radix-ui/react-select";
import { motion, AnimatePresence } from "framer-motion";
import { CheckIcon } from "@radix-ui/react-icons";
import { LuMoon, LuSettings, LuSun } from "react-icons/lu";
import { cn } from "@/lib/utils";
import Tooltip from "./tooltip";

const THEMES = [
  { value: "dark", Icon: LuMoon },
  { value: "light", Icon: LuSun },
  { value: "system", Icon: LuSettings },
];

type Side = Select.SelectContentProps["side"];

const ThemeSwitcher = forwardRef(function ThemeSelector(
  {
    children,
    className,
    side = "right",
    withTooltip = false
  }: { children?: React.ReactNode; className?: string; side?: Side, withTooltip?: boolean },
  ref,
) {
  const { setTheme, theme } = useTheme();

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
  };

  return (
    <Select.Root onValueChange={handleThemeChange} defaultValue={theme}>
      <Tooltip content="Change theme" asChild tooltipClassName={cn("hidden",{
        "block": withTooltip
        })}>
      <Select.Trigger
        ref={ref as any}
        className={cn(
          "leading-none capitalize rounded-md flex items-center relative select-none outline-none hover:bg-background-button-hover transition-colors w-full",
          className,
        )}
        aria-label="Theme"
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {THEMES.filter(({ value }) => value === theme).map(
            ({ Icon, value }) => (
              <motion.div
                key={value}
                initial={{ opacity: 0, rotate: -280 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 280 }}
              >
                {theme === value && (
                  <Icon className="w-4 h-4" />
                )}
              </motion.div>
            ),
          )}
        </AnimatePresence>
        {children}
      </Select.Trigger>
      </Tooltip>
      <Select.Portal>
        <Select.Content
          position="popper"
          side={side}
          sideOffset={8}
          align="start"
          alignOffset={-4}
          className="overflow-hidden bg-foreground rounded-lg shadow shadow-shadow z-10"
        >
          <Select.Viewport className="p-[5px]">
            <Select.Group>
              {THEMES.map(({ value }) => {
                return (
                  <Select.Item
                    value={value}
                    key={value}
                    className="leading-none capitalize rounded-md flex items-center text-xs gap-2 h-7 px-2 min-w-20 relative select-none hover:bg-background-button-hover outline-none"
                  >
                    <Select.ItemText>{value}</Select.ItemText>
                    <Select.ItemIndicator>
                      {value === theme && <CheckIcon />}
                    </Select.ItemIndicator>
                  </Select.Item>
                );
              })}
            </Select.Group>
          </Select.Viewport>
        </Select.Content>
      </Select.Portal>
    </Select.Root>
  );
});

export default ThemeSwitcher;
