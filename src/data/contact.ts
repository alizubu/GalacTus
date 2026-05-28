import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";

/** Contact info, social links, and navbar defaults */
export const CONTACT = {
  email: "shelveyedias@gmail.com",
  tel:   "+880 1835-412133",
  social: {
    LinkedIn: {
      name:   "LinkedIn",
      url:    "https://www.linkedin.com/in/shelveydias",
      icon:   Icons.linkedin,
      navbar: true,
    },
    Website: {
      name:   "Website",
      url:    "https://www.shelveyswork.com",
      icon:   Icons.globe,
      navbar: true,
    },
    Email: {
      name:   "Email",
      url:    "mailto:shelveyedias@gmail.com",
      icon:   Icons.email,
      navbar: false,
    },
  },
} as const;

/** Default navbar items (fallback when DB is empty) */
export const NAVBAR = [
  { href: "/", icon: HomeIcon, label: "Home" },
] as const;
