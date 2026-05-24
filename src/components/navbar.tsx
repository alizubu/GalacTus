import { Dock, DockIcon } from "@/components/magicui/dock";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Tooltip,
  TooltipArrow,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DEFAULT_NAVBAR_ICONS, getIconDef } from "@/lib/navbar-icons";

type NavbarRow = {
  id: string;
  iconName: string;
  label: string;
  href: string;
  displayOrder: number;
  visible: boolean;
  isThemeToggle: boolean;
  isHome: boolean;
};

async function getNavbarIcons(): Promise<NavbarRow[]> {
  try {
    const { db } = await import("@/lib/db");
    const rows = await db.navbarIcon.findMany({
      where: { visible: true },
      orderBy: { displayOrder: "asc" },
    });
    if (rows.length === 0) return DEFAULT_NAVBAR_ICONS.map((r, i) => ({ ...r, id: String(i) }));
    return rows as NavbarRow[];
  } catch {
    // Fallback to static defaults if DB is unavailable
    return DEFAULT_NAVBAR_ICONS.map((r, i) => ({ ...r, id: String(i) }));
  }
}

export default async function Navbar() {
  const icons = await getNavbarIcons();

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-4 z-30">
      <Dock className="z-50 pointer-events-auto relative h-14 p-2 w-fit mx-auto flex gap-2 border bg-card/90 backdrop-blur-3xl shadow-[0_0_10px_3px] shadow-primary/5">
        {icons.map((item) => {
          const def = getIconDef(item.iconName);
          if (!def) return null;

          // Theme toggle is rendered specially
          if (item.isThemeToggle) {
            return (
              <Tooltip key={item.id}>
                <TooltipTrigger asChild>
                  <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                    <ModeToggle className="size-full cursor-pointer" />
                  </DockIcon>
                </TooltipTrigger>
                <TooltipContent
                  side="top"
                  sideOffset={8}
                  className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
                >
                  <p>{item.label}</p>
                  <TooltipArrow className="fill-primary" />
                </TooltipContent>
              </Tooltip>
            );
          }

          const IconComponent = def.component;
          const isExternal = item.href.startsWith("http");

          return (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <a
                  href={item.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                >
                  <DockIcon className="rounded-3xl cursor-pointer size-full bg-background p-0 text-muted-foreground hover:text-foreground hover:bg-muted backdrop-blur-3xl border border-border transition-colors">
                    <IconComponent className="size-full rounded-sm overflow-hidden object-contain" />
                  </DockIcon>
                </a>
              </TooltipTrigger>
              <TooltipContent
                side="top"
                sideOffset={8}
                className="rounded-xl bg-primary text-primary-foreground px-4 py-2 text-sm shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
              >
                <p>{item.label}</p>
                <TooltipArrow className="fill-primary" />
              </TooltipContent>
            </Tooltip>
          );
        })}
      </Dock>
    </div>
  );
}
