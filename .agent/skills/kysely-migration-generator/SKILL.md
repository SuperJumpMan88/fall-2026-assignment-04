---
name: kysely-migration-generator
description: >
  Generates Kysely database migrations from Mermaid ERDs when asked to create,
  generate, or update a database migration from an ERD or schema.
---

# Workflow

1. Read the Mermaid ERD from:
   `docs/architecture/schema.mmd`

2. Parse every entity, attribute, primary key, foreign key, and relationship
   cardinality from the Mermaid ERD.

3. Convert Mermaid entity names to snake_case PostgreSQL table names.

4. Generate a new migration at:
   `src/db/migrations/<timestamp>_<migration_name>.ts`

5. The migration must export:
   - `up(db: Kysely<any>)`
   - `down(db: Kysely<any>)`

6. Primary keys:
   - Use an auto-generating integer ID for integer primary keys, such as
     `serial`.
   - Preserve UUID semantics when the ERD specifies UUIDs.

7. Foreign keys:
   - Create the corresponding foreign-key column.
   - Use `.references('<table>.<column>').onDelete('cascade')`.

8. Relationship cardinalities:
   - `||--o{` represents one-to-many.
   - `||--o|` represents one-to-one.
   - One-to-one relationships must enforce uniqueness on the foreign key.

9. Existing users table:
   - The `users` table already exists through the existing
     `001_initial_schema.ts` migration.
   - NEVER create or recreate the `users` table in the generated migration.
   - Foreign keys may reference `users.id`.

10. Migration dependency order:
    - Create referenced/dependent tables in an order that allows all foreign
      keys to be created successfully.
    - `down()` must drop tables in reverse dependency order.

11. Use appropriate PostgreSQL/Kysely types for Mermaid attributes:
    - `int` -> `integer`
    - `string` -> `varchar`
    - `timestamp` -> `timestamp`
    - Preserve primary-key and foreign-key constraints.

12. Before finishing:
    - Inspect the generated migration for TypeScript errors.
    - Run `npm run build`.
    - If the build fails because of the generated migration, fix the migration
      and rerun the build.
    - Do not modify unrelated project files.

13. Final response:
    - Report the generated migration path.
    - Summarize the tables and relationships created.
    - Explicitly state that the existing `users` table was not recreated.
    - Report the result of `npm run build`.

