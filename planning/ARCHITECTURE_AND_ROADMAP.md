# Technical Architecture & Implementation Roadmap

## 1. System Architecture Overview

Game Track is built on **React Native with Expo**, delivering a unified codebase for **Web Browsers** and **Android Mobile (APK)**.

```
game-track/
├── .agents/                       # Antigravity Skills, Rules & Hooks
│   ├── skills/
│   │   ├── ui-ux-ultra-pro-max/   # Dual theme tokens, liquid glass, turn-by-turn UX
│   │   └── callbreak-scoring-engine/ # Integer scoring & trick validation
│   ├── rules/                     # Coding & game rule constraints
│   ├── scripts/                   # Hook audit scripts
│   └── hooks.json                 # Lifecycle hook definitions
├── planning/                      # Architecture, Rules, and Setup specs
├── src/
│   ├── core/                      # Global infrastructure
│   │   ├── auth/                  # Firebase Email/Password Auth context & state
│   │   ├── storage/               # AsyncStorage offline database layer
│   │   ├── theme/                 # Dual Theme engine (Dark Liquid Cyber / Light Porcelain)
│   │   └── types/                 # Shared TypeScript data models
│   ├── components/                # Reusable UI components
│   │   ├── Navbar.tsx             # Header with theme switcher & auth avatar
│   │   ├── LiquidGlassCard.tsx    # Glassmorphism container with specular highlight
│   │   ├── PlayerPicker.tsx       # 4-player seat selector with quick chips
│   │   ├── NumberChipPad.tsx      # 44px quick-tap number selector (1-13)
│   │   └── ThemeToggle.tsx        # 1-click Sun/Moon toggle
│   ├── games/                     # Pluggable game modules
│   │   ├── callbreak/             # Call Break module
│   │   │   ├── engine/            # Pure TypeScript scoring logic (13 rounds, over-trick penalty)
│   │   │   ├── components/        # RoundStepper, LiveRemainingCounter, ScoreMatrix13
│   │   │   ├── screens/           # Dashboard, NewMatch, LiveMatch, Summary
│   │   │   └── types.ts
│   │   ├── teenpatti/             # Future module placeholder
│   │   └── rummy/                 # Future module placeholder
│   └── navigation/                # Expo Router / Navigation stack
├── App.tsx / index.ts
└── app.json
```

---

## 2. Data Models & Schemas

### A. User Profile Entity
```typescript
interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  createdAt: number;
}
```

### B. Player Entity (Per User)
```typescript
interface Player {
  id: string;               // Unique UUID
  userId: string;           // Owner's UID
  name: string;             // Display name (e.g., "Rahul")
  createdAt: number;
  lastPlayedAt: number;
  totalMatches: number;
  totalWins: number;
}
```

### C. Call Break Match Entity (13 Rounds)
```typescript
interface CallBreakRound {
  roundNumber: number;      // 1 to 13
  dealerIndex: number;      // 0 to 3
  calls: Record<string, number>;    // { playerId: callCount (1..13) }
  results: Record<string, number>;  // { playerId: tricksWon (0..13) }
  scores: Record<string, number>;   // { playerId: integerScore }
  isCompleted: boolean;
}

interface CallBreakMatch {
  id: string;                      // Unique match UUID
  userId: string;                  // Owner's UID
  gameType: 'callbreak';
  startedAt: number;
  completedAt?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  totalRounds: 13;                 // Exactly 13 rounds
  players: Player[];               // Exactly 4 players
  rounds: CallBreakRound[];        // Array of 13 rounds
  cumulativeScores: Record<string, number>; // { playerId: totalPoints }
  winnerId?: string;
}
```

---

## 3. Authentic Scoring Engine Logic

```typescript
export function computePlayerScore(call: number, result: number): number {
  // Case 1: Under-trick (Bust)
  if (result < call) {
    return -(call * 10);
  }
  
  const extra = result - call;
  
  // Case 2: Safe Win (call <= result <= call + 2)
  if (extra <= 2) {
    return (call * 10) + extra;
  }
  
  // Case 3: Over-trick Penalty (result > call + 2)
  return -((call * 10) + extra);
}
```

---

## 4. Phased Implementation Roadmap

### 🚀 Phase 1: Project Scaffolding & Theme Engine
- Initialize Expo project with TypeScript configured for Web and Android APK.
- Build the **Dual Theming Engine** (Light Minimal Porcelain & Dark Liquid Cyber) with instant theme switcher.
- Implement reusable `LiquidGlassCard`, `NumberChipPad` (44px touch targets), and Navigation layout.

### 🎴 Phase 2: Call Break Core Engine & Unit Tests
- Implement pure TypeScript Call Break scoring functions:
  - Integer scoring formula ($Result < Call$, Safe Win, Over-trick penalty).
  - Validation: sum of tricks in a round = 13.
- Write complete unit tests covering all 3 scoring conditions and edge cases.

### 👥 Phase 3: Player Management & 13-Round Input Stepper
- Build Player Management: Add, edit, delete players; quick 4-seat selector.
- Build Turn-by-Turn Sequential Round Wizard:
  - Phase A: Bids (1–13) per player with auto-advance.
  - Phase B: Tricks won (0–13) with live "Remaining Tricks: X of 13" counter.
- Build full **13-Round Matrix Scoreboard** with sticky headers and color-coded score tags.
- Wire up local storage (`AsyncStorage`) for instant zero-latency offline play.

### ☁️ Phase 4: Firebase Auth & Cloud Firestore Sync
- Setup Firebase Web Client SDK.
- Implement Email & Password Sign Up, Login, and Session management.
- Implement background Firestore sync for player lists and match history.
- Implement Player-wise match history filtering.

### 🌐 Phase 5: APK Build & Deployment
- Web build preview and deployment config.
- Standalone Android APK build configuration with Expo EAS.
