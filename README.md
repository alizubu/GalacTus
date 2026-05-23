# Shelvey Dias — Portfolio Website

Personal portfolio website for **Shelvey Dias**, Corporate Marketing Strategist & Digital Growth Architect based in Chittagong, Bangladesh.

🌐 **Live:** [galactus-sigma.vercel.app](https://galactus-sigma.vercel.app)

---

## About

This is a fully custom-built portfolio website showcasing 5+ years of experience in digital marketing, brand strategy, and web development. The site includes a complete admin panel for live content management without touching any code.

---

## Features

- **Custom Admin Panel** at `/admin` — edit all content live from a dashboard
- **MongoDB database** — all content stored and managed dynamically
- **NextAuth.js authentication** — secure admin login
- **Custom SVG cursor** with smooth lerp animation
- **Scroll-triggered animations** — fade up, word reveal, blur-to-clear
- **Animated background** — floating gradient blobs
- **Creative Gallery** — marquee image gallery with hover pause
- **Client Testimonials** section
- **Contact form** — submissions saved to database, readable in admin inbox
- **Blog** — MDX-powered blog with syntax highlighting
- **Dark / Light mode** toggle
- **Fully responsive** — mobile, tablet, desktop
- **SEO optimized** — Open Graph, Twitter cards, meta tags
- **Deployed on Vercel**

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui |
| Animations | Framer Motion (motion) |
| Database | MongoDB (via Prisma ORM v5) |
| Auth | NextAuth.js v5 |
| Deployment | Vercel |
| Blog | Content Collections (MDX) |

---

## Project Structure

```
src/
├── app/
│   ├── admin/          ← Protected admin panel (all section editors)
│   ├── api/            ← API routes (admin CRUD, contact form, auth)
│   ├── blog/           ← Blog listing and post pages
│   └── page.tsx        ← Main portfolio page
├── components/
│   ├── admin/          ← Admin UI components (sidebar, topbar, save button)
│   ├── magicui/        ← Animation components
│   ├── section/        ← Portfolio sections (work, projects, gallery, etc.)
│   └── ui/             ← shadcn/ui base components
├── data/
│   └── resume.tsx      ← Static fallback data
└── lib/
    ├── auth.ts         ← NextAuth configuration
    ├── db.ts           ← Prisma client
    └── utils.ts        ← Utility functions
prisma/
└── schema.prisma       ← MongoDB schema
content/
└── *.mdx               ← Blog posts
```

---

## Getting Started Locally

### 1. Clone the repository

```bash
git clone https://github.com/alizubu/GalacTus.git
cd GalacTus
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/portfolio"
NEXTAUTH_SECRET="your-random-secret-string"
NEXTAUTH_URL="http://localhost:3000"
ADMIN_EMAIL="your@email.com"
ADMIN_PASSWORD_HASH="bcrypt-hashed-password"
```

To generate a password hash:
```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('yourpassword', 10))"
```

### 4. Push database schema

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the database

```bash
node prisma/seed.mjs
```

### 6. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) for the portfolio.
Open [http://localhost:3000/admin](http://localhost:3000/admin) for the admin panel.

---

## Admin Panel

The admin panel at `/admin` allows full content management:

| Route | Section |
|---|---|
| `/admin` | Dashboard with stats |
| `/admin/hero` | Name, tagline, description |
| `/admin/about` | Bio text (Markdown) |
| `/admin/experience` | Work experience entries |
| `/admin/education` | Education entries |
| `/admin/skills` | Skill tags |
| `/admin/projects` | Case studies |
| `/admin/gallery` | Creative gallery images |
| `/admin/messages` | Contact form inbox |
| `/admin/contact` | Contact info & social links |
| `/admin/settings` | Site title, SEO, password |

---

## Deployment

Deployed on **Vercel**. Required environment variables must be set in Vercel project settings before deploying.

---

## License

MIT — built and owned by **Shelvey Dias**.
