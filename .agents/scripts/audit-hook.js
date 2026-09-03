// Antigravity Lifecycle Hook Handler
// Reads system event JSON payload from stdin and outputs standard JSON response

let inputData = '';
process.stdin.on('data', chunk => {
  inputData += chunk;
});

process.stdin.on('end', () => {
  // Output empty JSON object as required by PostToolUse specification
  process.stdout.write('{}');
});
