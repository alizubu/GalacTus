import { Icons } from "@/components/icons";
import { HomeIcon } from "lucide-react";

/**
 * Static fallback data — used when DB is unavailable.
 * Keep this in sync with the live database content.
 * Primary source of truth is MongoDB; this is the safety net.
 */
export const DATA = {
  name: "Shelvey Dias",
  initials: "SD",
  url: "https://www.shelveyswork.com",
  location: "Chittagong, Bangladesh",
  locationLink: "https://maps.app.goo.gl/chittagong",
  description: "Corporate Marketing Strategist & Digital Growth Expert",
  summary:
    "With 5+ years of hands-on experience in corporate marketing and digital growth, I help businesses build powerful online identities and achieve measurable results. From launching targeted ad campaigns to designing high-converting websites, my approach is always data-backed and results-driven. No fake promises — only strategies that work.\n\nI specialize in Meta Ads, Google Ads, SEO, and web development, working with businesses across logistics, manufacturing, and export sectors. Based in Chittagong, Bangladesh, I've delivered 50+ projects with a 100% client satisfaction rate.",
  avatarUrl: "/assets/images/shelvey.jpeg",

  skills: [
    { name: "Meta Ads Manager" },
    { name: "Google Ads" },
    { name: "LinkedIn Campaign Manager" },
    { name: "Email Marketing" },
    { name: "SEO & SEM" },
    { name: "WordPress" },
    { name: "Elementor" },
    { name: "Webflow" },
    { name: "HTML & CSS" },
    { name: "Google Analytics" },
    { name: "Google Tag Manager" },
    { name: "HubSpot CRM" },
    { name: "Zoho CRM" },
    { name: "LinkedIn Sales Navigator" },
    { name: "Apollo.io" },
    { name: "Hunter.io" },
    { name: "Market Research" },
    { name: "Data Scraping" },
    { name: "Brand Strategy" },
    { name: "Canva" },
    { name: "Adobe Illustrator" },
    { name: "Content Strategy" },
    { name: "Copywriting" },
  ],

  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
  ],

  contact: {
    email: "shelveyedias@gmail.com",
    tel: "+880 1835-412133",
    social: {
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/shelveydias",
        icon: Icons.linkedin,
        navbar: true,
      },
      Website: {
        name: "Website",
        url: "https://www.shelveyswork.com",
        icon: Icons.globe,
        navbar: true,
      },
      Email: {
        name: "Email",
        url: "mailto:shelveyedias@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Hirdaramani Bangladesh",
      href: "https://www.hirdaramani.com",
      badges: ["Current"],
      location: "Chittagong, Bangladesh",
      title: "R&D Executive",
      logoUrl: "",
      start: "Jan 2026",
      end: "Present",
      description:
        "Leading research and development initiatives focused on market intelligence, digital innovation, and growth strategy for one of South Asia's largest apparel conglomerates. Conducting in-depth market research to identify emerging trends and business opportunities. Driving digital transformation projects and contributing to long-term organizational growth strategy.",
    },
    {
      company: "Golden Son Ltd.",
      href: "#",
      badges: [],
      location: "Chittagong, Bangladesh",
      title: "Senior Digital Marketing Officer",
      logoUrl: "",
      start: "2021",
      end: "Dec 2025",
      description:
        "Developed and executed full-funnel digital marketing strategies driving measurable business growth. Managed end-to-end performance marketing campaigns across Meta, Google, and LinkedIn. Oversaw brand positioning, lead generation funnels, and ROI-focused ad spend optimization across multiple product lines.",
    },
    {
      company: "Dainik Purbokone",
      href: "#",
      badges: [],
      location: "Chittagong, Bangladesh",
      title: "Executive — Advertisement",
      logoUrl: "",
      start: "2018",
      end: "Nov 2021",
      description:
        "Managed digital advertising sales and monetization strategies for one of Chittagong's leading news media outlets. Built and maintained relationships with corporate advertisers, driving consistent ad revenue growth. Pioneered digital ad sales channels alongside traditional print advertising to grow overall media monetization.",
    },
  ],

  education: [
    {
      school: "East Delta University (EDU)",
      href: "https://eastdelta.edu.bd",
      degree: "Master of Business Administration (MBA)",
      logoUrl: "",
      start: "2021",
      end: "Present",
    },
    {
      school: "BASIS Institute of Technology & Management (BITM)",
      href: "https://bitm.org.bd",
      degree: "Professional Web Design Programmer",
      logoUrl: "",
      start: "2018",
      end: "2018",
    },
    {
      school: "Bangladesh Technical Education Board (BTEB)",
      href: "https://bteb.gov.bd",
      degree: "National Skill Standard Basic — Graphics Design & Multimedia Programming",
      logoUrl: "",
      start: "2014",
      end: "2014",
    },
  ],

  projects: [
    {
      title: "RNB Shipping — Digital Presence for Freight Leaders",
      href: "#",
      dates: "2 Weeks",
      active: true,
      description:
        "Chittagong-based CNF & Freight company RNB Shipping had zero online presence. Corporate clients couldn't verify them digitally. Built a high-end corporate website featuring service modules and a direct inquiry funnel. Result: Established a professional digital identity for the brand with 100% client satisfaction.",
      technologies: ["WordPress", "Elementor", "SEO", "UI/UX Design"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "GSL Export LTD — Bridging Bangladesh & Taiwan",
      href: "#",
      dates: "3 Weeks",
      active: true,
      description:
        "GSL Export LTD, a toy manufacturer, lacked a centralized platform to showcase their global manufacturing standards. Designed and developed a premium product showcase website with multi-region business highlights. Result: Streamlined the international buyer inquiry process and increased brand trust globally.",
      technologies: ["WordPress", "Webflow", "UI/UX Design", "Content Strategy"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "Meta Ads Lead Generation — Logistics Client",
      href: "#",
      dates: "Ongoing",
      active: true,
      description:
        "Designed and managed a full-funnel Meta Ads campaign for a Chittagong-based logistics company. Built custom audiences, A/B tested creatives, and optimized for cost-per-lead. Result: 3x increase in qualified leads within the first 60 days at 40% lower CPL than industry average.",
      technologies: ["Meta Ads Manager", "Facebook Pixel", "Canva", "Copywriting"],
      links: [],
      image: "",
      video: "",
    },
    {
      title: "B2B Lead Scraping & Outreach — Export Sector",
      href: "#",
      dates: "1 Week",
      active: true,
      description:
        "Built a targeted B2B lead database for an export company using LinkedIn Sales Navigator, Apollo.io, and Hunter.io. Verified 500+ decision-maker contacts and set up an automated cold email sequence. Result: 18% reply rate and 6 qualified meetings booked in the first campaign cycle.",
      technologies: ["LinkedIn Sales Navigator", "Apollo.io", "Hunter.io", "Google Sheets"],
      links: [],
      image: "",
      video: "",
    },
  ],

  testimonials: [
    {
      name: "Sarah Mitchell",
      role: "CTO, NovaTech Solutions",
      avatar: "",
      stars: 5,
      quote:
        "Working with Shelvey was an absolute pleasure. He delivered a production-ready campaign weeks ahead of schedule, and the results were exceptional. Our team was blown away by the attention to detail.",
    },
    {
      name: "James Okafor",
      role: "Founder, Launchpad Ventures",
      avatar: "",
      stars: 5,
      quote:
        "Shelvey took our vague marketing idea and turned it into a polished, scalable strategy. His ability to translate business goals into measurable campaigns is rare. We've already hired him for our next project.",
    },
    {
      name: "Priya Sharma",
      role: "Product Manager, Finova",
      avatar: "",
      stars: 5,
      quote:
        "From day one, Shelvey communicated clearly, hit every milestone, and proactively flagged potential issues before they became problems. Exactly the kind of strategist you want on a critical project.",
    },
    {
      name: "Lucas Fernandez",
      role: "CEO, Stackbloom",
      avatar: "",
      stars: 5,
      quote:
        "The Meta Ads campaign Shelvey ran for us reduced our cost-per-lead by over 40%. He didn't just do what we asked — he found and solved problems we didn't even know we had.",
    },
    {
      name: "Emily Chen",
      role: "Marketing Director, Pixel & Co.",
      avatar: "",
      stars: 5,
      quote:
        "I've worked with many marketers who overpromise and underdeliver. Shelvey is the exception — data-driven execution every time, with thoughtful suggestions that actually improved our ROI.",
    },
    {
      name: "Marcus Webb",
      role: "Business Development, CloudBase",
      avatar: "",
      stars: 5,
      quote:
        "Shelvey integrated seamlessly with our existing team. His SEO work doubled our organic traffic in 3 months, and his reporting was always clear and actionable. A true force multiplier.",
    },
  ],

  gallery: [
    { src: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80", alt: "Social Media Campaign — Product Launch", category: "Social Media" },
    { src: "https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80", alt: "Corporate Brand Identity", category: "Branding" },
    { src: "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&q=80", alt: "Instagram Story — Event Promo", category: "Social Media" },
    { src: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80", alt: "Annual Report Cover Design", category: "Corporate" },
    { src: "https://images.unsplash.com/photo-1634942537034-2531766767d1?w=800&q=80", alt: "LinkedIn Banner — Tech Startup", category: "Social Media" },
    { src: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?w=800&q=80", alt: "Brand Style Guide", category: "Branding" },
    { src: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&q=80", alt: "Facebook Ad Creative", category: "Social Media" },
    { src: "https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&q=80", alt: "Corporate Presentation Deck", category: "Corporate" },
    { src: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80", alt: "Instagram Feed — Fashion Brand", category: "Social Media" },
    { src: "https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=800&q=80", alt: "Logo & Visual Identity", category: "Branding" },
    { src: "https://images.unsplash.com/photo-1559028012-481c04fa702d?w=800&q=80", alt: "Twitter/X Campaign Poster", category: "Social Media" },
    { src: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80", alt: "Corporate Event Banner", category: "Corporate" },
  ],
} as const;
