/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import Link from "next/link";
import ContactSection from "@/components/section/contact-section";
import GallerySection from "@/components/section/gallery-section";
import ProjectsSection from "@/components/section/projects-section";
import TestimonialsSection from "@/components/section/testimonials-section";
import AboutStats from "@/components/section/about-stats";
import { ArrowUpRight } from "lucide-react";
import { FadeUp, BlurClear, StaggerContainer, StaggerItem } from "@/components/AnimatedText";
import { SectionTitle } from "@/components/SectionTitle";
import WorkSectionDynamic from "@/components/section/work-section";
import SkillsSectionDynamic from "@/components/section/skills-section";
import HeroText from "@/components/HeroText";
import AnimatedAvatar from "@/components/AnimatedAvatar";
import {
  getContent,
  getWork,
  getProjects,
  getSkills,
  getEducation,
  getGallery,
  getTestimonials,
} from "@/lib/portfolio-data";

export const dynamic = "force-dynamic";

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

  // [N5] DB-driven about stats
  const aboutStats = [
    { value: parseInt(content.about_stat_years ?? "5"),        suffix: "+", label: "Years Experience" },
    { value: parseInt(content.about_stat_projects ?? "50"),    suffix: "+", label: "Projects Delivered" },
    { value: parseInt(content.about_stat_satisfaction ?? "100"), suffix: "%", label: "Client Satisfaction" },
    { value: parseInt(content.about_stat_industries ?? "3"),   suffix: "",  label: "Industries Served" },
  ];

  return (
    <main className="min-h-dvh flex flex-col gap-10 sm:gap-14 relative">

      {/* ── Hero ── */}
      <section id="hero">
        <div className="mx-auto w-full space-y-6">
          <div className="gap-4 flex flex-col sm:flex-row sm:items-start justify-between">
            <BlurFade delay={0.05} className="flex sm:order-2 sm:ml-4">
              <AnimatedAvatar src={avatarUrl} name={name} initials={initials} />
            </BlurFade>
            <div className="gap-2 flex flex-col sm:order-1 flex-1 min-w-0">
              <HeroText name={`Hi, I'm ${firstName}`} tagline={tagline} description={description} />
            </div>
          </div>
        </div>
      </section>

      {/* ── About ── */}
      <section id="about">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="About" />
          <FadeUp delay={0.1}>
            <div
              className="prose max-w-full font-sans leading-relaxed text-foreground/80 dark:prose-invert [&>p]:text-justify"
              dangerouslySetInnerHTML={{ __html: bio }}
            />
          </FadeUp>
          <AboutStats stats={aboutStats} />
        </div>
      </section>

      {/* ── Work Experience ── */}
      <section id="work">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="Work Experience" />
          <FadeUp delay={0.1}>
            <WorkSectionDynamic items={work} />
          </FadeUp>
        </div>
      </section>

      {/* ── Education ── */}
      <section id="education">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="Education" />
          <StaggerContainer className="flex flex-col gap-2.5 sm:gap-3" staggerDelay={0.1}>
            {education.map((edu) => (
              <StaggerItem key={edu.id}>
                <Link
                  href={edu.href || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-x-3 p-3 sm:p-4 rounded-2xl border bg-card/50
                             hover:bg-card hover:bg-[#fafafa] dark:hover:bg-card hover:shadow-sm transition-all duration-200 group"
                >
                  {edu.logo ? (
                    <img
                      src={edu.logo}
                      alt={edu.school}
                      className="size-11 p-1 border border-[#ede9fe] rounded-[10px] bg-[#f5f3ff] dark:bg-card object-contain shrink-0"
                    />
                  ) : (
                    <div
                      className="size-11 rounded-[10px] shrink-0 flex items-center justify-center text-sm font-bold"
                      style={{
                        background: "linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)",
                        border: "1px solid #ede9fe",
                        color: "#7c3aed",
                      }}
                    >
                      {edu.school.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm leading-none flex items-center gap-2">
                      {edu.school}
                      <ArrowUpRight className="h-3 w-3 text-muted-foreground opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 font-medium">{edu.degree}</div>
                  </div>
                  <span
                    className="text-xs tabular-nums shrink-0 px-2.5 py-1 rounded-full"
                    style={{
                      background: "#f3f4f6",
                      color: "#6b7280",
                      fontSize: "11px",
                    }}
                  >
                    {edu.startYear}–{edu.endYear}
                  </span>
                </Link>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* ── Skills ── */}
      <section id="skills">
        <div className="flex min-h-0 flex-col gap-y-5">
          <SectionTitle title="Skills" />
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
      <section id="gallery">
        <FadeUp delay={0.05}>
          <GallerySection items={gallery} />
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
