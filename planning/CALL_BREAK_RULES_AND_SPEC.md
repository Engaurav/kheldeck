# Call Break: Authentic Offline Rules, Scoring Engine & UX Specification

## 1. Game Overview & Offline Rules
Call Break is a 4-player trick-taking card game played with a standard 52-card deck (without Jokers). This specification details the **authentic offline rules** played by real-world players in India and Nepal.

### 🃏 Key Game Mechanics
- **Players:** Exactly 4 players.
- **Deck:** Standard 52-card deck (no Jokers).
- **Card Hierarchy (Highest to Lowest):** A, K, Q, J, 10, 9, 8, 7, 6, 5, 4, 3, 2.
- **Permanent Trump (Hukum):** Spades (♠) is always the default trump suit. A spade card beats any card of other suits.
- **Dealing:** 13 cards dealt to each of the 4 players per round (52 cards total).
- **Game Length:** Exactly **13 rounds** in a full standard offline match.

---

## 2. Play Flow & Rules

### Phase 1: Bidding Phase (कॉल / बोली)
- Starting from the player to the dealer's right, each player announces their **Call (Bid)**—the minimum number of hands (tricks) they promise to win.
- Minimum call: **1**.
- Maximum call: **13**.
- Calls are recorded before any card is played in the round.

### Phase 2: Playing Phase (चाल चलना)
- The player to the dealer's right leads the first trick.
- **Must Follow Suit:** Players must play a card of the same suit led if they have one.
- **Higher Card Rule:** Players must play a higher card than the current winning card if possible.
- **Trump if Void:** If a player has no cards of the led suit, they must play a Spade (Trump) to win the trick, or discard another suit if they have no spades.
- The trick winner leads the next trick until all 13 tricks are played on the table.

### Phase 3: Authentic Integer Scoring Rules (गणना)
Scores are calculated as whole numbers (integers), **NOT decimals**:

Let:
- $C = \text{Call (Bid)}$
- $R = \text{Result (Actual Tricks Won)}$

#### Rule 1: Under-trick Penalty ($R < C$)
If a player fails to make their call, they lose 10 times their call as a negative penalty:
$$\text{Score} = -(C \times 10)$$
- *Example:* Call = 5, Result = 4 ➔ **`-50`**
- *Example:* Call = 4, Result = 2 ➔ **`-40`**
- *Example:* Call = 3, Result = 0 ➔ **`-30`**

#### Rule 2: Safe Win ($C \le R \le C + 2$)
If a player makes their call and wins up to 2 extra hands, they get 10 points per call plus 1 point per extra hand:
$$\text{Score} = (C \times 10) + (R - C)$$
- *Example:* Call = 4, Result = 4 ➔ $40 + 0 =$ **`+40`**
- *Example:* Call = 4, Result = 5 ➔ $40 + 1 =$ **`+41`**
- *Example:* Call = 4, Result = 6 ➔ $40 + 2 =$ **`+42`**

#### Rule 3: Over-trick Penalty ($R > C + 2$)
If a player cuts/wins **more than 2 extra hands** over their call, the call is busted and penalized with a negative score:
$$\text{Score} = -((C \times 10) + (R - C))$$
- *Example:* Call = 4, Result = 7 (extra = 3 > 2) ➔ $-(40 + 3) =$ **`-43`**
- *Example:* Call = 4, Result = 8 (extra = 4 > 2) ➔ $-(40 + 4) =$ **`-44`**
- *Example:* Call = 2, Result = 5 (extra = 3 > 2) ➔ $-(20 + 3) =$ **`-23`**

---

## 3. UI/UX Ultra Pro Max: 13-Round Experience

### A. Dual Theme Support & Aesthetics
- **Dynamic Theme Switcher:** 1-click toggle between:
  - 🌙 **Dark Liquid Cyber:** Deep obsidian `#0B0F19`, translucent glass cards, neon indigo/cyan accents.
  - ☀️ **Light Minimal Porcelain:** Crisp slate `#F8FAFC`, frosted porcelain glass, high daylight readability.
- **Liquid Glass Styling:** Specular top border sheen, soft ambient backdrop blur (`blur(16px)`), subtle elevation.

### B. Sequential Turn-by-Turn Player Input Flow (Per Round)
Call Break requires logging data for 4 players across 13 rounds. To make entry effortless on mobile:

1. **Phase A: Enter Calls (At start of round):**
   - Sequential step for Player 1 (Dealer+1) ➔ Player 2 ➔ Player 3 ➔ Player 4 (Dealer 👑).
   - Quick-tap number chips `[1] [2] [3] ... [13]` (minimum 44px touch targets).
   - Auto-advance to the next player upon selection.
   - Summary bar shows table total calls.
   - `[Confirm Bids]` locks the phase while the round is played offline.

2. **Phase B: Enter Tricks Won (At end of round):**
   - Each player selects their won tricks `[0] [1] [2] ... [13]`.
   - **Live Counter:** Dynamically shows "Remaining Tricks: X of 13".
   - **Instant Score Preview:** Shows resulting score (`+41`, `-40`, `-43` penalty alert) in real time.
   - Validation: The `[Complete Round]` button activates ONLY when total tricks equal **exactly 13**.
   - Upon completion, dealer automatically advances to the next player for the next round.

### C. 13-Round Matrix Scoreboard (Scorecard View)
- Accessible anytime via the **"Scorecard"** view toggle.
- **Columns:** 4 Players (with cumulative score, win status, and rank badges #1 to #4).
- **Rows:** 13 Rows for Rounds 1 through 13.
- **Cell Details:** Displays `Call | Won` with colored score badge (Emerald for positive, Crimson for negative, Amber for warnings).

---

## 4. User Profiles, Players & History Tracking

### 1. Authentication & Scoped Storage
- **Email & Password Authentication:** Secure sign up, login, and session persistence.
- **Personal Game Profile:** Each user has their own isolated set of saved players, match history, and statistics.
- **Offline-First:** Matches play and save 100% offline via local storage; auto-syncs to Cloud Firestore when internet is available.

### 2. Player Management
- Add, edit, and delete players per user account.
- When starting a new game, pick 4 players from recent/saved list with 1 tap, or add new players inline.

### 3. History Filtering by Player
- Filter past matches by individual player to view:
  - Total matches played.
  - Win rate & average score per match.
  - Round-by-round breakdown of any historical game.
