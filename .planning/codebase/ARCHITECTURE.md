# Architecture

**Analysis Date:** 2026-06-01

## Pattern Overview

**Overall:** Component-Driven Client-Side Web Application (Next.js App Router).

**Key Characteristics:**
- **declarative 3D Simulation:** Core visualization features (molecular crystal lattices and atomic orbitals) are constructed declaratively using React wrapper hierarchies over Three.js (`@react-three/fiber` and `@react-three/drei`).
- **State-Driven Rendering:** Interventions such as search filters, heatmap variables, and element comparison lists drive real-time view updates on the client.
- **Static Seed Architecture:** Extensive static databases (`materialData.ts`, `elements.ts`) are used for robust, instantaneous lookup fallback, mitigating network reliance.
- **Stateless Analysis Flow:** Material analysis uses stateful simulation timers to transition from query parsing to interactive report generation.

## Layers

**Page Entry / Routing Layer:**
- Purpose: Direct route parsing, layout wrapping, and context provider initialization.
- Contains: Page views and main layouts.
- Key files:
  - `src/app/page.tsx` - Material analysis workspace entry.
  - `src/app/element-atlas/page.tsx` - Element table and orbital visualizer entry.
  - `src/app/layout.tsx` - Root layout and meta tags.
  - `src/app/Providers.tsx` - Theme contexts wrapping the children.
- Depends on: UI components, static library providers.

**UI Presentation Layer:**
- Purpose: Interactive components, forms, sliders, modals, and charts.
- Contains: Event handlers, animated transitions, canvas render blocks, and SVG graphs.
- Key files:
  - `src/components/OmniInput.tsx` - Text, voice, and micrograph upload form.
  - `src/components/BeforeAfterSlider.tsx` - Before/after swipe interface.
  - `src/components/SEMReport.tsx` - simulated SEM statistics display.
  - `src/components/PdfExporter.tsx` - screenshot-to-pdf engine.
  - `src/components/ElementAtlas/` - Periodic table components, search search-bars, comparison lists, and filters.
- Depends on: Lucide icons, Framer Motion, Recharts.

**3D Graphics & Canvas Layer:**
- Purpose: WebGL scene configuration, lights, materials, orbital shells, and mathematical vertex placement.
- Contains: Three.js canvas systems, cameras, custom meshes, and rotation calculations.
- Key files:
  - `src/components/Hero3D.tsx` - Animated homepage graphics.
  - `src/components/Insight3D.tsx` - Interactive crystal unit cell configurations.
  - `src/components/ElementAtlas/AtomVisualizerModal.tsx` - 3D orbital trajectory viewer.
- Depends on: `@react-three/fiber`, `@react-three/drei`, `three`.

**Data / Mock Storage Layer:**
- Purpose: Static references, physical properties, element weights, and simulated SEM outputs.
- Contains: Structured objects, arrays, and color palettes.
- Key files:
  - `src/data/elements.ts` - 118 chemical elements properties, states, electron structures.
  - `src/lib/materialData.ts` - Precompiled structural statistics for popular metals, alloys, and ceramics.

## Data Flow

### Material Scan & Report Generation:
1. User enters a query or interacts with `OmniInput` (e.g., searches "Gold").
2. `Home` page component triggers `handleAnalyze()`, setting `isAnalyzing` state to `true`.
3. System simulates analysis delays (2.5 seconds) simulating neural microscopy processing.
4. State `analyzedMaterial` is resolved.
5. Component `Insight3D` receives the material's crystal system (e.g., "FCC") and builds the declarative 3D unit cell in real-time.
6. Component `SEMReport` fetches structural parameters from `getMaterialData()` and draws an interactive report with Recharts EDX charts.
7. User clicks the export button in `PdfExporter`, triggering HTML serialization and a browser PDF download.

### Element Comparison:
1. User clicks an element in the periodic grid (`PeriodicTableGrid`).
2. Component triggers `toggleCompare()`, adding the element's atomic number to a stateful comparison `Set`.
3. `ComparePanel` is raised, fetching detailed specs from `elements.ts` and listing properties side-by-side.

## State Management

- **Local UI State:** Extensively managed using React `useState` and `useMemo` hooks (e.g., active element selections, search parameters, favorites, compare lists).
- **Persistent Client State:** Saved inside `localStorage` (e.g., periodic table favorites saved as `elementsFavorites` indices).
- **Global Context:** Provided by `next-themes` for system-wide light/dark themes.

## Error Handling

**Strategy:**
- Quiet fallbacks to precompiled datasets if custom analysis queries do not exist in the database (defaults to Aluminum or standard mock responses).
- Standard React 19 boundaries (where applicable) and local conditional renders if WebGL contexts fail to compile in older browsers.

## Cross-Cutting Concerns

**Styling & Themes:**
- Tailwind CSS v4 variables for unified colors, borders, and dark-mode states.
- `next-themes` dynamically updates utility class selectors (`.dark` on `html` elements).

**Canvas Screenshot capture:**
- Capturing high-performance canvas snapshots (e.g., Three.js WebGL scenes) utilizes custom preservation properties (`gl={{ preserveDrawingBuffer: true }}`) on Canvas instances to ensure snapshots don't return blank layers.

---

*Architecture analysis: 2026-06-01*
*Update when major patterns change*
