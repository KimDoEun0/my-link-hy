"use client"

import * as React from "react"
import { Avatar as AvatarPrimitive } from "@base-ui/react/avatar"
import { cn } from "@/lib/utils"

function Avatar({
  className,
  size = "default",
  ...props
}: AvatarPrimitive.Root.Props & {
  size?: "sm" | "default" | "lg" | "xl" | "2xl"
}) {
  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      data-size={size}
      className={cn(
        "group/avatar relative flex size-10 shrink-0 rounded-full select-none border border-border/60 shadow-sm",
        "data-[size=sm]:size-8",
        "data-[size=default]:size-11",
        "data-[size=lg]:size-14",
        "data-[size=xl]:size-20",
        "data-[size=2xl]:size-24",
        className
      )}
      {...props}
    />
  )
}

function AvatarImage({ className, ...props }: AvatarPrimitive.Image.Props) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  ...props
}: AvatarPrimitive.Fallback.Props) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-secondary font-semibold text-muted-foreground",
        "group-data-[size=sm]/avatar:text-xs",
        "group-data-[size=default]/avatar:text-sm",
        "group-data-[size=lg]/avatar:text-base",
        "group-data-[size=xl]/avatar:text-xl",
        "group-data-[size=2xl]/avatar:text-2xl",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute right-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2.5",
        "group-data-[size=default]/avatar:size-3",
        "group-data-[size=lg]/avatar:size-4",
        "group-data-[size=xl]/avatar:size-5",
        "group-data-[size=2xl]/avatar:size-6",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  AvatarBadge,
}
