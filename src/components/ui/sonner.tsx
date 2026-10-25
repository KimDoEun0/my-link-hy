"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        // 가독성: 흰 배경 + 진한 제목(15px, 굵게) + 충분히 진한 설명(13px), 그림자로 배경과 구분
        classNames: {
          toast:
            "cn-toast !bg-white !border !border-[#E5E8EB] !shadow-[0_8px_24px_rgba(0,0,0,0.12)] !rounded-xl !px-4 !py-3.5 !gap-3",
          title: "!text-[15px] !font-semibold !leading-snug !text-[#191F28]",
          description: "!text-[13px] !leading-snug !text-[#4E5968] !break-all !mt-0.5",
          icon: "!size-5",
          success: "[&_[data-icon]]:!text-[#03B26C]",
          error: "[&_[data-icon]]:!text-destructive",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
