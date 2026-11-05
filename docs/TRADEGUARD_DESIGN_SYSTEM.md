# TRADEGUARD DESIGN SYSTEM: "WARM EDITORIAL PRESTIGE"
> **Design Specification & Implementation Blueprint**  
> Extracted from the contemporary warm editorial aesthetic: Warm Linen Canvas, Deep Obsidian Containers, Editorial Serif Headlines, Floating Island Navigation, and Honey Amber Action Accents.

---

## 1. Design DNA & Visual Philosophy

### The Core Essence
Generic SaaS tools rely on cold grey backgrounds (`#F8FAFC`), saturated blue/purple gradients, and cookie-cutter 3-card grids. 
This design system moves in the exact opposite direction: **Dignified, High-Trust Editorial Prestige**. 

It evokes:
1. **Financial Authority**: Like a Financial Times or Monocle editorial publication — warm, cultured, human, and authoritative.
2. **Warm Linen Canvas**: Replaces clinical white with a rich, organic warm ivory parchment that reduces eye strain and conveys bespoke craftsmanship.
3. **High-Contrast Deep Obsidian Cards**: Dark monolith containers with deep charcoal (`#151412`) that anchor the eye and hold complex data with poise.
4. **Editorial Serif + Monospace Pairing**: Majestic serif titles for institutional gravitas, paired with ultra-crisp geometric sans for copy and strict monospace figures for blockchain ledger entries and customs HS codes.
5. **Tactile Pill Elements**: Floating island navigation bars, pill badges, and warm honey-amber action triggers (`#F0A732`).

---

## 2. Color Palette & Semantic Tokens

### 2.1 Foundational Palette (HEX Codes)

| Token Name | HEX Code | CSS Variable | Purpose / Usage |
| :--- | :--- | :--- | :--- |
| **Parchment / Ivory Canvas** | `#F9F6F0` | `--bg-parchment` | Primary page body background; warm organic linen base. |
| **Warm Canvas Soft** | `#F3EFE6` | `--bg-parchment-soft`| Sub-regions, table headers, and neutral island bars. |
| **Parchment Border** | `#E8E2D5` | `--border-parchment` | Delicate structural borders on light sections. |
| **Obsidian Monolith** | `#141311` | `--bg-obsidian` | Deep hero containers, command cards, and dark sections. |
| **Obsidian Card Surface** | `#1D1C19` | `--bg-obsidian-surface`| Card backgrounds inside dark monolith containers. |
| **Obsidian Border** | `#2C2A26` | `--border-obsidian` | Crisp separation lines inside dark containers. |
| **Honey Amber (Primary CTA)** | `#F0A732` | `--accent-amber` | Active navigation pills, primary action buttons, status dots. |
| **Honey Amber Hover** | `#E29824` | `--accent-amber-hover`| Hover and focused states for primary buttons. |
| **Honey Amber Tint** | `#FAF0D8` | `--accent-amber-tint` | Light background for category badges and alerts. |
| **Terracotta Rust** | `#C85028` | `--accent-rust` | Milestone highlights, timestamp accents, priority badges. |
| **Settlement Emerald** | `#1E7E55` | `--accent-emerald` | Smart contract verified locks, confirmed releases, cryptographic proof. |
| **Ink Black (Dark Text)** | `#141311` | `--text-ink` | Headings, titles, and high-emphasis body on cream. |
| **Muted Slate / Bark** | `#6B665E` | `--text-muted` | Secondary body text, table metadata, form labels. |
| **Off-White / Alabaster** | `#F5F3ED` | `--text-light` | Typography on Obsidian containers. |

---

## 3. Typography Hierarchy

### 3.1 Type Families
- **Display / Editorial Headings**: `font-serif` (Playfair Display / Fraunces / Instrument Serif / Cormorant Garamond / Georgia fallback)
  - Characterized by high contrast, elegant serifs, classical proportions, and institutional confidence.
- **Body & Controls**: `font-sans` (Plus Jakarta Sans / Inter / -apple-system fallback)
  - Geometric, clean, open aperture, high legibility across small sizes.
- **Ledger, Hashes & HS Codes**: `font-mono` (JetBrains Mono / SF Mono / Consolas)
  - Numbers, smart contract addresses, bill of lading hashes, currency amounts, and tariff codes.

### 3.2 Type Scale & Applications

```
HERO DISPLAY       48px - 60px (3rem - 3.75rem) | font-serif, tracking-tight, leading-[1.1]
PAGE HEADLINE      32px - 36px (2rem - 2.25rem) | font-serif, font-medium, leading-tight
SECTION TITLE      20px - 24px (1.25rem - 1.5rem)| font-serif or font-sans font-bold
EYEBROW / DOT TAG  11px - 12px (0.7rem - 0.75rem)| font-sans, font-bold, uppercase, tracking-wider
BODY STANDARD      14px - 15px (0.875rem - 0.93rem)| font-sans, text-[#4D4942], leading-relaxed
MONO FIGURES       13px - 14px (0.81rem - 0.875rem)| font-mono, tabular-nums, font-medium
MICRO METADATA     10px - 11px (0.65rem - 0.7rem)| font-mono or font-sans, font-semibold
```

---

## 4. Geometry, Radius & Spacing System

