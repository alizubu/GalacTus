/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import TestimonialsSection from "@/components/section/testimonials-section";
import AboutStats from "@/components/section/about-stats";
import SkillsSection from "@/components/section/skills-section";
import { ArrowUpRight } from "lucide-react";
import { FadeUp, WordReveal, BlurClear, StaggerContainer, StaggerItem } from "@/components/AnimatedText";
import { SectionTitle } from "@/components/SectionTitle";

const BLUR_FADE_DELAY = 0.04;

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-10 sm:gap-14 relative">
      <section id="hero">
        <div className="mx-auto w-full space-y-6">
          <div className="gap-4 flex flex-col sm:flex-row sm:items-start justify-between">
            {/* Avatar — top on mobile */}
            <BlurFade delay={BLUR_FADE_DELAY} className="flex sm:order-2 sm:ml-4">
              <Avatar className="size-24 sm:size-36 border-2 rounded-full shadow-xl ring-4 ring-muted shrink-0">
                <AvatarImage alt={DATA.name} src={DATA.avatarUrl} />
                <AvatarFallback>{DATA.initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
            <div className="gap-2 flex flex-col sm:order-1 flex-1 min-w-0">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
              />
              <BlurFadeText
                className="text-muted-foreground text-base sm:text-lg"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
              <BlurFadeText
                className="text-muted-foreground/70 text-sm"
                delay={BLUR_FADE_DELAY * 2}
                text="5+ years driving real results for real businesses. No fake promises — only data-backed strategies and measurable growth."
              />
            </div>
          </div>
        </div>
      </section>
      <section id="about">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="About" subtitle="Who I Am" />
          <FadeUp delay={0.1}>
            <div className="prose max-w-full font-sans leading-relaxed text-foreground/80 dark:prose-invert [&>p]:text-justify">
              <Markdown>{DATA.summary}</Markdown>
            </div>
          </FadeUp>
          <AboutStats />
        </div>
      </section>
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="Work Experience" subtitle="Career Timeline" />
          <FadeUp delay={0.1}>
            <WorkSection />
          </FadeUp>
        </div>
      </section>
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="Education" subtitle="Academic Background" />
          <StaggerContainer className="flex flex-col gap-2.5 sm:gap-3" staggerDelay={0.1}>
            {DATA.education.map((edu) => {
              const school = edu.school as string;
              const degree = edu.degree as string;
              const logoUrl = (edu as { logoUrl?: string }).logoUrl ?? "";
              const href = edu.href as string;
              const start = edu.start as string;
              const end = edu.end as string;
              return (
                <StaggerItem key={school}>
                  <Link
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-x-3 p-3 sm:p-4 rounded-2xl border bg-card/50
                               hover:bg-card hover:shadow-sm transition-all duration-300 group"
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={school}
                        className="size-10 p-1.5 border rounded-xl bg-card object-contain shrink-0 ring-2 ring-border/40"
                      />
                    ) : (
                      <div className="size-10 rounded-xl border bg-muted shrink-0 ring-2 ring-border/40 flex items-center justify-center text-xs font-bold text-muted-foreground">
                        {school.slice(0, 2).toUpperCase()}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm leading-none flex items-center gap-2">
                        {school}
                        <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1 text-justify">
                        {degree}
                      </div>
                    </div>
                    <div className="text-xs tabular-nums text-muted-foreground/60 shrink-0 text-right">
                      {start}–{end}
                    </div>
                  </Link>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="Skills" subtitle="Technical Expertise" />
          <SkillsSection />
        </div>
      </section>
      <section id="projects">
        <FadeUp>
          <ProjectsSection />
        </FadeUp>
      </section>
      <section id="hackathons">
        <FadeUp delay={0.05}>
          <HackathonsSection />
        </FadeUp>
      </section>
      <section id="testimonials">
        <FadeUp delay={0.05}>
          <TestimonialsSection />
        </FadeUp>
      </section>
      <section id="contact">
        <BlurClear delay={0.05}>
          <ContactSection />
        </BlurClear>
      </section>
    </main>
  );
}
