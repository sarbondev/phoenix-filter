import {
  ShieldCheck,
  Award,
  Users2,
  Zap,
  HeartHandshake,
  TrendingUp,
  ClipboardList,
  Wrench,
  Factory,
  CheckCircle2,
  Droplets,
  Wind,
  Gauge,
  Leaf,
  Sparkles,
  Truck,
  Headphones,
  Star,
  Package,
  Users,
  Building2,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  ShieldCheck,
  Award,
  Users2,
  Users,
  Zap,
  HeartHandshake,
  TrendingUp,
  ClipboardList,
  Wrench,
  Factory,
  CheckCircle2,
  Droplets,
  Wind,
  Gauge,
  Leaf,
  Sparkles,
  Truck,
  Headphones,
  Star,
  Package,
  Building2,
};

/**
 * Resolves a string icon name (lucide-react identifier) to a component.
 * Falls back to ShieldCheck if the name is not in the map.
 */
export function resolveIcon(name: string | undefined): LucideIcon {
  if (!name) return ShieldCheck;
  return ICON_MAP[name] ?? ShieldCheck;
}