### 4.1 Border Radius Language
- **Monolith Cards & Heroes**: `rounded-3xl` (~28px to 32px)
  - Creates the distinctive, sculpted, architectural container look seen in modern flagship publications.
- **Island Navigation & Outer Shells**: `rounded-full` (~9999px)
  - Floating pills for top navigation, tab selectors, and search fields.
- **Action Buttons & Form Controls**: `rounded-full` or `rounded-xl`
  - Pill buttons (`rounded-full`) for main call-to-actions (`Subscribe`, `Contact us`, `Fund Escrow`).
  - Rounded rectangles (`rounded-xl` / 12px) for table enclosures and sub-panels.

### 4.2 Elevation & Shadow Philosophy
- **Zero Blurry Dropshadows**: Avoid generic `shadow-xl` spreads.
- **Border-First Architecture**: Use crisp 1px borders (`#E8E2D5` on cream, `#2C2A26` on dark).
- **Subtle Ambient Lift**: A soft `shadow-[0_4px_20px_-4px_rgba(20,19,17,0.06)]` on white cards.

---

## 5. Signature Component Patterns

### 5.1 Floating Island Navigation ("The Capsule")
```tsx
// Outer island pill bar
<div className="mx-auto flex items-center justify-between px-6 py-3 max-w-6xl">
  <Logo />
  {/* Capsule Navigation Island */}
  <nav className="flex items-center gap-1 bg-[#EBE6DC] p-1.5 rounded-full border border-[#DFD8CC]">
    <NavLink active={false}>Home</NavLink>
    <NavLink active={false}>Agreements</NavLink>
    <NavLink active={false}>Escrow Cockpit</NavLink>
    <NavLink active={true}>Customs Duty</NavLink> {/* Active = bg-[#F0A732] text-[#141311] rounded-full */}
  </nav>
  {/* Right Action */}
  <button className="bg-[#141311] text-[#F9F6F0] px-5 py-2.5 rounded-full text-xs font-bold">
    Connect Wallet
  </button>
</div>
```

### 5.2 Obsidian Monolith Hero / Command Container
```tsx
// The deep charcoal container on warm ivory canvas
<div className="bg-[#141311] text-[#F5F3ED] rounded-3xl p-8 md:p-12 border border-[#262421]">
  {/* Eyebrow with Amber Dot */}
  <div className="flex items-center gap-2 text-[#F0A732] text-xs font-bold uppercase tracking-wider mb-4">
    <span className="h-2 w-2 rounded-full bg-[#F0A732]" />
    <span>Base Sepolia Escrow Protocol</span>
  </div>
  {/* Editorial Serif Heading */}
  <h1 className="font-serif text-3xl md:text-5xl text-white font-normal tracking-tight mb-4 leading-tight">
    Autonomous Import Protection & Settlement
  </h1>
  <p className="font-sans text-sm md:text-base text-[#A8A39A] max-w-2xl leading-relaxed mb-8">
    Bridge Nigerian fiat deposits to international suppliers with smart contract locks and customs landed cost intelligence.
  </p>
  {/* Controls / Inputs */}
  ...
</div>
```

### 5.3 Warm Card with Editorial Sidebar
```tsx
// Content + Sidebar layout on Cream
<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
  {/* Main Workspace (8 cols) */}
  <div className="lg:col-span-8 bg-white border border-[#E8E2D5] rounded-3xl p-8">
    ...
  </div>
  {/* Editorial Sidebar (4 cols) */}
  <div className="lg:col-span-4 bg-white border border-[#E8E2D5] rounded-3xl p-6">
    <h3 className="font-serif text-lg font-bold text-[#141311] mb-4">Live Telemetry</h3>
    ...
  </div>
</div>
```

---

## 6. Step-by-Step Revamp Plan for TradeGuard Pages

| Step | Page / Component | Key Transformations |
| :---: | :--- | :--- |
| **0** | **Global Tailwind & Theme Config** | Add `--bg-parchment` (`#F9F6F0`), `--bg-obsidian` (`#141311`), Honey Amber (`#F0A732`), and configure editorial serif typography in `tailwind.config.ts`. |
| **1** | **Root Navbar & Island Header** | Replace standard bar with the **Capsule Navigation Island** (`rounded-full`), active amber pill for current route, and dark pill wallet button. |
| **2** | **Root Landing Page (`/`)** | Transform into the warm linen editorial layout with the obsidian hero container, editorial serif display typography, and warm card grid. |
| **3** | **Trade Control Board Cockpit (`/trades/[id]`)** | Revamp the 60/40/100 layout: Warm parchment workspace background, Obsidian command cards for smart escrow, Providus bank tracking in ivory card, and editorial serif milestone headers. |
| **4** | **Commercial Invoice Draft (`/trades/new`)** | Re-skin into a crisp ivory legal proforma invoice on warm linen canvas with pill line-item controls and obsidian summary block. |
| **5** | **Customs Intelligence Terminal (`/assessments/new`)** | Convert into an editorial audit sheet with amber candidate HS code tags, statutory NCS duty breakdown, and obsidian landed cost banner. |
| **6** | **Trade Manifest & Dashboard Overview** | Update tables with rounded-2xl white cards on cream canvas, editorial serif headings, and honey amber status pills. |
| **7** | **Shipment & Dispute Consoles** | Style waybill and inspection countdown timer with obsidian night-mode cards, live remaining time dials, and dual pill actions. |

