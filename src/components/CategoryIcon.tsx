import {
  Briefcase,
  Compass,
  Disc3,
  Drama,
  Headphones,
  HeartPulse,
  Landmark,
  Music2,
  PartyPopper,
  Sparkles,
  Tent,
  UtensilsCrossed,
  Waves,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { EventCategory } from "@/lib/types";

const CATEGORY_ICONS: Record<EventCategory, LucideIcon> = {
  music: Music2,
  business: Briefcase,
  concert: Headphones,
  parties: Disc3,
  "food-drinks": UtensilsCrossed,
  festivals: Tent,
  dance: Sparkles,
  "health-wellness": HeartPulse,
  performances: Drama,
  sports: Waves,
  culture: Landmark,
  adventure: Compass,
};

export function CategoryIcon({
  id,
  className,
  ...props
}: LucideProps & { id: EventCategory }) {
  const Icon = CATEGORY_ICONS[id] ?? PartyPopper;
  return (
    <Icon
      className={className}
      strokeWidth={1.75}
      aria-hidden
      {...props}
    />
  );
}
