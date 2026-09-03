// Standalone test runner for Call Break offline scoring engine

function calculatePlayerScore(call, result) {
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

  const score = -((call * 10) + extra);
  return {
    score,
    status: 'OVER_TRICK_PENALTY',
    message: `Exceeded call of ${call} by ${extra} tricks (> 2 extra). Penalty: ${score}`,
  };
}

function validateRoundTricks(results) {
  const total = results.reduce((acc, curr) => acc + (isNaN(curr) ? 0 : curr), 0);
  const remaining = 13 - total;
  return {
    isValid: total === 13,
    total,
    remaining,
  };
}

let passed = 0;
let failed = 0;

function assertEqual(actual, expected, description) {
  if (actual === expected) {
    console.log(`✅ PASS: ${description}`);
    passed++;
  } else {
    console.error(`❌ FAIL: ${description} | Expected ${expected}, got ${actual}`);
    failed++;
  }
}

console.log('--- RUNNING CALL BREAK SCORING ENGINE TESTS ---\n');

// 1. Under-trick Penalty Tests
assertEqual(calculatePlayerScore(5, 4).score, -50, 'Call 5, Result 4 => -50');
assertEqual(calculatePlayerScore(4, 3).score, -40, 'Call 4, Result 3 => -40');
assertEqual(calculatePlayerScore(3, 0).score, -30, 'Call 3, Result 0 => -30');
assertEqual(calculatePlayerScore(1, 0).score, -10, 'Call 1, Result 0 => -10');

// 2. Safe Win Tests (call <= result <= call + 2)
assertEqual(calculatePlayerScore(4, 4).score, 40, 'Call 4, Result 4 => 40');
assertEqual(calculatePlayerScore(4, 5).score, 41, 'Call 4, Result 5 => 41');
assertEqual(calculatePlayerScore(4, 6).score, 42, 'Call 4, Result 6 => 42');
assertEqual(calculatePlayerScore(2, 2).score, 20, 'Call 2, Result 2 => 20');
assertEqual(calculatePlayerScore(2, 4).score, 22, 'Call 2, Result 4 => 22');

// 3. Over-trick Penalty Tests (result > call + 2)
assertEqual(calculatePlayerScore(4, 7).score, -43, 'Call 4, Result 7 (extra 3 > 2) => -43');
assertEqual(calculatePlayerScore(4, 8).score, -44, 'Call 4, Result 8 (extra 4 > 2) => -44');
assertEqual(calculatePlayerScore(2, 5).score, -23, 'Call 2, Result 5 (extra 3 > 2) => -23');
assertEqual(calculatePlayerScore(1, 4).score, -13, 'Call 1, Result 4 (extra 3 > 2) => -13');

// 4. Validation Tests
assertEqual(validateRoundTricks([4, 3, 4, 2]).isValid, true, 'Tricks [4,3,4,2] sum to 13 => valid');
assertEqual(validateRoundTricks([5, 3, 4, 2]).isValid, false, 'Tricks [5,3,4,2] sum to 14 => invalid (>13)');
assertEqual(validateRoundTricks([3, 3, 3, 3]).isValid, false, 'Tricks [3,3,3,3] sum to 12 => invalid (<13)');
assertEqual(validateRoundTricks([3, 3, 3, 3]).remaining, 1, 'Tricks [3,3,3,3] has 1 remaining');

console.log(`\nRESULTS: ${passed} passed, ${failed} failed.`);
if (failed > 0) process.exit(1);
