# Game Track: Project Architecture & Development Rules

## 1. Tech Stack & Execution Environment
- **Platform:** React Native with Expo (Cross-Platform: Web Browser + Android Mobile APK).
- **Language:** TypeScript with strict typing.
- **Offline Storage:** `@react-native-async-storage/async-storage` (zero latency, 100% offline-first).
- **Backend & Auth:** Google Firebase (Email/Password Auth + Cloud Firestore auto-sync).
- **Icons:** `lucide-react-native` or `@expo/vector-icons`.

---

## 2. Visual Standards: "UI/UX Ultra Pro Max"
- **Dual Themes:** The application must provide seamless switching between:
  - 🌙 **Dark Liquid Cyber:** Deep obsidian `#0B0F19`, glass cards, ambient indigo/cyan glows.
  - ☀️ **Light Minimal Porcelain:** Crisp slate `#F8FAFC`, frosted porcelain glass, high daylight readability.
- **Glassmorphism & Liquid Glass:** Translucent layered cards (`rgba(..., 0.75)` + backdrop-blur), top specular highlights (`borderTopColor: rgba(..., 0.22)`), and smooth tactile micro-animations.
- **Touch-First Controls:** All inputs (calls 1–13, tricks 0–13) must use minimum 44px quick-tap number chips—zero mobile virtual keyboard required.

---

## 3. Call Break Offline Rules
- **Structure:** 4 players, 13 rounds per game, 13 tricks per round.
- **Tricks Invariant:** Total tricks won in any round must equal exactly 13.
- **Integer Scoring:**
  1. $Result < Call \implies -(Call \times 10)$
  2. $Call \le Result \le Call + 2 \implies Call \times 10 + (Result - Call)$
  3. $Result > Call + 2 \implies -(Call \times 10 + (Result - Call))$ (Over-trick penalty!)
- **Turn-by-Turn Input UX:** Round data is entered sequentially for each player (Phase A: Calls, Phase B: Tricks won with live "X of 13 remaining" counter).

---

## 4. Skills & Customizations Location
- Detailed skills are located in `.agents/skills/`:
  - `ui-ux-ultra-pro-max/`: Theming tokens, liquid glass styling, and turn-by-turn UX patterns.
  - `callbreak-scoring-engine/`: Mathematical scoring formulas and validation routines.
- Rules are located in `.agents/rules/`.
