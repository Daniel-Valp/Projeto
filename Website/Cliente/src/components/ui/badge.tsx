import { cn } from "@/lib/utils";
import React from "react";

const variantClasses = {
  default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200",
  success: "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-200",
  destructive: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-200",
  outline: "border border-gray-300 text-gray-800 dark:border-gray-600 dark:text-gray-100",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "destructive" | "outline";
}


export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "px-2 py-1 rounded-full text-xs font-medium",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
