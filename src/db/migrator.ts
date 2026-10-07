import * as path from 'node:path';
import { promises as fs } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { Kysely, PostgresDialect } from 'kysely';
import { Migrator, FileMigrationProvider } from 'kysely/migration';
import pg from 'pg';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function migrate() {
  const db = new Kysely<any>({
    dialect: new PostgresDialect({
      pool: new pg.Pool({
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'postgres',
        database: process.env.POSTGRES_DB || 'module07assignment',
      }),
    }),
  });

  const migrationFolder = path.join(__dirname, 'migrations');

  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder,
      import: async (filePath: string) => {
        console.log(`Loading migration: ${filePath}`);

        const fileUrl = pathToFileURL(filePath).href;

        console.log(`Importing migration: ${fileUrl}`);

        return import(fileUrl);
      },
    }),
  });

  const direction = process.argv[2];

  const { error, results } =
    direction === 'down'
      ? await migrator.migrateDown()
      : await migrator.migrateToLatest();

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(
        `migration "${it.migrationName}" was executed successfully`
      );
    } else if (it.status === 'Error') {
      console.error(
        `failed to execute migration "${it.migrationName}"`
      );
    }
  });

  if (error) {
    console.error('failed to migrate');
    console.error(error);
    await db.destroy();
    process.exit(1);
  }

  await db.destroy();
}

migrate();
