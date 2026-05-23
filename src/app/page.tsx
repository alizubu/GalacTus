/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import HackathonsSection from "@/components/section/hackathons-section";
import ProjectsSection from "@/components/section/projects-section";
import TestimonialsSection from "@/components/section/testimonials-section";
import AboutStats from "@/components/section/about-stats";
import { ArrowUpRight } from "lucide-react";
import { FadeUp, BlurClear, StaggerContainer, StaggerItem } from "@/components/AnimatedText";
import { SectionTitle } from "@/components/SectionTitle";
import WorkSectionDynamic from "@/components/section/work-section";
import SkillsSectionDynamic from "@/components/section/skills-section";
import {
  getContent,
  getWork,
  getProjects,
  getSkills,
  getEducation,
  getGallery,
  getTestimonials,
} from "@/lib/portfolio-data";

const BLUR_FADE_DELAY = 0.04;

export const revalidate = 60; // ISR — revalidate every 60s

export default async function Page() {
  const [content, work, projects, skills, education, gallery, testimonials] =
    await Promise.all([
      getContent(),
      getWork(),
      getProjects(),
      getSkills(),
      getEducation(),
      getGallery(),
      getTestimonials(),
    ]);

  const name = content.hero_name ?? "Shelvey";
  const firstName = name.split(" ")[0];
  const tagline = content.hero_tagline ?? "";
  const description = content.hero_description ?? "";
  const avatarUrl = content.hero_avatar_url ?? "/assets/images/shelvey.jpeg";
  const bio = content.about_bio ?? "";
  const initials = name.split(" ").filter(Boolean).map((n: string) => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <main className="min-h-dvh flex flex-col gap-10 sm:gap-14 relative">

      {/* ── Hero ── */}
      <section id="hero">
        <div className="mx-auto w-full space-y-6">
          <div className="gap-4 flex flex-col sm:flex-row sm:items-start justify-between">
            <BlurFade delay={BLUR_FADE_DELAY} className="flex sm:order-2 sm:ml-4">
              <Avatar className="size-24 sm:size-36 border-2 rounded-full shadow-xl ring-4 ring-muted shrink-0">
                <AvatarImage alt={name} src={avatarUrl} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </BlurFade>
            <div className="gap-2 flex flex-col sm:order-1 flex-1 min-w-0">
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl font-bold tracking-tighter sm:text-4xl lg:text-5xl"
                yOffset={8}
                text={`Hi, I'm ${firstName}`}
              />
              <BlurFadeText
                className="text-muted-foreground text-base sm:text-lg"
                delay={BLUR_FADE_DELAY}
                text={tagline}
              />
              <BlurFadeText
                className="text-muted-foreground/70 text-sm"
                delay={BLUR_FADE_DELAY * 2}
                text={description}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="About" subtitle="Who I Am" />
          <FadeUp delay={0.1}>
            <div className="prose max-w-full font-sans leading-relaxed text-foreground/80 dark:prose-invert [&>p]:text-justify">
              <Markdown>{bio}</Markdown>
            </div>
          </FadeUp>
          <AboutStats />
        </div>
      </section>

      {/* ── Work Experience ── */}
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="Work Experience" subtitle="Career Timeline" />
          <FadeUp delay={0.1}>
            <WorkSectionDynamic items={work} />
          </FadeUp>
        </div>
      </section>

      {/* ── Education ── */}
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="Education" subtitle="Academic Background" />
          <StaggerContainer className="flex flex-col gap-2.5 sm:gap-3" staggerDelay={0.1}>
            {education.map((edu) => (
              <StaggerItem key={edu.id}>
                <Link
                  href={edu.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-x-3 p-3 sm:p-4 rounded-2xl border bg-card/50
                             hover:bg-card hover:shadow-sm transition-all duration-300 group"
                >
                  {edu.logo ? (
                    <img
                      src={edu.logo}
                      alt={edu.school}
                      className="size-10 p-1.5 border rounded-xl bg-card object-contain shrink-0 ring-2 ring-border/40"
                    />
                  ) : (
                    <div className="size-10 rounded-xl border bg-muted shrink-0 ring-2 ring-border/40 flex items-center justify-center text-xs font-bold text-muted-foreground">
                      {edu.school.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm leading-none flex items-center gap-2">
                      {edu.school}
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{edu.degree}</div>
                  </div>
                  <div className="text-xs tabular-nums text-muted-foreground/60 shrink-0 text-right">
                    {edu.startYear}–{edu.endYear}
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="Skills" subtitle="Technical Expertise" />
          <SkillsSectionDynamic items={skills} />
        </div>
      </section>

      {/* ── Projects ── */}
      <section id="projects">
        <FadeUp>
          <ProjectsSection items={projects} />
        </FadeUp>
      </section>

      {/* ── Gallery ── */}
      <section id="hackathons">
        <FadeUp delay={0.05}>
          <HackathonsSection items={gallery} />
        </FadeUp>
      </section>

      {/* ── Testimonials ── */}
      <section id="testimonials">
        <FadeUp delay={0.05}>
          <TestimonialsSection items={testimonials} />
        </FadeUp>
      </section>

      {/* ── Contact ── */}
      <section id="contact">
        <BlurClear delay={0.05}>
          <ContactSection content={content} />
        </BlurClear>
      </section>

    </main>
  );
}
