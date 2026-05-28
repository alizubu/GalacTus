/**
 * resume.tsx — backward-compatibility shim.
 * All data has been split into individual files under src/data/.
 * This file re-assembles DATA so existing imports keep working.
 *
 * Prefer importing directly from the specific file:
 *   import { PROFILE }      from "@/data/profile"
 *   import { WORK }         from "@/data/work"
 *   import { CONTACT }      from "@/data/contact"
 *   etc.
 */

import { PROFILE }         from "./profile";
import { CONTACT, NAVBAR } from "./contact";
import { WORK }            from "./work";
import { EDUCATION }       from "./education";
import { SKILLS }          from "./skills";
import { PROJECTS }        from "./projects";
import { TESTIMONIALS }    from "./testimonials";
import { GALLERY }         from "./gallery";

export const DATA = {
  ...PROFILE,
  navbar:       NAVBAR,
  contact:      CONTACT,
  work:         WORK,
  education:    EDUCATION,
  skills:       SKILLS,
  projects:     PROJECTS,
  testimonials: TESTIMONIALS,
  gallery:      GALLERY,
} as const;
