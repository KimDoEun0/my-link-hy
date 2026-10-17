import React from "react";
import { SocialLinks } from "@/types/mylink";
import {
  YoutubeIcon,
  InstagramIcon,
  TikTokIcon,
  XTwitterIcon,
  GithubIcon,
  ThreadsIcon,
  ChzzkIcon,
} from "@/components/icons";

export interface SocialIconBarProps {
  socials?: SocialLinks;
}

export function SocialIconBar({ socials = {} }: SocialIconBarProps) {
  const socialList = [
    {
      id: "youtube",
      url: socials.youtube,
      label: "YouTube",
      icon: <YoutubeIcon className="size-5 text-red-600" />,
    },
    {
      id: "instagram",
      url: socials.instagram,
      label: "Instagram",
      icon: <InstagramIcon className="size-5 text-pink-600" />,
    },
    {
      id: "tiktok",
      url: socials.tiktok,
      label: "TikTok",
      icon: <TikTokIcon className="size-5 text-foreground" />,
    },
    {
      id: "twitter",
      url: socials.twitter,
      label: "X (Twitter)",
      icon: <XTwitterIcon className="size-5 text-foreground" />,
    },
    {
      id: "github",
      url: socials.github,
      label: "GitHub",
      icon: <GithubIcon className="size-5 text-foreground" />,
    },
    {
      id: "threads",
      url: socials.threads,
      label: "Threads",
      icon: <ThreadsIcon className="size-5 text-foreground" />,
    },
    {
      id: "chzzk",
      url: socials.chzzk,
      label: "Chzzk",
      icon: <ChzzkIcon className="size-5 text-emerald-600" />,
    },
    {
      id: "email",
      url: socials.email
        ? socials.email.startsWith("mailto:")
          ? socials.email
          : `mailto:${socials.email}`
        : undefined,
      label: "Email",
      icon: (
        <svg
          className="size-5 text-primary"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
      ),
    },
  ].filter((s) => Boolean(s.url));

  if (socialList.length === 0) return null;

  return (
    <div className="flex items-center justify-center gap-2.5 pt-2 flex-wrap">
      {socialList.map((social) => (
        <a
          key={social.id}
          href={social.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={social.label}
          className="size-10 rounded-full bg-card shadow-xs border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary active:scale-90 transition-all cursor-pointer"
        >
          {social.icon}
        </a>
      ))}
    </div>
  );
}
