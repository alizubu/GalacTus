/**
 * Seed script — run once to populate DB with existing resume data
 * Usage: npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
 * Or add to package.json: "prisma": { "seed": "ts-node prisma/seed.ts" }
 * Then run: npx prisma db seed
 */

import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Hero / About content
  const content = [
    { key: "hero_name", value: "Shelvey Dias" },
    { key: "hero_greeting", value: "Hi, I'm" },
    { key: "hero_tagline", value: "Corporate Marketing Strategist & Digital Growth Architect" },
    { key: "hero_description", value: "5+ years driving real results for real businesses. No fake promises — only data-backed strategies and measurable growth." },
    { key: "hero_avatar_url", value: "/me.png" },
    { key: "about_bio", value: "With 5+ years of hands-on experience in corporate marketing and digital growth, I help businesses build powerful online identities and achieve measurable results.\n\nI specialize in Meta Ads, Google Ads, SEO, and web development, working with businesses across logistics, manufacturing, and export sectors. Based in Chittagong, Bangladesh, I've delivered 50+ projects with a 100% client satisfaction rate." },
    { key: "contact_email", value: "shelveyedias@gmail.com" },
    { key: "contact_phone", value: "+880 1835-412133" },
    { key: "contact_address", value: "51 Brickfield Road, Patherghata, Chittagong" },
    { key: "contact_linkedin", value: "https://www.linkedin.com/in/shelveydias" },
    { key: "contact_website", value: "https://www.shelveyswork.com" },
    { key: "site_title", value: "Shelvey Dias | Digital Marketing Strategist" },
    { key: "site_description", value: "Corporate Marketing Strategist & Digital Growth Architect. 5+ years driving real results with data-backed strategies." },
  ];

  for (const item of content) {
    await db.content.upsert({ where: { key: item.key }, update: { value: item.value }, create: item });
  }

  // Work experience
  const work = [
    { company: "Hirdaramani Bangladesh", href: "https://www.hirdaramani.com", title: "R&D Executive", location: "Chittagong, Bangladesh", startDate: "Jan 2026", endDate: "Present", description: "Leading research and development initiatives focused on market intelligence, digital innovation, and growth strategy.", badges: ["Current"], order: 0 },
    { company: "Golden Son Ltd.", href: "#", title: "Senior Digital Marketing Officer", location: "Chittagong, Bangladesh", startDate: "2021", endDate: "Dec 2025", description: "Developed and executed full-funnel digital marketing strategies driving measurable business growth.", badges: [], order: 1 },
    { company: "Dainik Purbokone", href: "#", title: "Executive — Advertisement", location: "Chittagong, Bangladesh", startDate: "2018", endDate: "Nov 2021", description: "Managed digital advertising sales and monetization strategies for one of Chittagong's leading news media outlets.", badges: [], order: 2 },
  ];
  await db.experience.deleteMany();
  for (const item of work) await db.experience.create({ data: item });

  // Skills
  const skills = ["Meta Ads Manager","Google Ads","LinkedIn Campaign Manager","Email Marketing","SEO & SEM","WordPress","Elementor","Webflow","HTML & CSS","Google Analytics","Google Tag Manager","HubSpot CRM","Zoho CRM","LinkedIn Sales Navigator","Apollo.io","Hunter.io","Market Research","Data Scraping","Brand Strategy","Canva","Adobe Illustrator","Content Strategy","Copywriting"];
  await db.skill.deleteMany();
  for (let i = 0; i < skills.length; i++) await db.skill.create({ data: { name: skills[i], order: i } });

  // Education
  const edu = [
    { school: "East Delta University (EDU)", href: "https://eastdelta.edu.bd", degree: "Master of Business Administration (MBA)", startYear: "2021", endYear: "Present", order: 0 },
    { school: "BASIS Institute of Technology & Management (BITM)", href: "https://bitm.org.bd", degree: "Professional Web Design Programmer", startYear: "2018", endYear: "2018", order: 1 },
    { school: "Bangladesh Technical Education Board (BTEB)", href: "https://bteb.gov.bd", degree: "National Skill Standard Basic — Graphics Design & Multimedia Programming", startYear: "2014", endYear: "2014", order: 2 },
  ];
  await db.education.deleteMany();
  for (const item of edu) await db.education.create({ data: item });

  console.log("✅ Seed complete!");
}

main().catch(console.error).finally(() => db.$disconnect());
