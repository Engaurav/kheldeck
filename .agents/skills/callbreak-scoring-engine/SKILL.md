---
name: callbreak-scoring-engine
description: >-
  Authentic offline Call Break scoring engine, mathematical formulas, trick validation (13 tricks total),
  round scoring rules with over-trick penalty, and match rankings.
  Use when implementing or testing game score calculation, round validation, or match history.
---

# 🎴 Call Break Offline Scoring Engine

This skill encapsulates the authentic offline scoring logic, mathematical rules, and game validation used for real-world Call Break card games.

---

## 1. Game Setup & Invariants
- **Number of Players:** Exactly 4.
- **Number of Rounds:** Exactly 13 rounds in a full standard match.
- **Tricks per Round:** Exactly 13 tricks dealt and played (52 cards ÷ 4 players = 13 tricks).
- **Trick Invariant:** In every round, the sum of tricks won by all 4 players must equal exactly 13:
  $$\sum_{i=1}^{4} \text{TricksWon}_i = 13$$

---

## 2. Mathematical Scoring Rules (Per Player Per Round)

Let:
- $C = \text{Call (Bid entered before playing)}$, where $1 \le C \le 13$
- $R = \text{Result (Actual tricks won during the round)}$, where $0 \le R \le 13$

### Rule 1: Under-trick Penalty (Bust / Failed Call)
If a player fails to win at least as many tricks as their Call ($R < C$):
$$\text{Score} = -(C \times 10)$$

*Examples:*
- $C = 5, R = 4 \implies -(5 \times 10) = -50$
- $C = 4, R = 3 \implies -(4 \times 10) = -40$
- $C = 3, R = 0 \implies -(3 \times 10) = -30$

---

### Rule 2: Safe Win (Call Achieved with up to 2 Extra Tricks)
If a player achieves their Call, and does not exceed it by more than 2 extra hands ($C \le R \le C + 2$):
$$\text{Score} = (C \times 10) + (R - C)$$

*Examples:*
- $C = 4, R = 4 \implies (4 \times 10) + (4 - 4) = 40$
- $C = 4, R = 5 \implies (4 \times 10) + (5 - 4) = 41$
- $C = 4, R = 6 \implies (4 \times 10) + (6 - 4) = 42$
- $C = 1, R = 3 \implies (1 \times 10) + (3 - 1) = 12$

---

### Rule 3: Over-trick Penalty (Over-cut / More than 2 Extra Tricks)
If a player wins more than 2 extra tricks beyond their Call ($R > C + 2$):
The excess over-tricks invalidate the call and turn the entire round into a negative penalty!
$$\text{Score} = -((C \times 10) + (R - C))$$

*Examples:*
- $C = 4, R = 7$ (extra = 3 > 2) $\implies -((4 \times 10) + 3) = -43$
- $C = 4, R = 8$ (extra = 4 > 2) $\implies -((4 \times 10) + 4) = -44$
- $C = 2, R = 5$ (extra = 3 > 2) $\implies -((2 \times 10) + 3) = -23$

---

## 3. Pure TypeScript Engine Implementation Reference

```typescript
export interface RoundInput {
  call: number;   // 1 to 13
  result: number; // 0 to 13
}

export interface RoundScoreBreakdown {
  score: number;
  status: 'SAFE_WIN' | 'UNDER_TRICK' | 'OVER_TRICK_PENALTY';
  message: string;
}

export function calculateRoundScore(input: RoundInput): RoundScoreBreakdown {
  const { call, result } = input;

  if (result < call) {
    const score = -(call * 10);
    return {
      score,
      status: 'UNDER_TRICK',
      message: `Failed call of ${call} (won ${result}). Penalty: ${score}`,
    };
  }

  const extra = result - call;

  if (extra <= 2) {
    const score = (call * 10) + extra;
    return {
      score,
      status: 'SAFE_WIN',
      message: `Made call of ${call} + ${extra} extra. Score: +${score}`,
    };
  }

  // Over-trick penalty: extra > 2
  const score = -((call * 10) + extra);
  return {
    score,
    status: 'OVER_TRICK_PENALTY',
    message: `Exceeded call of ${call} by ${extra} tricks (> 2 extra). Penalty: ${score}`,
  };
}

export function validateRoundTricks(results: number[]): { valid: boolean; sum: number; diff: number } {
  const sum = results.reduce((acc, curr) => acc + curr, 0);
  return {
    valid: sum === 13,
    sum,
    diff: 13 - sum,
  };
}
```
