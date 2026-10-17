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

export function InstagramBadgeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <defs>
        <radialGradient id="instaGrad2" cx="30%" cy="107%" r="130%">
          <stop offset="0%" stopColor="#fdf497" />
          <stop offset="5%" stopColor="#fdf497" />
          <stop offset="45%" stopColor="#fd5949" />
          <stop offset="60%" stopColor="#d6249f" />
          <stop offset="90%" stopColor="#285AEB" />
        </radialGradient>
      </defs>
      <rect width="32" height="32" rx="9" fill="url(#instaGrad2)" />
      <rect x="7" y="7" width="18" height="18" rx="5" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="16" cy="16" r="4" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="21.5" cy="10.5" r="1.2" fill="white" />
    </svg>
  );
}

export function YoutubeBadgeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="23" x="0" y="4.5" rx="7" fill="#FF0000" />
      <path d="M13 11.5L21 16L13 20.5V11.5Z" fill="white" />
    </svg>
  );
}

export function VelogBlogIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#20C997" />
      <path d="M9 11L16 23L23 11" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function GithubBadgeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="#181717">
      <path fillRule="evenodd" clipRule="evenodd" d="M16 2C8.268 2 2 8.268 2 16c0 6.186 4.011 11.433 9.574 13.284.7.129.956-.304.956-.675 0-.332-.012-1.213-.019-2.382-3.895.846-4.717-1.877-4.717-1.877-.637-1.618-1.556-2.049-1.556-2.049-1.271-.869.096-.851.096-.851 1.405.099 2.145 1.443 2.145 1.443 1.249 2.14 3.277 1.522 4.075 1.164.127-.905.489-1.523.89-1.873-3.11-.354-6.38-1.555-6.38-6.921 0-1.529.546-2.778 1.442-3.757-.144-.354-.625-1.778.137-3.705 0 0 1.176-.376 3.852 1.436a13.415 13.415 0 013.507-.472c1.19.006 2.388.161 3.508.472 2.674-1.812 3.848-1.436 3.848-1.436.764 1.927.283 3.351.139 3.705.898.979 1.44 2.228 1.44 3.757 0 5.38-3.276 6.563-6.397 6.91.503.433.951 1.289.951 2.598 0 1.876-.017 3.389-.017 3.85 0 .375.253.811.963.673C25.993 27.43 30 22.184 30 16c0-7.732-6.268-14-14-14z" />
    </svg>
  );
}

export function PortfolioGlobeIcon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="14" fill="#EEF2FF" />
      <circle cx="16" cy="16" r="13.5" stroke="#6366F1" strokeWidth="1.5" />
      <ellipse cx="16" cy="16" rx="6.5" ry="13.5" stroke="#6366F1" strokeWidth="1.5" />
      <line x1="2.5" y1="16" x2="29.5" y2="16" stroke="#6366F1" strokeWidth="1.5" />
      <line x1="5.5" y1="9.5" x2="26.5" y2="9.5" stroke="#6366F1" strokeWidth="1.5" />
      <line x1="5.5" y1="22.5" x2="26.5" y2="22.5" stroke="#6366F1" strokeWidth="1.5" />
    </svg>
  );
}

export function Symbol123Icon({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="8" fill="#F3F4F6" />
      <path d="M16 6L24 24H8L16 6Z" fill="#111827" />
      <circle cx="16" cy="18" r="3" fill="white" />
    </svg>
  );
}

export interface IconStyleConfig {
  icon: React.ReactNode;
  bgClass: string;
  colorClass: string;
}

export function getBlockIcon(iconName?: string): IconStyleConfig {
  const name = iconName?.toLowerCase() || "";
  
  if (name.includes("insta")) {
    return {
      icon: <InstagramBadgeIcon className="w-8 h-8" />,
      bgClass: "",
      colorClass: "",
    };
  }
  if (name.includes("youtube") || name.includes("yt")) {
    return {
      icon: <YoutubeBadgeIcon className="w-8 h-8" />,
      bgClass: "",
      colorClass: "",
    };
  }
  if (name.includes("blog") || name.includes("velog")) {
    return {
      icon: <VelogBlogIcon className="w-8 h-8" />,
      bgClass: "",
      colorClass: "",
    };
  }
  if (name.includes("github") || name.includes("git")) {
    return {
      icon: <GithubBadgeIcon className="w-8 h-8" />,
      bgClass: "",
      colorClass: "",
    };
  }
  if (name.includes("portfolio") || name.includes("globe")) {
    return {
      icon: <PortfolioGlobeIcon className="w-8 h-8" />,
      bgClass: "",
      colorClass: "",
    };
  }
  if (name.includes("123") || name.includes("symbol")) {
    return {
      icon: <Symbol123Icon className="w-8 h-8" />,
      bgClass: "",
      colorClass: "",
    };
  }

  switch (name) {
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
    default:
      return {
        icon: <Link2 className="w-5 h-5 stroke-[2]" />,
        bgClass: "bg-[#F2F4F6] text-[#4E5968]",
        colorClass: "text-[#4E5968]",
      };
  }
}
