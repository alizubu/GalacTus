/**
 * Barrel export — re-assembles DATA from individual files.
 * Existing imports of `@/data/resume` still work via resume.tsx,
 * but prefer importing from the specific file directly:
 *   import { PROFILE }      from "@/data/profile"
 *   import { WORK }         from "@/data/work"
 *   import { EDUCATION }    from "@/data/education"
 *   import { SKILLS }       from "@/data/skills"
 *   import { PROJECTS }     from "@/data/projects"
 *   import { TESTIMONIALS } from "@/data/testimonials"
 *   import { GALLERY }      from "@/data/gallery"
 *   import { CONTACT, NAVBAR } from "@/data/contact"
 */

export { PROFILE }      from "./profile";
export { CONTACT, NAVBAR } from "./contact";
export { WORK }         from "./work";
export { EDUCATION }    from "./education";
export { SKILLS }       from "./skills";
export { PROJECTS }     from "./projects";
export { TESTIMONIALS } from "./testimonials";
export { GALLERY }      from "./gallery";
