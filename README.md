# ApplyZen

ApplyZen is a focused job application tracker built to help you stay organized while searching for your next role. It keeps every application in one place, lets you update statuses as you move through the hiring process, and makes it easy to review your funnel without losing track of important details.

## Why this project exists

Job searching can get chaotic fast. Most people end up juggling spreadsheets, email threads, and bookmarks. ApplyZen is designed to replace that friction with a clean dashboard for:

- tracking every job application
- updating application status from Applied to Interview to Offer or Rejected
- storing company, role, salary, link, and notes in one place
- searching and filtering opportunities quickly
- keeping a clear view of progress across the whole job search

## Features

- Secure authentication with Supabase
- Personalized dashboard for each signed-in user
- Add, edit, and delete applications
- Track details such as:
  - company name
  - role/title
  - application status
  - date applied
  - salary
  - job link
  - notes
- Fast search and status filtering
- Responsive UI built with modern React components
- Data persisted in Supabase with a migration-based schema setup

## Tech stack

- React 19
- Vite
- TypeScript
- TanStack Router / TanStack Start
- Tailwind CSS
- shadcn-style UI primitives
- Supabase Auth and Postgres database

## Project structure

```text
.
├── src/
│   ├── components/          # Reusable UI components
│   ├── hooks/               # App hooks
│   ├── integrations/        # Supabase client and auth helpers
│   ├── lib/                 # Utility helpers
│   ├── routes/              # Route-based pages
│   ├── services/            # App data access and business logic
│   ├── styles.css           # Global styling
│   └── router.tsx           # Router configuration
├── supabase/
│   └── migrations/          # Database schema migrations
├── .env                     # Local environment values
├── .gitignore
├── bun.lockb
├── eslint.config.js
├── package.json
├── tsconfig.json
├── vite.config.ts
├── wrangler.jsonc
└── README.md
```

## Prerequisites

Before you run the app locally, make sure you have:

- Node.js 22.12 or later
- npm or another package manager supported by the project
- A Supabase project with authentication enabled

## Local setup

1. Install dependencies:

```bash
npm install
```

2. Create the environment variables used by the app. The project expects Supabase values such as:

```bash
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_PUBLISHABLE_KEY="your-anon-key"
VITE_SUPABASE_URL="https://your-project.supabase.co"
VITE_SUPABASE_PUBLISHABLE_KEY="your-anon-key"
```

3. Start the development server:

```bash
npm run dev
```

The app should launch in the Vite dev server, typically available at:

```text
http://localhost:5173
```

## Available scripts

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

### Script descriptions

- `npm run dev` — starts the local Vite development server
- `npm run build` — builds the production bundle
- `npm run preview` — previews the built app locally
- `npm run lint` — runs ESLint checks
- `npm run format` — formats the codebase with Prettier

## Database and auth

This app uses Supabase for authentication and persistent application data. The database schema and migration files live under the `supabase/migrations` directory.

The application expects an `applications` table with a row-level relation to the authenticated user and fields for:

- `company_name`
- `role`
- `status`
- `date_applied`
- `salary`
- `job_link`
- `notes`
- `user_id`

## Statuses supported

The app currently uses these flow states:

- Applied
- Interview
- Offer
- Rejected

## Deploying to Vercel

The production build uses Nitro's Vercel preset and generates Vercel's Build Output API bundle in `.vercel/output`.

1. Import this repository into Vercel and use the repository root as the project root.
2. Set the install command to `npm ci` and the build command to `npm run build`.
3. Use Node.js 22.12 or later in the Vercel project settings.
4. Add these environment variables to the Vercel project for every environment you deploy:

   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_PUBLISHABLE_KEY`

   Set the `VITE_` variables to the same Supabase project URL and publishable (formerly anon) key as their server-side counterparts. These are public client credentials; never use a Supabase service-role key in client-facing configuration.

5. Deploy the project. The Nitro preset creates the server function and static asset routes needed to serve the app and its client-side assets.
6. In Supabase Auth settings, add the deployed domain to the allowed site and redirect URLs so sign-up and sign-in redirects work in production.

The repository's `.gitignore` excludes `.vercel/` build output; Vercel creates it during each deployment.

## Notes

This repository is a front-end application with server-side support through the Vite/TanStack stack and Supabase. If you are setting up a fresh project, make sure the Supabase project URL and public keys match the environment variables used by the app, and ensure the database schema is applied before sign-in and application creation.
