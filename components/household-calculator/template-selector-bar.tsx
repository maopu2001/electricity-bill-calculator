"use client";

import { HOUSEHOLD_TEMPLATES } from "@/lib/appliance-templates";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Trash2, RotateCcw } from "lucide-react";

interface TemplateSelectorBarProps {
  onSelectTemplate: (templateId: string) => void;
  onClearAll: () => void;
  onResetDefault: () => void;
  activeItemCount: number;
}

export function TemplateSelectorBar({
  onSelectTemplate,
  onClearAll,
  onResetDefault,
  activeItemCount,
}: TemplateSelectorBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-2xl border border-border/60 bg-card/60 backdrop-blur-xs">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground whitespace-nowrap mr-1">
          <Sparkles className="size-3.5 text-primary" />
          <span>Quick Starts:</span>
        </div>
        {HOUSEHOLD_TEMPLATES.map((tmpl) => (
          <button
            key={tmpl.id}
            type="button"
            onClick={() => onSelectTemplate(tmpl.id)}
            className="group inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl border border-border/60 bg-background/80 hover:bg-primary/10 hover:border-primary/40 hover:text-primary transition-all duration-150 cursor-pointer whitespace-nowrap active:scale-[0.98]"
            title={tmpl.description}
          >
            <span>{tmpl.name}</span>
            {tmpl.badge && tmpl.id !== "empty" && (
              <Badge
                variant="secondary"
                className="text-[10px] px-1.5 py-0 h-4 font-normal bg-muted group-hover:bg-primary/20 group-hover:text-primary"
              >
                {tmpl.badge}
              </Badge>
            )}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-end gap-2 shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-border/40">
        <Button
          variant="outline"
          size="sm"
          onClick={onResetDefault}
          className="h-8 text-xs text-muted-foreground hover:text-foreground gap-1.5 px-2.5 rounded-xl cursor-pointer"
        >
          <RotateCcw className="size-3.5" />
          <span>Reset Defaults</span>
        </Button>
        {activeItemCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={onClearAll}
            className="h-8 text-xs text-destructive/80 hover:text-destructive hover:bg-destructive/10 gap-1.5 px-2.5 rounded-xl cursor-pointer"
          >
            <Trash2 className="size-3.5" />
            <span>Clear All</span>
          </Button>
        )}
      </div>
    </div>
  );
}
