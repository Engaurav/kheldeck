# UI/UX & Theming Design Rules

All user interface code, styling, and layouts in this project must adhere strictly to these rules:

## 1. Dual Theme Requirement
- The app MUST support both **Dark Liquid Cyber** and **Light Minimal Porcelain** themes.
- A dynamic **Theme Switcher** (sun/moon toggle) must be easily accessible in the header/navigation at all times.
- Persist the selected theme in local storage so the user's preference is remembered across sessions.

## 2. Aesthetics: Liquid Glass & Glassmorphism
- Never use flat, plain, or boring styles (no plain gray backgrounds or generic HTML tables).
- Apply frosted glass cards (`backdropFilter: 'blur(16px)'` on web, translucent elevated cards on mobile).
- Add specular highlights to top borders (`borderTopWidth: 1.5`, lighter alpha) to simulate light reflecting off polished glass.
- Use curated, vibrant accents:
  - Electric Indigo (`#6366F1`) / Vibrant Indigo (`#4F46E5`) for primary actions.
  - Emerald (`#10B981` / `#059669`) for positive scores and success indicators.
  - Crimson (`#EF4444` / `#DC2626`) for penalties and negative scores.
  - Amber (`#F59E0B` / `#D97706`) for over-trick warnings and dealer badges.

## 3. 13-Round Game Input UX
- Provide a smooth **turn-by-turn sequential flow** for entering round details:
  - **Phase A (Bids):** Players 1 to 4 select calls (1–13) sequentially with auto-advance.
  - **Phase B (Results):** Players 1 to 4 select tricks won (0–13) with a live remaining counter ("X of 13 remaining").
  - The submit button must only be active when the sum of tricks equals exactly 13.
- Use **Quick-Tap Number Chips** (minimum 44x44px touch targets) so users never have to use the mobile on-screen keyboard.

## 4. Full Scoreboard & History
- Provide a toggleable **13-Round Matrix Table** showing all rounds (1 to 13) and all 4 players with cumulative scores, dealer markers, and color-coded score tags.
- Include a **player filter** in the Match History screen to review individual player performance over time.
