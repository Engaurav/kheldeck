---
name: ui-ux-ultra-pro-max
description: >-
  Ultra-premium design system, modern minimalist aesthetics, liquid glass, glassmorphism,
  dual Light/Dark themes with dynamic switching, and mobile-ergonomic turn-by-turn game scoring UX.
  Use when designing or implementing UI components, themes, layouts, round inputs, and animations.
---

# 🎨 UI/UX Ultra Pro Max: Design System & Experience Guide

This skill defines the visual architecture, thematic styling, and tactile UX patterns for **Game Track** (Call Break & future card/board games).

---

## 1. Core Visual Philosophy: "Minimalist Liquid Glass"
The application must feel like a modern, state-of-the-art gaming dashboard—not a boring spreadsheet or basic counter.
- **Glassmorphism & Depth:** Translucent frosted panels, subtle multi-layered elevations, and thin specular highlights on borders.
- **Liquid Sheen:** Smooth gradient reflections and ambient glows that react smoothly to touch and state transitions.
- **High Information Density with Breathing Room:** Compact yet clean data layouts tailored for both mobile phone screens and widescreen desktop browsers.
- **Thumb-Zone Ergonomics:** All interactive numeric inputs (calls 1–13, tricks 0–13) must be touch-friendly chips (minimum 44–48px hit targets) requiring zero virtual keyboard typing.

---

## 2. Dual Theming Engine (Light & Dark with Dynamic Switcher)

The application supports seamless 1-click theme switching between **Dark Liquid Cyber** and **Light Minimal Porcelain**.

### Theme Tokens Overview

| Token Category | 🌙 Dark Liquid Cyber | ☀️ Light Minimal Porcelain |
| :--- | :--- | :--- |
| **Canvas Background** | `#0B0F19` (Deep Obsidian / Midnight) | `#F8FAFC` (Pure Crisp Slate 50) |
| **Surface (Card / Glass)** | `rgba(17, 24, 39, 0.75)` + `backdrop-blur(16px)` | `rgba(255, 255, 255, 0.85)` + `backdrop-blur(16px)` |
| **Card Borders** | `rgba(255, 255, 255, 0.10)` (Top: `rgba(255, 255, 255, 0.20)`) | `rgba(15, 23, 42, 0.08)` (Top: `rgba(255, 255, 255, 0.90)`) |
| **Primary Text** | `#F9FAFB` (Crisp White) | `#0F172A` (Deep Slate 900) |
| **Secondary Text** | `#94A3B8` (Slate 400) | `#64748B` (Slate 500) |
| **Primary Accent** | `#6366F1` (Electric Indigo) / `#38BDF8` (Cyan) | `#4F46E5` (Vibrant Indigo) / `#0284C7` (Sky) |
| **Success / Positive Score** | `#10B981` (Emerald Glow) | `#059669` (Deep Emerald) |
| **Penalty / Negative Score** | `#EF4444` (Crimson Alert) | `#DC2626` (Bright Crimson) |
| **Warning / Over-trick Alert**| `#F59E0B` (Amber Flame) | `#D97706` (Amber Bronze) |

*Detailed color tokens and CSS/StyleSheet definitions can be found in [design-tokens.md](./references/design-tokens.md).*

---

## 3. Call Break 13-Round UX: Turn-by-Turn Player Input Flow

Call Break has **13 rounds**, with 4 players per round. Entering data must be lightning fast and zero-friction.

### 🔄 The 2-Phase Turn-by-Turn Sequential Wizard

Instead of overwhelming players with a giant empty grid of 26 text fields at once, each round runs through an intuitive 2-phase stepper:

```
[Round Header: Round X of 13 | Dealer: Alice 👑]
                │
                ▼
      ┌─────────────────────┐
      │  PHASE A: BIDDING   │ ◄── At Start of Round
      └─────────────────────┘
         Player 1 (Dealer+1) picks Bid [1..13]
         ➔ Auto-advance to Player 2 picks Bid [1..13]
         ➔ Auto-advance to Player 3 picks Bid [1..13]
         ➔ Auto-advance to Player 4 (Dealer) picks Bid [1..13]
         [Bids Locked & Saved! Game in play offline]
                │
                ▼ (Card play happens offline on table)
                │
      ┌─────────────────────┐
      │  PHASE B: RESULTS   │ ◄── At End of Round (13 tricks played)
      └─────────────────────┘
         Player 1 enters Won Tricks [0..13]
         Player 2 enters Won Tricks [0..13]
         Player 3 enters Won Tricks [0..13]
         Player 4 enters Won Tricks [0..13]
         
         ⭐ Dynamic Live Counter: "Tricks Remaining: X of 13"
         ⭐ Instant Score Preview for each player:
            - Won >= Bid & Won <= Bid+2 ➔ Green (+Points)
            - Won < Bid ➔ Red (-Points)
            - Won > Bid+2 ➔ Over-trick Penalty Alert (-Points)
         
         [Complete Round Button: Active ONLY when Total Tricks == 13]
                │
                ▼
      [Round Score Matrix updated & next round dealer rotated]
```

### 📊 Full 13-Round Matrix (Bird's Eye Scorecard)
- Accessible anytime via a **"Scorecard / Grid"** toggle tab.
- **Columns:** The 4 Players (with cumulative score & current rank badge #1, #2, #3, #4 in header).
- **Rows:** Round 1 to Round 13.
- **Each Cell:** Shows `Call | Result` and the resulting colored point badge (`+41`, `-40`, `-43`).
- **Footer:** Grand Total with live leader highlight.

*Detailed UX wireframes and interaction specs are in [round-input-ux.md](./references/round-input-ux.md).*

---

## 4. Glassmorphism & Liquid Glass Recipes

For React Native / Web styling:
- **Liquid Sheen Highlight:** A top border with a 1px lighter opacity creates realistic glass thickness (`borderTopWidth: 1`, `borderTopColor: rgba(255,255,255,0.25)`).
- **Layered Frosted Glass:** Background translucent fills paired with soft box shadows create tangible surface depth.
- **Haptic & Visual Feedback:** Every button press produces a scale-down micro-interaction (`transform: [{ scale: 0.96 }]`) and subtle glow ring.

*See [glassmorphism-liquid-glass.md](./references/glassmorphism-liquid-glass.md) for complete code snippets.*
