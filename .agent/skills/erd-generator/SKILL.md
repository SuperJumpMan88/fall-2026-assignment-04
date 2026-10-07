---
name: erd-generator
description: >
  Generates and validates Mermaid ERDs from domain requirements when asked to
  design an ERD, data model, database schema, or architecture diagram.
  Compiles the Mermaid ERD to SVG and self-corrects Mermaid syntax errors.
---

# Workflow

1. Parse the user's domain requirements into entities, attributes, primary keys
   (PKs), foreign keys (FKs), and relationship cardinalities.

2. Write the Mermaid `erDiagram` directly to:
   `docs/architecture/schema.mmd`

3. Execute:

   `node .agent/skills/erd-generator/scripts/render_erd.js docs/architecture/schema.mmd`

4. If the script prints `SYNTAX_ERROR:`:
   - Read the error trace.
   - Identify and fix the Mermaid syntax problem.
   - Rewrite `docs/architecture/schema.mmd`.
   - Re-run the renderer.
   - Retry up to 3 times.

5. On successful rendering:
   - Return the raw Mermaid code block.
   - Reference the generated SVG asset:
     `docs/architecture/erd.svg`

6. Do not consider the ERD complete until the renderer exits
   successfully and `docs/architecture/erd.svg` exists.
