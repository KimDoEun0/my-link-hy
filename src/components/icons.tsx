import React from "react";
import {
  ShoppingBag,
  FileText,
  ShoppingCart,
  BookOpen,
  Clapperboard,
  Mail,
  MessageCircle,
  Video,
  Layers,
  Globe,
  Sparkles,
  Link2,
  ExternalLink,
  Award,
  Paintbrush,
  Code2,
} from "lucide-react";

export function YoutubeIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function TikTokIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.85.12V9.41a6.33 6.33 0 0 0-.85-.06A6.34 6.34 0 0 0 3 15.69a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.71a8.18 8.18 0 0 0 4.92 1.63v-3.65h-1z" />
    </svg>
  );
}

export function XTwitterIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function ThreadsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm3.3 12.92c-.62.36-1.37.58-2.2.58-2.07 0-3.6-1.53-3.6-3.6s1.53-3.6 3.6-3.6c1.66 0 2.97.98 3.42 2.34h-1.63c-.34-.58-.98-.94-1.79-.94-1.22 0-2.2.98-2.2 2.2s.98 2.2 2.2 2.2c.54 0 1.02-.15 1.41-.41l.79 1.23z" />
    </svg>
  );
}

export function ChzzkIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M2 5a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V5zm5.5 3.5a1.5 1.5 0 0 0-1.5 1.5v4a1.5 1.5 0 0 0 1.5 1.5h9a1.5 1.5 0 0 0 1.5-1.5v-4a1.5 1.5 0 0 0-1.5-1.5h-9z" />
    </svg>
  );
}

export function KakaoIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 3C6.477 3 2 6.477 2 10.768c0 2.766 1.867 5.187 4.673 6.54l-1.187 4.364c-.105.385.334.685.66.47l5.228-3.454c.205.016.413.024.626.024 5.523 0 10-3.477 10-7.768C22 6.477 17.523 3 12 3z" />
    </svg>
  );
}

export interface IconStyleConfig {
  icon: React.ReactNode;
  bgClass: string;
  colorClass: string;
}

export function getBlockIcon(iconName?: string): IconStyleConfig {
  switch (iconName?.toLowerCase()) {
    case "youtube":
      return {
        icon: <YoutubeIcon className="w-5 h-5" />,
        bgClass: "bg-red-50 text-red-600",
        colorClass: "text-red-600",
      };
    case "instagram":
      return {
        icon: <InstagramIcon className="w-5 h-5" />,
        bgClass: "bg-pink-50 text-pink-600",
        colorClass: "text-pink-600",
      };
    case "video":
    case "tiktok":
      return {
        icon: <Video className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-purple-50 text-purple-600",
        colorClass: "text-purple-600",
      };
    case "shoppingbag":
      return {
        icon: <ShoppingBag className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-orange-50 text-orange-600",
        colorClass: "text-orange-600",
      };
    case "shoppingcart":
      return {
        icon: <ShoppingCart className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-amber-50 text-amber-600",
        colorClass: "text-amber-600",
      };
    case "filetext":
      return {
        icon: <FileText className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-blue-50 text-blue-600",
        colorClass: "text-blue-600",
      };
    case "bookopen":
      return {
        icon: <BookOpen className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-emerald-50 text-emerald-600",
        colorClass: "text-emerald-600",
      };
    case "clapperboard":
      return {
        icon: <Clapperboard className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-indigo-50 text-indigo-600",
        colorClass: "text-indigo-600",
      };
    case "mail":
      return {
        icon: <Mail className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-sky-50 text-sky-600",
        colorClass: "text-sky-600",
      };
    case "messagecircle":
      return {
        icon: <MessageCircle className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-yellow-50 text-yellow-700",
        colorClass: "text-yellow-700",
      };
    case "layers":
      return {
        icon: <Layers className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-blue-50 text-blue-600",
        colorClass: "text-blue-600",
      };
    case "paintbrush":
      return {
        icon: <Paintbrush className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-rose-50 text-rose-600",
        colorClass: "text-rose-600",
      };
    case "award":
      return {
        icon: <Award className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-amber-50 text-amber-600",
        colorClass: "text-amber-600",
      };
    case "globe":
      return {
        icon: <Globe className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-slate-100 text-slate-700",
        colorClass: "text-slate-700",
      };
    case "github":
      return {
        icon: <GithubIcon className="w-5 h-5" />,
        bgClass: "bg-slate-100 text-slate-800",
        colorClass: "text-slate-800",
      };
    default:
      return {
        icon: <Link2 className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-[#F2F4F6] text-[#4E5968]",
        colorClass: "text-[#4E5968]",
      };
  }
}
