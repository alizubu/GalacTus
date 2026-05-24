import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import BackgroundGradient from "@/components/BackgroundGradient";

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="light">
      <TooltipProvider delayDuration={0}>
        <BackgroundGradient />
        <div className="absolute inset-0 top-0 left-0 right-0 h-[100px] overflow-hidden z-0">
          <FlickeringGrid
            className="h-full w-full"
            squareSize={2}
            gridGap={2}
            style={{
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto py-10 pb-28 sm:py-20 sm:pb-28 px-4 sm:px-5">
          {children}
        </div>
        <Navbar />
      </TooltipProvider>
    </ThemeProvider>
  );
}
