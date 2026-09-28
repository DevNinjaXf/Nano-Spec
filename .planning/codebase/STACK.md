# Technology Stack

**Analysis Date:** 2026-06-01

## Languages

**Primary:**
- TypeScript 5.x - All application source code, components, pages, and mock data definitions.

**Secondary:**
- JavaScript/ESM - Configuration files (e.g., PostCSS, ESLint configs).

## Runtime

**Environment:**
- Node.js 20.x (LTS) or higher.
- Browser runtimes supporting WebGL (required for Three.js 3D crystal lattice and 3D orbital animations).

**Package Manager:**
- npm 10.x
- Lockfile: `package-lock.json` present.

## Frameworks

**Core:**
- Next.js 16.2.2 (App Router) - Full-stack React framework providing routing, SSR/SSG, and server optimization.
- React 19.2.4 - Component-driven UI library.

**3D Graphics & Simulation:**
- Three.js 0.183.2 - Low-level WebGL library for rendering 3D graphics in the browser.
- `@react-three/fiber` 9.5.0 - React wrapper for Three.js enabling declarative 3D scene construction.
- `@react-three/drei` 10.7.7 - Collection of useful helpers and controls for React Three Fiber.

**Animation & Styling:**
- Framer Motion 12.38.0 - Animation library for production-ready, interactive transitions and layout animations.
- Tailwind CSS v4.0 - Utility-first styling framework integrated via PostCSS.
- `@tailwindcss/postcss` 4.0 - Custom PostCSS wrapper for Tailwind CSS v4.
- `next-themes` 0.4.6 - Dark/Light mode theme provider and transitions.

**Visualization:**
- Recharts 3.8.1 - Declarative chart library for rendering EDX composition graphics.

## Key Dependencies

**Critical:**
- `@google/genai` 1.48.0 - Official SDK for Google Gemini models, powering material analysis, EDX estimation, and atomic insights.
- `lucide-react` 1.7.0 - Premium, modern icon set for UI micro-interactions.
- `jspdf` 4.2.1 - Client-side PDF generation tool.
- `html-to-image` 1.11.13 & `html2canvas` 1.4.1 - HTML element screenshot capture used to serialize simulated SEM reports to PDF format.
- `@radix-ui/react-slider` 1.3.6 - Accessible slider component used for comparison views.

## Configuration

**Environment:**
- Local `.env` files for managing environment configurations (e.g., API keys for Gemini model integrations).

**Build & Compilation:**
- `next.config.ts` - Next.js custom router and compiler options.
- `tsconfig.json` - TypeScript path mappings (`@/*` to `src/*`) and compiler configuration.
- `eslint.config.mjs` - ESLint configuration for code quality and linting standards.
- `postcss.config.mjs` - PostCSS configuration loaded with `@tailwindcss/postcss` for styling compilation.

## Platform Requirements

**Development:**
- Windows/macOS/Linux with Node.js installed.
- Modern web browser with WebGL 2.0 enabled for local 3D rendering.

**Production:**
- Optimized for deployment to Vercel (Next.js serverless/edge runtime) or standard Node.js server configurations.

---

*Stack analysis: 2026-06-01*
*Update after major dependency changes*
