/**
 * Fetches portfolio data from MongoDB (Prisma).
 * Falls back to static DATA from resume.tsx if DB is unavailable.
 */

import { DATA } from "@/data/resume";

// ── Types ────────────────────────────────────────────────────────────────────

export type WorkItem = {
  id: string;
  company: string;
  href: string;
  logo: string;
  title: string;
  location: string;
  startDate: string;
  endDate: string;
  description: string;
  badges: string[];
  order: number;
};

export type ProjectItem = {
  id: string;
  title: string;
  href: string;
  description: string;
  imageUrl: string;
  videoUrl: string;
  tags: string[];
  dates: string;
  featured: boolean;
  order: number;
};

export type SkillItem = {
  id: string;
  name: string;
  order: number;
};

export type EducationItem = {
  id: string;
  school: string;
  href: string;
  logo: string;
  degree: string;
  startYear: string;
  endYear: string;
  order: number;
};

export type GalleryItem = {
  id: string;
  src: string;
  alt: string;
  category: string;
  order: number;
};

export type TestimonialItem = {
  id: string;
  name: string;
  role: string;
  quote: string;
  stars: number;
  order: number;
};

export type ContentMap = Record<string, string>;

// ── Fetch functions ───────────────────────────────────────────────────────────

export async function getContent(): Promise<ContentMap> {
  try {
    const { db } = await import("@/lib/db");
    const items = await db.content.findMany();
    const map: ContentMap = {};
    items.forEach((i) => (map[i.key] = i.value));
    return map;
  } catch {
    // Fallback to static DATA
    return {
      hero_name: DATA.name,
      hero_greeting: "Hi, I'm",
      hero_tagline: DATA.description,
      hero_description:
        "5+ years driving real results for real businesses. No fake promises — only data-backed strategies and measurable growth.",
      hero_avatar_url: DATA.avatarUrl,
      about_bio: DATA.summary,
      contact_email: DATA.contact.email,
      contact_phone: DATA.contact.tel,
      contact_address: "51 Brickfield Road, Patherghata, Chittagong",
      contact_linkedin: "https://www.linkedin.com/in/shelveydias",
      contact_website: "https://www.shelveyswork.com",
    };
  }
}

export async function getWork(): Promise<WorkItem[]> {
  try {
    const { db } = await import("@/lib/db");
    return await db.experience.findMany({ orderBy: { order: "asc" } });
  } catch {
    return DATA.work.map((w, i) => ({
      id: String(i),
      company: w.company,
      href: w.href,
      logo: w.logoUrl ?? "",
      title: w.title,
      location: w.location,
      startDate: w.start,
      endDate: w.end ?? "Present",
      description: w.description,
      badges: [...(w.badges as string[])],
      order: i,
    }));
  }
}

export async function getProjects(): Promise<ProjectItem[]> {
  try {
    const { db } = await import("@/lib/db");
    return await db.project.findMany({ orderBy: { order: "asc" } });
  } catch {
    return DATA.projects.map((p, i) => ({
      id: String(i),
      title: p.title,
      href: p.href,
      description: p.description,
      imageUrl: p.image ?? "",
      videoUrl: p.video ?? "",
      tags: [...(p.technologies as string[])],
      dates: p.dates,
      featured: true,
      order: i,
    }));
  }
}

export async function getSkills(): Promise<SkillItem[]> {
  try {
    const { db } = await import("@/lib/db");
    return await db.skill.findMany({ orderBy: { order: "asc" } });
  } catch {
    return DATA.skills.map((s, i) => ({ id: String(i), name: s.name, order: i }));
  }
}

export async function getEducation(): Promise<EducationItem[]> {
  try {
    const { db } = await import("@/lib/db");
    return await db.education.findMany({ orderBy: { order: "asc" } });
  } catch {
    return DATA.education.map((e, i) => ({
      id: String(i),
      school: e.school as string,
      href: e.href as string,
      logo: (e as { logoUrl?: string }).logoUrl ?? "",
      degree: e.degree as string,
      startYear: e.start as string,
      endYear: e.end as string,
      order: i,
    }));
  }
}

export async function getGallery(): Promise<GalleryItem[]> {
  try {
    const { db } = await import("@/lib/db");
    return await db.galleryItem.findMany({ orderBy: { order: "asc" } });
  } catch {
    return DATA.gallery.map((g, i) => ({
      id: String(i),
      src: g.src,
      alt: g.alt,
      category: g.category,
      order: i,
    }));
  }
}

export async function getTestimonials(): Promise<TestimonialItem[]> {
  try {
    const { db } = await import("@/lib/db");
    return await db.testimonial.findMany({ orderBy: { order: "asc" } });
  } catch {
    return DATA.testimonials.map((t, i) => ({
      id: String(i),
      name: t.name,
      role: t.role,
      quote: t.quote,
      stars: t.stars,
      order: i,
    }));
  }
}
