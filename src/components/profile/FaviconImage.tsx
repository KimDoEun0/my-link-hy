"use client";

import { useState } from "react";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

// URL에서 도메인을 추출해 Google 파비콘 API 주소를 생성
export function getFaviconUrl(url?: string, size = 64): string | null {
  if (!url) return null;
  try {
    const { hostname } = new URL(url);
    if (!hostname) return null;
    return `https://www.google.com/s2/favicons?domain=${hostname}&sz=${size}`;
  } catch {
    return null;
  }
}

interface FaviconImageProps {
  url?: string;
  className?: string;
}

// Google 파비콘 API로 사이트 아이콘을 표시하고, 실패 시 기본 링크 아이콘으로 대체
export function FaviconImage({ url, className }: FaviconImageProps) {
  const src = getFaviconUrl(url);
  const [failedSrc, setFailedSrc] = useState<string | null>(null);

  if (!src || failedSrc === src) {
    return <Link2 className={cn("w-5 h-5 stroke-[2] text-[#4E5968]", className)} />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      width={32}
      height={32}
      loading="lazy"
      onError={() => setFailedSrc(src)}
      className={cn("w-8 h-8 rounded-md object-contain", className)}
    />
  );
}
