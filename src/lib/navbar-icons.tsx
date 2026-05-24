/**
 * Central registry of all navbar icon definitions.
 * Used by both the admin panel and the live navbar component.
 */
import {
  Home,
  Globe,
  Mail,
  Youtube,
  type LucideIcon,
} from "lucide-react";
import { Icons } from "@/components/icons";

export type NavbarIconDef = {
  name: string;          // unique key stored in DB
  label: string;         // tooltip / display label
  defaultHref: string;
  component: LucideIcon | React.FC<React.SVGProps<SVGSVGElement>>;
  isThemeToggle?: boolean;
  isHome?: boolean;
  locked?: boolean;      // cannot be removed
};

export const ICON_REGISTRY: NavbarIconDef[] = [
  {
    name: "home",
    label: "Home",
    defaultHref: "/",
    component: Home as unknown as LucideIcon,
    isHome: true,
    locked: true,
  },
  {
    name: "linkedin",
    label: "LinkedIn",
    defaultHref: "https://linkedin.com/in/",
    component: Icons.linkedin as unknown as LucideIcon,
  },
  {
    name: "github",
    label: "GitHub",
    defaultHref: "https://github.com/",
    component: Icons.github as unknown as LucideIcon,
  },
  {
    name: "twitter",
    label: "Twitter / X",
    defaultHref: "https://x.com/",
    component: Icons.x as unknown as LucideIcon,
  },
  {
    name: "globe",
    label: "Website",
    defaultHref: "https://",
    component: Globe as unknown as LucideIcon,
  },
  {
    name: "email",
    label: "Email",
    defaultHref: "mailto:",
    component: Icons.email as unknown as LucideIcon,
  },
  {
    name: "youtube",
    label: "YouTube",
    defaultHref: "https://youtube.com/",
    component: Youtube as unknown as LucideIcon,
  },
  {
    name: "whatsapp",
    label: "WhatsApp",
    defaultHref: "https://wa.me/",
    component: Icons.whatsapp as unknown as LucideIcon,
  },
  {
    name: "theme",
    label: "Theme",
    defaultHref: "#",
    component: Home as unknown as LucideIcon, // placeholder, rendered specially
    isThemeToggle: true,
    locked: true,
  },
];

export function getIconDef(name: string): NavbarIconDef | undefined {
  return ICON_REGISTRY.find((i) => i.name === name);
}

/** Default set of icons to seed when DB is empty */
export const DEFAULT_NAVBAR_ICONS = [
  { iconName: "home",     label: "Home",     href: "/",                                  displayOrder: 0, visible: true, isThemeToggle: false, isHome: true  },
  { iconName: "linkedin", label: "LinkedIn", href: "https://www.linkedin.com/in/shelveydias", displayOrder: 1, visible: true, isThemeToggle: false, isHome: false },
  { iconName: "globe",    label: "Website",  href: "https://www.shelveyswork.com",        displayOrder: 2, visible: true, isThemeToggle: false, isHome: false },
  { iconName: "theme",    label: "Theme",    href: "#",                                  displayOrder: 3, visible: true, isThemeToggle: true,  isHome: false },
];
