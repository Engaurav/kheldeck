# Round Input UX: Turn-by-Turn Player Wizard (Call Break 13 Rounds)

In offline Call Break games, passing the phone around or having the scorekeeper record inputs player-by-player must be effortless. This document outlines the turn-by-turn input design.

---

## 1. Problem with Standard Tables vs Solution

❌ **The Bad Pattern:** Presenting a large grid with 26 text-inputs simultaneously. Users accidentally type in the wrong cell, the on-screen keyboard pops up and covers the screen, and numbers must be manually backspaced.

✅ **The Ultra Pro Max Pattern:** A focused **Sequential Player Card / Carousel** with big numeric quick-tap chips (no keyboard needed), auto-advancing from player to player.

---

## 2. Round Lifecycle UX

### Step 1: Round Header Bar
```
┌────────────────────────────────────────────────────────┐
│  Round 4 of 13   ●●●●○○○○○○○○○          Dealer: Priya 👑 │
└────────────────────────────────────────────────────────┘
```
- Shows active round index out of 13.
- Visual progress dots / pill tracker.
- Clearly flags who the dealer is for this round.
- Turn order starts with the player **to the right/next to the dealer**, finishing with the dealer.

---

### Step 2: Phase A – Call (Bidding) Flow

Each player's turn to announce their call is presented one at a time (or 4 focused cards in turn order):

```
┌────────────────────────────────────────────────────────┐
│  STEP 1: ENTER BIDS (CALLS)                            │
│                                                        │
│  [ Rahul ] ──► CURRENT TURN (Dealer + 1)                │
│  Select Call (1 - 13):                                 │
│  ┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐  │
│  │ 1 │ 2 │[3]│ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │ 10│ 11│ 12│ 13│  │
│  └───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘  │
│                                                        │
│  Players:                                              │
│  1. Rahul: 3  ✓                                        │
│  2. Aman:  [Selecting...]                              │
│  3. Sneha: [Pending]                                   │
│  4. Priya (👑): [Pending]                               │
│                                                        │
│  Table Total Calls: 3 / min suggested: 8               │
└────────────────────────────────────────────────────────┘
```
- **Auto-Advance:** When Rahul taps `[3]`, selection pulses with haptic/visual glow, and Aman's card immediately becomes active.
- **Correction:** Tapping any already-filled player card lets the scorekeeper edit their bid immediately.
- **Lock Phase A:** Once all 4 players have placed their calls, a button `[Confirm Bids & Start Round]` locks the bids. The phone can be set down while players play their 13 card hands offline!

---

### Step 3: Phase B – Actual Result (Tricks Won) Flow

Once the 13 tricks have finished playing on the table:

```
┌────────────────────────────────────────────────────────┐
│  STEP 2: ENTER TRICKS WON                              │
│  Remaining Tricks to Assign: [ 4 of 13 ] 🟡             │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Rahul (Bid: 3)                                    │  │
│  │ Tricks Won:                                      │  │
│  │ [0] [1] [2] [3] [4] [5] [6] [7] [8] ...          │  │
│  │ Selected: 4  ➔  Round Score: +41  🟢              │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Aman (Bid: 4)                                     │  │
│  │ Tricks Won:                                      │  │
│  │ Selected: 2  ➔  Round Score: -40  🔴 (Failed)     │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Sneha (Bid: 2)                                    │  │
│  │ Tricks Won:                                      │  │
│  │ Selected: 5  ➔  Round Score: -23  ⚠️ (Busted >+2) │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Priya 👑 (Bid: 3)                                 │  │
│  │ Tricks Won: [Select 0..13]                       │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
│  [ Complete Round 4 ] (Disabled until remaining == 0)   │
└────────────────────────────────────────────────────────┘
```

#### Smart Validation & Instant Preview:
1. **Live Remaining Counter:**
   - Starts at 13.
   - As each player's result is set, counter decreases.
   - If sum > 13: Glows bright red (`Total exceeded 13 by X`).
   - If sum < 13: Shows amber warning (`X tricks remaining`).
   - When sum == 13: Glows emerald green (`All 13 tricks accounted for!`).
2. **Instant Score Feedback:**
   - Shows calculated integer score instantly with rule tag:
     - `+41` (Made call with 1 extra hand)
     - `-40` (Failed bid)
     - `-23` (Over-trick penalty: won 5 with bid 2, extra hands > 2!)
3. **Lock & Rotate:**
   - Tapping `[Complete Round]` writes the round to local storage, displays the updated full scoreboard, and rotates the dealer indicator to the next player for Round 5.
