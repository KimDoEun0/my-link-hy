import React, { useState } from "react";
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface ProfileHeaderProps {
  displayName: string;
  bio: string;
  avatarUrl?: string;
  badge?: string;
}

export function ProfileHeader({
  displayName,
  bio,
  avatarUrl,
  badge,
}: ProfileHeaderProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <section className="flex flex-col items-center text-center space-y-3 pt-2">
      {/* 원형 아바타 (88x88) - shadcn/ui Avatar 기반 */}
      <div className="relative">
        <Avatar className="size-[88px] ring-4 ring-white shadow-md bg-secondary overflow-hidden flex items-center justify-center border-0">
          {avatarUrl && !imgError ? (
            <AvatarImage
              src={avatarUrl}
              alt={`${displayName} 프로필`}
              className="size-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : null}
          <AvatarFallback className="size-full bg-secondary text-muted-foreground flex items-center justify-center">
            <User className="size-10 text-muted-foreground" />
          </AvatarFallback>
        </Avatar>
      </div>

      {/* 표시 이름 & 역할 뱃지 - shadcn/ui Badge 기반 */}
      <div className="space-y-1">
        <div className="flex items-center justify-center gap-2">
          <h1 className="text-[22px] font-bold tracking-tight text-foreground">
            {displayName}
          </h1>
          {badge && (
            <Badge
              variant="default"
              className="rounded-full bg-accent text-accent-foreground px-2.5 py-0.5 text-[12px] font-semibold tracking-tight border-0"
            >
              {badge}
            </Badge>
          )}
        </div>

        {/* 한 줄 소개(Bio) */}
        <p className="text-[14px] text-muted-foreground leading-relaxed whitespace-pre-line max-w-xs mx-auto pt-1 break-keep">
          {bio}
        </p>
      </div>
    </section>
  );
}
