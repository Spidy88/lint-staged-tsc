#!/usr/bin/env node

import { spawnSync } from 'child_process';

const args = process.argv.slice(2);

// Staged files (simple extension filter to avoid cli args)
const files = args.filter(file => /\.(ts|tsx|js|jsx|cjs|cjsx|mjs|mjsx)$/.test(file))
if (files.length === 0) {
  process.exit(0)
}

// Attach cleanup handlers
let didCleanup = false
for (const eventName of ['exit', 'SIGHUP', 'SIGINT', 'SIGTERM']) {
  process.on(eventName, exitCode => {
    if (didCleanup) return
    didCleanup = true

    if (eventName !== 'exit') {
      process.exit(exitCode)
    }
  });
}

// Run tsc-files
const { stdout } = spawnSync(
  'tsc-files',
  args,
  { stdio: 'pipe' },
)

const PROBLEM_START = /^(.+)(\(\d+,\d+\)):\s+(error|warn)\s+(.+):\s+(.+)$/;
const outputLines = stdout.toString().split(/[\r\n]+/);

let errorCount = 0;
let belongsToMatch = false;
outputLines
  .filter((line) => {
    const match = PROBLEM_START.exec(line);

    if (match) {
      const [_line, filepath, _location, type, _code, _message] = match;

      // If the file is in our staged files, passthrough its output
      if (files.some((file) => file.endsWith(filepath))) {
        belongsToMatch = true;

        if (type === 'error') {
          ++errorCount;
        }

        return true;
      }
      else {
        belongsToMatch = false;
      }
    }

    // If its not a match but belongs to a previous match (the error description lines), then keep them
    if (!match && belongsToMatch) {
      return true;
    }

    return false;
  })
  .forEach((line) => console.log(line));

process.exit(errorCount);
