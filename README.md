# Shelvey Dias — Portfolio & Admin CMS

Personal portfolio website for **Shelvey Dias**, Corporate Marketing Strategist & Digital Growth Architect based in Chittagong, Bangladesh.

🌐 **Live:** [galactus-sigma.vercel.app](https://galactus-sigma.vercel.app)

---

## Overview

A fully custom-built portfolio with a complete headless CMS admin panel. Every section of the website — from hero text to gallery images — is editable live from the dashboard without touching any code. Supports multi-user access with role-based permissions.

---

## Features

### Portfolio Website
- **Animated hero** — name, tagline, avatar (all editable)
- **About / Bio** — rich text editor with live DB sync
- **Work Experience** — timeline with company logos, drag-to-reorder
- **Education** — institution logos, years, degree info
- **Skills** — categorized skill tags with count-up stats
- **Case Studies** — project cards with images, tags, links
- **Creative Gallery** — auto-scrolling marquee with hover pause
- **Client Testimonials** — star ratings, quotes
- **Contact form** — submissions saved to DB, readable in admin inbox
- **Floating pill navbar** — fully configurable from admin (icons, links, order)
- **Dark / Light mode** toggle
- **Fully responsive** — mobile, tablet, desktop
- **SEO** — dynamic Open Graph, Twitter cards, per-page metadata from DB
- **Deployed on Vercel**

### Admin Panel (`/admin`)
- **Dashboard** — live stats (work entries, projects, skills, unread messages)
- **Full content editors** for every portfolio section
- **Image uploads** — all images stored on **Cloudinary** (no base64 in MongoDB)
- **Drag-to-reorder** for experience, education, projects, skills, gallery
- **Navbar editor** — add/remove/reorder icons from a visual picker
- **Messages inbox** — read, delete contact form submissions
- **Multi-user system** — master user manages users, assigns permissions per section
- **My Profile** — name, avatar photo, password change for each user
- **Dark mode** — full dark theme across entire admin panel
- **View Transition** — circle-expand animation on theme toggle

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | shadcn/ui + Magic UI |
| Animations | Framer Motion (motion/react) |
| Rich Text | Tiptap editor |
| Database | MongoDB (via Prisma ORM v5) |
| Auth | NextAuth.js v5 (beta) |
| Image Storage | Cloudinary |
| Toast Notifications | react-hot-toast |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── app/
│   ├── (auth)/admin/login/   ← Login page (FlickeringGrid bg, split layout)
│   ├── (portfolio)/          ← Public portfolio pages
│   ├── admin/                ← Protected admin panel
│   │   ├── about/            ← Bio + stats editor
│   │   ├── contact/          ← Contact info editor
│   │   ├── education/        ← Education editor
│   │   ├── experience/       ← Work experience editor
│   │   ├── gallery/          ← Gallery image manager
│   │   ├── hero/             ← Hero section editor
│   │   ├── messages/         ← Contact form inbox
│   │   ├── navbar/           ← Floating navbar editor
│   │   ├── profile/          ← My Profile (name, avatar, password)
│   │   ├── projects/         ← Case studies editor
│   │   ├── settings/         ← Site title, SEO metadata
│   │   ├── skills/           ← Skills manager
│   │   └── users/            ← User management (master only)
│   └── api/
│       ├── admin/            ← CRUD API routes (auth-guarded)
│       │   ├── content/      ← Hero, about, contact, settings
│       │   ├── education/    ← Education CRUD
│       │   ├── experience/   ← Work experience CRUD
│       │   ├── gallery/      ← Gallery CRUD
│       │   ├── messages/     ← Messages read/delete
│       │   ├── navbar/       ← Navbar icons CRUD
│       │   ├── profile/      ← Own profile update
│       │   ├── projects/     ← Case studies CRUD
│       │   ├── reorder/      ← Universal drag-reorder endpoint
│       │   ├── skills/       ← Skills CRUD + rename
│       │   ├── upload/       ← Cloudinary image upload
│       │   └── users/        ← User management (master only)
│       ├── auth/             ← NextAuth handler
│       ├── contact/          ← Public contact form submission
│       └── navbar/           ← Public navbar icons read
├── components/
│   ├── admin/                ← Admin UI (sidebar, topbar, theme, save button)
│   ├── magicui/              ← FlickeringGrid, Dock, BlurFade
│   ├── section/              ← Portfolio sections
│   └── ui/                   ← shadcn/ui base components
├── data/
│   └── resume.tsx            ← Static fallback data (used if DB is unavailable)
└── lib/
    ├── auth.ts               ← NextAuth config (DB users + legacy fallback)
    ├── admin-guard.ts        ← requireAdmin / requireMaster / requirePermission
    ├── cloudinary.ts         ← Cloudinary upload helper
    ├── db.ts                 ← Prisma client singleton
    ├── navbar-icons.tsx      ← Navbar icon registry
    ├── portfolio-data.ts     ← Server-side DB fetch helpers
    └── utils.ts              ← cn() and formatDate()
prisma/
├── schema.prisma             ← MongoDB schema
└── seed-master.ts            ← One-time master user seed script
```

---

## Database Models

| Model | Purpose |
|---|---|
| `Content` | Key-value store (hero, about, contact, settings) |
| `Experience` | Work history entries |
| `Project` | Case studies |
| `Skill` | Skill tags |
| `Education` | Education entries |
| `GalleryItem` | Gallery images |
| `Testimonial` | Client testimonials |
| `ContactMessage` | Contact form inbox |
| `NavbarIcon` | Floating navbar icon configuration |
| `AdminUser` | Admin users with role + permissions |

---

## Getting Started Locally

### 1. Clone the repository

```bash
git clone https://github.com/alizubu/GalacTus.git
cd GalacTus/portfolio
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root:

```env
# Database
DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/portfolio"

# NextAuth
NEXTAUTH_SECRET="your-random-secret-string"
NEXTAUTH_URL="http://localhost:3000"

# Admin credentials (used as legacy fallback before seeding)
ADMIN_EMAIL="your@email.com"
ADMIN_PASSWORD_HASH="bcrypt-hashed-password"

# Cloudinary — image hosting
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Generate a bcrypt password hash:
```bash
node -e "const b=require('bcryptjs'); console.log(b.hashSync('yourpassword', 10))"
```

### 4. Generate Prisma client and push schema

```bash
npx prisma generate
npx prisma db push
```

### 5. Seed the master admin user

Run once to create the first master user from your env vars:

```bash
npx tsx prisma/seed-master.ts
```

### 6. Start the dev server

```bash
pnpm dev
```

- Portfolio: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

---

## Admin Panel Sections

| Route | What you can edit |
|---|---|
| `/admin` | Dashboard stats |
| `/admin/hero` | Name, greeting, tagline, description, avatar photo |
| `/admin/about` | Bio (rich text), stats counter (years, projects, etc.) |
| `/admin/experience` | Work history — company, role, logo, dates, description |
| `/admin/education` | Schools, degrees, institution logos |
| `/admin/skills` | Skill tags — add, rename, delete, reorder |
| `/admin/projects` | Case studies — title, image, tags, description |
| `/admin/gallery` | Gallery images — upload, reorder, delete |
| `/admin/navbar` | Floating pill navbar — icons, links, order, visibility |
| `/admin/messages` | Contact form inbox — read, delete |
| `/admin/contact` | Email, phone, address, availability hours |
| `/admin/settings` | Site title, meta description, OG image |
| `/admin/users` | Add/edit/delete users, set permissions *(master only)* |
| `/admin/profile` | My name, photo, password |

---

## Multi-User System

The admin panel supports two roles:

| Role | Access |
|---|---|
| **Master** | Full access to everything including user management |
| **User** | Access only to sections the master explicitly grants |

**Available permissions per user:** Hero, About, Experience, Education, Skills, Case Studies, Gallery, Navbar, Messages, Contact, Settings.

Master users can add/remove users, change their role, and toggle individual permissions from `/admin/users`.

---

## Image Storage

All uploaded images go directly to **Cloudinary** — no base64 data is stored in MongoDB. This applies to:
- Hero avatar
- Work experience company logos
- Education institution logos
- Case study images
- Gallery images
- Admin user avatars

---

## Deployment

Deployed on **Vercel**. Set all environment variables in your Vercel project settings:

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
ADMIN_EMAIL
ADMIN_PASSWORD_HASH
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

After first deploy, run the seed script once:
```bash
npx tsx prisma/seed-master.ts
```

---

## License

MIT — built and owned by **Shelvey Dias**.
