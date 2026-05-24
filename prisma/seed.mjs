// Run: node prisma/seed.mjs
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // ── Content (hero, about, contact, settings) ──────────────────────────────
  const content = [
    { key: "hero_name",        value: "Shelvey Dias" },
    { key: "hero_greeting",    value: "Hi, I'm" },
    { key: "hero_tagline",     value: "Corporate Marketing Strategist & Digital Growth Architect" },
    { key: "hero_description", value: "5+ years driving real results for real businesses. No fake promises — only data-backed strategies and measurable growth." },
    { key: "hero_avatar_url",  value: "/assets/images/shelvey.jpeg" },
    { key: "about_bio",        value: "With 5+ years of hands-on experience in corporate marketing and digital growth, I help businesses build powerful online identities and achieve measurable results. From launching targeted ad campaigns to designing high-converting websites, my approach is always data-backed and results-driven. No fake promises — only strategies that work.\n\nI specialize in Meta Ads, Google Ads, SEO, and web development, working with businesses across logistics, manufacturing, and export sectors. Based in Chittagong, Bangladesh, I've delivered 50+ projects with a 100% client satisfaction rate." },
    { key: "contact_email",    value: "shelveyedias@gmail.com" },
    { key: "contact_phone",    value: "+880 1835-412133" },
    { key: "contact_address",  value: "51 Brickfield Road, Patherghata, Chittagong" },
    { key: "contact_linkedin", value: "https://www.linkedin.com/in/shelveydias" },
    { key: "contact_website",  value: "https://www.shelveyswork.com" },
    { key: "site_title",       value: "Shelvey Dias | Digital Marketing Strategist" },
    { key: "site_description", value: "Corporate Marketing Strategist & Digital Growth Architect. 5+ years driving real results with data-backed strategies." },
    { key: "footer_text",      value: "© 2026 Shelvey Dias" },
  ];

  for (const item of content) {
    await db.content.upsert({
      where: { key: item.key },
      update: { value: item.value },
      create: item,
    });
  }
  console.log("✅ Content seeded");

  // ── Work Experience ────────────────────────────────────────────────────────
  await db.experience.deleteMany();
  await db.experience.createMany({
    data: [
      {
        company: "Hirdaramani Bangladesh",
        href: "https://www.hirdaramani.com",
        logo: "",
        title: "R&D Executive",
        location: "Chittagong, Bangladesh",
        startDate: "Jan 2026",
        endDate: "Present",
        description: "Leading research and development initiatives focused on market intelligence, digital innovation, and growth strategy for one of South Asia's largest apparel conglomerates. Conducting in-depth market research to identify emerging trends and business opportunities. Driving digital transformation projects and contributing to long-term organizational growth strategy.",
        badges: ["Current"],
        order: 0,
      },
      {
        company: "Golden Son Ltd.",
        href: "#",
        logo: "",
        title: "Senior Digital Marketing Officer",
        location: "Chittagong, Bangladesh",
        startDate: "2021",
        endDate: "Dec 2025",
        description: "Developed and executed full-funnel digital marketing strategies driving measurable business growth. Managed end-to-end performance marketing campaigns across Meta, Google, and LinkedIn. Oversaw brand positioning, lead generation funnels, and ROI-focused ad spend optimization across multiple product lines.",
        badges: [],
        order: 1,
      },
      {
        company: "Dainik Purbokone",
        href: "#",
        logo: "",
        title: "Executive — Advertisement",
        location: "Chittagong, Bangladesh",
        startDate: "2018",
        endDate: "Nov 2021",
        description: "Managed digital advertising sales and monetization strategies for one of Chittagong's leading news media outlets. Built and maintained relationships with corporate advertisers, driving consistent ad revenue growth. Pioneered digital ad sales channels alongside traditional print advertising to grow overall media monetization.",
        badges: [],
        order: 2,
      },
    ],
  });
  console.log("✅ Work experience seeded");

  // ── Skills ─────────────────────────────────────────────────────────────────
  await db.skill.deleteMany();
  const skills = [
    "Meta Ads Manager", "Google Ads", "LinkedIn Campaign Manager",
    "Email Marketing", "SEO & SEM", "WordPress", "Elementor", "Webflow",
    "HTML & CSS", "Google Analytics", "Google Tag Manager", "HubSpot CRM",
    "Zoho CRM", "LinkedIn Sales Navigator", "Apollo.io", "Hunter.io",
    "Market Research", "Data Scraping", "Brand Strategy", "Canva",
    "Adobe Illustrator", "Content Strategy", "Copywriting",
  ];
  await db.skill.createMany({
    data: skills.map((name, order) => ({ name, order })),
  });
  console.log("✅ Skills seeded");

  // ── Education ──────────────────────────────────────────────────────────────
  await db.education.deleteMany();
  await db.education.createMany({
    data: [
      { school: "East Delta University (EDU)", href: "https://eastdelta.edu.bd", logo: "", degree: "Master of Business Administration (MBA)", startYear: "2021", endYear: "Present", order: 0 },
      { school: "BASIS Institute of Technology & Management (BITM)", href: "https://bitm.org.bd", logo: "", degree: "Professional Web Design Programmer", startYear: "2018", endYear: "2018", order: 1 },
      { school: "Bangladesh Technical Education Board (BTEB)", href: "https://bteb.gov.bd", logo: "", degree: "National Skill Standard Basic — Graphics Design & Multimedia Programming", startYear: "2014", endYear: "2014", order: 2 },
    ],
  });
  console.log("✅ Education seeded");

  // ── Projects / Case Studies ────────────────────────────────────────────────
  await db.project.deleteMany();
  await db.project.createMany({
    data: [
      {
        title: "RNB Shipping — Digital Presence for Freight Leaders",
        href: "#",
        description: "Chittagong-based CNF & Freight company RNB Shipping had zero online presence. Corporate clients couldn't verify them digitally. Built a high-end corporate website featuring service modules and a direct inquiry funnel. Result: Established a professional digital identity for the brand with 100% client satisfaction.",
        imageUrl: "", videoUrl: "",
        tags: ["WordPress", "Elementor", "SEO", "UI/UX Design"],
        dates: "2 Weeks", featured: true, order: 0,
      },
      {
        title: "GSL Export LTD — Bridging Bangladesh & Taiwan",
        href: "#",
        description: "GSL Export LTD, a toy manufacturer, lacked a centralized platform to showcase their global manufacturing standards. Designed and developed a premium product showcase website with multi-region business highlights. Result: Streamlined the international buyer inquiry process and increased brand trust globally.",
        imageUrl: "", videoUrl: "",
        tags: ["WordPress", "Webflow", "UI/UX Design", "Content Strategy"],
        dates: "3 Weeks", featured: true, order: 1,
      },
      {
        title: "Meta Ads Lead Generation — Logistics Client",
        href: "#",
        description: "Designed and managed a full-funnel Meta Ads campaign for a Chittagong-based logistics company. Built custom audiences, A/B tested creatives, and optimized for cost-per-lead. Result: 3x increase in qualified leads within the first 60 days at 40% lower CPL than industry average.",
        imageUrl: "", videoUrl: "",
        tags: ["Meta Ads Manager", "Facebook Pixel", "Canva", "Copywriting"],
        dates: "Ongoing", featured: true, order: 2,
      },
      {
        title: "B2B Lead Scraping & Outreach — Export Sector",
        href: "#",
        description: "Built a targeted B2B lead database for an export company using LinkedIn Sales Navigator, Apollo.io, and Hunter.io. Verified 500+ decision-maker contacts and set up an automated cold email sequence. Result: 18% reply rate and 6 qualified meetings booked in the first campaign cycle.",
        imageUrl: "", videoUrl: "",
        tags: ["LinkedIn Sales Navigator", "Apollo.io", "Hunter.io", "Google Sheets"],
        dates: "1 Week", featured: true, order: 3,
      },
    ],
  });
  console.log("✅ Projects seeded");

  // ── Gallery ────────────────────────────────────────────────────────────────
  await db.galleryItem.deleteMany();
  await db.galleryItem.createMany({
    data: [
      { src: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80", alt: "Social Media Campaign — Product Launch", category: "Social Media", order: 0 },
      { src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80", alt: "Corporate Brand Identity", category: "Branding", order: 1 },
      { src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80", alt: "Instagram Story — Event Promo", category: "Social Media", order: 2 },
      { src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80", alt: "Annual Report Cover Design", category: "Corporate", order: 3 },
      { src: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=80", alt: "LinkedIn Banner — Tech Startup", category: "Social Media", order: 4 },
      { src: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80", alt: "Brand Style Guide", category: "Branding", order: 5 },
      { src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80", alt: "Facebook Ad Creative", category: "Social Media", order: 6 },
      { src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80", alt: "Corporate Presentation Deck", category: "Corporate", order: 7 },
      { src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80", alt: "Instagram Feed — Fashion Brand", category: "Social Media", order: 8 },
      { src: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&q=80", alt: "Logo & Visual Identity", category: "Branding", order: 9 },
      { src: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80", alt: "Twitter/X Campaign Poster", category: "Social Media", order: 10 },
      { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80", alt: "Corporate Event Banner", category: "Corporate", order: 11 },
    ],
  });
  console.log("✅ Gallery seeded");

  // ── Testimonials ───────────────────────────────────────────────────────────
  await db.testimonial.deleteMany();
  await db.testimonial.createMany({
    data: [
      { name: "Sarah Mitchell", role: "CTO, NovaTech Solutions", quote: "Working with Shelvey was an absolute pleasure. He delivered a production-ready campaign weeks ahead of schedule, and the results were exceptional.", stars: 5, order: 0 },
      { name: "James Okafor", role: "Founder, Launchpad Ventures", quote: "Shelvey took our vague marketing idea and turned it into a polished, scalable strategy. His ability to translate business goals into measurable campaigns is rare.", stars: 5, order: 1 },
      { name: "Priya Sharma", role: "Product Manager, Finova", quote: "From day one, Shelvey communicated clearly, hit every milestone, and proactively flagged potential issues before they became problems.", stars: 5, order: 2 },
      { name: "Lucas Fernandez", role: "CEO, Stackbloom", quote: "The Meta Ads campaign Shelvey ran for us reduced our cost-per-lead by over 40%. He didn't just do what we asked — he found and solved problems we didn't even know we had.", stars: 5, order: 3 },
      { name: "Emily Chen", role: "Marketing Director, Pixel & Co.", quote: "I've worked with many marketers who overpromise and underdeliver. Shelvey is the exception — data-driven execution every time.", stars: 5, order: 4 },
      { name: "Marcus Webb", role: "Business Development, CloudBase", quote: "Shelvey integrated seamlessly with our existing team. His SEO work doubled our organic traffic in 3 months, and his reporting was always clear and actionable.", stars: 5, order: 5 },
    ],
  });
  console.log("✅ Testimonials seeded");

  console.log("\n🎉 All done! Database is ready.");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => db.$disconnect());
