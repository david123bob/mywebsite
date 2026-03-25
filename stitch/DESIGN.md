# Design System Strategy: The Digital Architect

## 1. Overview & Creative North Star
This design system is built upon the **"Digital Architect"** Creative North Star. It rejects the clutter of standard portfolio templates in favor of high-end editorial precision. The aesthetic is defined by an interplay of heavy, geometric typography and weightless, layered surfaces.

Instead of a traditional rigid grid, this system utilizes **intentional asymmetry** and **tonal depth** to guide the eye. We achieve a "Modern Editorial" feel by treating whitespace not as "empty," but as a structural component that provides breathing room for technical sophistication. Key layouts feature overlapping elements—such as a dark terminal block partially obscuring a light surface—to create a sense of three-dimensional space and intellectual curiosity.

---

## 2. Colors
Our palette is a sophisticated blend of crystalline whites, deep indigos, and structural grays. It is designed to feel "tech-forward" yet premium.

### Palette Highlights
- **Primary (`#4648d4`) & Secondary (`#6b38d4`):** These are our "Electric Indigo" accents. Use them sparingly for critical interactions and brand moments.
- **Surface Hierarchy:** We utilize a stepped gray scale (from `surface-container-lowest` #ffffff to `surface-dim` #dcd9dd) to define UI regions.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders for sectioning. Structural boundaries must be defined solely through:
1. **Background Color Shifts:** Placing a `surface-container-low` section against a `surface` background.
2. **Subtle Tonal Transitions:** Using the `surface-container` tiers to distinguish nested elements.

### Glass & Gradient Rule
To prevent the UI from feeling flat or "Bootstrap-standard," floating elements (like Nav bars or Tooltips) should utilize **Glassmorphism**: 
- Background: `surface` color at 70-80% opacity.
- Effect: `backdrop-blur` (12px - 20px).
- CTA Polish: Buttons and Hero highlights should use a subtle linear gradient from `primary` to `primary_container` at a 135-degree angle.

---

## 3. Typography
The typography is the voice of the system: authoritative, precise, and contemporary.

- **Display & Headlines (Plus Jakarta Sans):** Chosen for its geometric clarity and "fun" rounded terminals. Use `display-lg` for Hero statements to create an immediate impact.
- **Titles & Body (Inter):** The workhorse. Inter provides exceptional readability. Use `title-md` for card headings to maintain a professional, sans-serif rigor.
- **Labels (Space Grotesk):** A monospaced-leaning sans used for technical metadata and small UI labels (`label-md`). This reinforces the "Software Engineer" identity.

**Scale Philosophy:** High contrast. Pair a massive `display-lg` headline with a quiet `body-md` description to create an editorial hierarchy that feels "designed," not just "filled."

---

## 4. Elevation & Depth
In the "Digital Architect" system, depth is achieved through **Tonal Layering** rather than heavy drop shadows.

### The Layering Principle
Stack tiers to create natural lift. Place a `surface-container-lowest` (#FFFFFF) card on top of a `surface-container` (#f0edf1) section. The delta in luminance creates a clean, sophisticated separation.

### Ambient Shadows
For floating interactive elements (like an active card or terminal window), use "Ambient Shadows":
- **Values:** `0px 20px 40px` blur.
- **Opacity:** 4% - 6%.
- **Tint:** The shadow color must be a tinted version of `on-surface` (#1b1b1e) to mimic natural light, never pure black.

### The "Ghost Border" Fallback
If accessibility demands a border, use a **Ghost Border**: `outline-variant` (#c7c4d7) at **15% opacity**. This provides a hint of containment without breaking the "no-line" editorial aesthetic.

---

## 5. Components

### Buttons
- **Primary:** High-rounded (`rounded-full`), `primary` background with a subtle gradient to `primary_container`. Soft shadow on hover.
- **Secondary:** Ghost style. No background, `outline-variant` (ghost border), and `primary` text.
- **Interaction:** On hover, primary buttons should "lift" slightly (Y-axis -2px) with an increased ambient shadow.

### Terminal Hero
A signature component. Use `inverse_surface` (#303033) for the background. Code text should use `Geist Mono` or `Space Grotesk`. Include "traffic light" window controls (Red, Yellow, Green) to ground the technical vibe.

### Experience Cards
Forbid divider lines. Use `spacing-8` (2rem) of vertical whitespace between roles. Company logos should be housed in a `surface-container-highest` rounded square for consistency. Use `label-md` for dates, set in a muted `on-surface-variant`.

### GitHub Heat Map
Encapsulate the activity map in a `surface-container-low` wrapper with `rounded-lg`. Use the `primary` scale for the "contribution squares" (transitioning from `primary_fixed` to `primary`) instead of the standard GitHub green to maintain brand harmony.

### Skill Grid
Icons should be placed in a grid with `spacing-10` gaps. Each icon sits on a "Soft Plinth": a `surface-container-lowest` circle with a `spacing-4` padding.

---

## 6. Do's and Don'ts

### Do
- **DO** use significant whitespace (up to `spacing-24`) to separate major sections.
- **DO** use "Plus Jakarta Sans" for all numeric data to make stats feel modern.
- **DO** overlap elements (e.g., let the Terminal window bleed slightly over the section below it).
- **DO** use `surface-bright` for the main canvas to keep the portfolio feeling airy.

### Don't
- **DON'T** use 1px solid borders at 100% opacity. It looks dated and "templated."
- **DON'T** use standard blue for links. Use the `primary` indigo token.
- **DON'T** crowd the layout. If in doubt, increase the `spacing` token by one level.
- **DON'T** use sharp corners. Every container must follow the `rounded-md` or `rounded-lg` scale.