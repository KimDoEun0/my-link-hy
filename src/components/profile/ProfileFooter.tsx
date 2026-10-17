import React from "react";
import { Sparkles } from "lucide-react";

export function ProfileFooter() {
  return (
    <footer className="py-8 text-center space-y-1 text-xs text-muted-foreground border-t border-border/40 bg-card/50">
      <p className="font-semibold text-foreground/80 flex items-center justify-center gap-1">
        <Sparkles className="size-3.5 text-primary" />
        Powered by MyLink
      </p>
      <p className="text-[11px] text-muted-foreground">
        © 2026 MyLink. All rights reserved.
      </p>
    </footer>
  );
}
