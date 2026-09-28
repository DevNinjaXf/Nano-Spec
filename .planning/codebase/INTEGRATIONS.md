# External Integrations

**Analysis Date:** 2026-06-01

## APIs & External Services

**Generative AI Service:**
- Google Gemini API - Used for material analysis, topographical simulation parameters, and EDX chemistry calculations.
  - SDK/Client: `@google/genai` npm package (v1.48.0)
  - Auth: API key stored in `GEMINI_API_KEY` (or similar) environment variable.
  - Endpoints used: Chat completions and multimodal requests (Gemini 2.5/3.5 models) to parse micrograph uploads and text queries.

## Data Storage

**Client Storage:**
- Browser `localStorage` - Used to save user preferences, particularly favorite elements in the Element Atlas.
  - Key used: `elementsFavorites`
  - Format: JSON array of atomic numbers (numbers), loaded on client mount.

**Static Database:**
- Local static modules - `src/data/elements.ts` (periodic table properties) and `src/lib/materialData.ts` (material profiles database containing unit cell definitions, space groups, and EDX profiles).

## PDF Export Integration

**Simulated SEM Report Exporter:**
- Integrated client-side PDF renderer.
  - Clients: `jspdf` (v4.2.1) along with `html-to-image` (v1.11.13) / `html2canvas` (v1.4.1).
  - Workflow: Triggers a snapshot capture of the rendered `SEMReport` DOM node, converts it to an image, and packages it into a multi-page PDF document for local download.

## Monitoring & Analytics

- None configured in the current project structure.

## CI/CD & Deployment

**Hosting:**
- Optimized for Vercel (automatic deployments via GitHub repository connections).
  - Environment variables: Set securely in the hosting dashboard (e.g., `GEMINI_API_KEY`).

## Environment Configuration

**Development:**
- Required env vars: `GEMINI_API_KEY` (if live AI features are enabled).
- Secret management: Gitignored `.env` or `.env.local` files.
- Mock/stub services: Falling back to `src/lib/materialData.ts` database entries if AI simulation fails or processing runs offline (e.g., 2.5-second setTimeout simulation in dashboard page).

**Production:**
- Secrets management: Production-grade hosting dashboard environment variables.

---

*Integration audit: 2026-06-01*
*Update when adding/removing external services*
