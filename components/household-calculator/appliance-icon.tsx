"use client";

import React from "react";
import {
  Lightbulb,
  Fan,
  Snowflake,
  Tv,
  Laptop,
  SmartphoneCharging,
  Refrigerator,
  Shirt,
  Droplets,
  Flame,
  Sparkles,
  Sparkle,
  Wifi,
  Cpu,
  Maximize2,
  Minimize2,
  Sun,
  Disc,
  Wind,
  Waves,
  Volume2,
  Monitor,
  MonitorCheck,
  Coffee,
  Utensils,
  RefreshCw,
  CookingPot,
  Box,
  Zap,
  Scissors,
  LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Lightbulb,
  Fan,
  Snowflake,
  Tv,
  Laptop,
  SmartphoneCharging,
  Refrigerator,
  Shirt,
  Droplets,
  Flame,
  Sparkles,
  Sparkle,
  Wifi,
  Cpu,
  Maximize2,
  Minimize2,
  Sun,
  Disc,
  Wind,
  Waves,
  Volume2,
  Monitor,
  MonitorCheck,
  Coffee,
  Utensils,
  RefreshCw,
  CookingPot,
  Box,
  Zap,
  Scissors,
};

interface ApplianceIconProps {
  name?: string;
  className?: string;
}

export function ApplianceIcon({ name, className = "size-4" }: ApplianceIconProps) {
  if (!name || !ICON_MAP[name]) {
    return <Cpu className={className} />;
  }
  const IconComponent = ICON_MAP[name];
  return <IconComponent className={className} />;
}
