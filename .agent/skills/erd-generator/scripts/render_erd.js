#!/usr/bin/env node

import { exec } from "node:child_process";

const input = process.argv[2] || "docs/architecture/schema.mmd";
const output = "docs/architecture/erd.svg";

const cmd = `npx mmdc -i "${input}" -o "${output}"`;

exec(cmd, (error, stdout, stderr) => {
  if (error) {
    console.error("SYNTAX_ERROR:", stderr || error.message);
    process.exit(1);
  } else {
    console.log("SUCCESS");
    process.exit(0);
  }
});
