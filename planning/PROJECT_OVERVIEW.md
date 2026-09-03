# Multi-Game Offline Score Tracker (Game Track)

## 📌 Project Overview
A modern, cross-platform (Web & Android APK) offline score tracking application for real-world card and board games.

The app is **100% Offline-First**: you can sit with friends, track rounds, bids, tricks, and scores with zero internet connection. Whenever internet is available, all match data, player history, and stats seamlessly back up to **Google Firebase**.

---

## 🎯 Key Objectives & Requirements

1. **Visual Excellence (UI/UX Ultra Pro Max):**
   - **Dual Themes:** Instant switching between **Dark Liquid Cyber** (deep obsidian, neon glow) and **Light Minimal Porcelain** (crisp slate, frosted glass).
   - **Liquid Glass & Glassmorphism:** Translucent layered cards, top specular edge sheen, tactile micro-animations.
   - **Touch Ergonomics:** 44px+ quick-tap number pads—no mobile virtual keyboard popups.

2. **Authentic Call Break Scoring Engine:**
   - Full match consisting of **13 rounds** (52 cards ÷ 4 players = 13 tricks per round).
   - **Integer Scoring System:**
     - Failed call ($Result < Call$): `-(Call * 10)`
     - Safe win ($Call \le Result \le Call + 2$): `Call * 10 + (Result - Call)`
     - Over-trick penalty ($Result > Call + 2$): `-(Call * 10 + (Result - Call))`
   - Real-time trick validation (sum of won tricks in each round must equal exactly 13).

3. **Turn-by-Turn Sequential Round Input UX:**
   - Round details entered player-by-player in turn order:
     - **Phase A (Bids):** Players 1–4 pick calls (1–13) with auto-advance.
     - **Phase B (Tricks):** Players 1–4 pick tricks won (0–13) with dynamic "Remaining Tricks: X of 13" counter and real-time score preview.
   - Comprehensive **13-Round Scorecard Matrix** view showing round-by-round point history.

4. **Player Management & Scoped Profiles:**
   - User account with Email & Password authentication.
   - Isolated player list and match history per user.
   - Filter past match history by specific player to analyze win rates and point trends.

5. **Cross-Platform Tech Stack (Option 1):**
   - **Frontend:** React Native with Expo (TypeScript) for Web + Android APK.
   - **Offline Storage:** `@react-native-async-storage/async-storage` (zero latency).
   - **Cloud Sync:** Google Firebase (Auth + Cloud Firestore free tier).

---

## 📁 Planning & Agent Customizations

- **Customizations Root:** [`.agents/`](file:///e:/Game%20Track/.agents/)
  - Skills: [`ui-ux-ultra-pro-max`](file:///e:/Game%20Track/.agents/skills/ui-ux-ultra-pro-max/SKILL.md), [`callbreak-scoring-engine`](file:///e:/Game%20Track/.agents/skills/callbreak-scoring-engine/SKILL.md)
  - Rules: [`ui-ux-design.md`](file:///e:/Game%20Track/.agents/rules/ui-ux-design.md), [`call-break-rules.md`](file:///e:/Game%20Track/.agents/rules/call-break-rules.md)
  - Master Workspace Rules: [`GEMINI.md`](file:///e:/Game%20Track/GEMINI.md)
- **Planning Directory:** [`planning/`](file:///e:/Game%20Track/planning/)
  - [`CALL_BREAK_RULES_AND_SPEC.md`](file:///e:/Game%20Track/planning/CALL_BREAK_RULES_AND_SPEC.md)
  - [`ARCHITECTURE_AND_ROADMAP.md`](file:///e:/Game%20Track/planning/ARCHITECTURE_AND_ROADMAP.md)
  - [`SETUP_GUIDE.md`](file:///e:/Game%20Track/planning/SETUP_GUIDE.md)
