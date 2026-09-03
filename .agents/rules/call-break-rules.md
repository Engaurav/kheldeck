# Call Break Offline Scoring & Game Rules

When implementing, modifying, or testing any Call Break logic, these authentic offline rules must be enforced:

## 1. Game Structure
- Exactly **4 players**.
- Exactly **13 rounds** in a full match.
- Each round consists of 52 cards dealt equally (13 cards / tricks per round).
- In every round, the sum of tricks won by the 4 players must equal **exactly 13**.

## 2. Integer Scoring Formula
Scores are calculated as whole numbers (integers), NOT decimals:

1. **Under-trick Penalty ($Result < Call$):**
   $$\text{Score} = -(Call \times 10)$$
   *Example:* Call 5, Result 4 ➔ `-50`

2. **Safe Win ($Call \le Result \le Call + 2$):**
   $$\text{Score} = (Call \times 10) + (Result - Call)$$
   *Example:* Call 4, Result 4 ➔ `40`
   *Example:* Call 4, Result 5 ➔ `41`
   *Example:* Call 4, Result 6 ➔ `42`

3. **Over-trick Penalty ($Result > Call + 2$):**
   If a player wins more than 2 extra hands over their call, the call is busted:
   $$\text{Score} = -((Call \times 10) + (Result - Call))$$
   *Example:* Call 4, Result 7 (extra = 3 > 2) ➔ `-(40 + 3) = -43`
   *Example:* Call 4, Result 8 (extra = 4 > 2) ➔ `-(40 + 4) = -44`
   *Example:* Call 2, Result 5 (extra = 3 > 2) ➔ `-(20 + 3) = -23`

## 3. Storage & User Profile Scope
- Games, saved players, and history must be scoped to the authenticated user.
- Offline data must be stored instantly via local storage (`AsyncStorage`) and synced to Firebase when online.
