import { Kysely } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  await db.schema
    .createTable('borrowers')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').onDelete('cascade').unique()
    )
    .addColumn('card_number', 'varchar')
    .addColumn('phone', 'varchar')
    .addColumn('membership_status', 'varchar')
    .addColumn('created_at', 'timestamp')
    .execute();

  await db.schema
    .createTable('authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar')
    .addColumn('bio', 'varchar')
    .addColumn('created_at', 'timestamp')
    .execute();

  await db.schema
    .createTable('genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar')
    .addColumn('description', 'varchar')
    .execute();

  await db.schema
    .createTable('books')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('title', 'varchar')
    .addColumn('isbn', 'varchar')
    .addColumn('published_year', 'integer')
    .addColumn('author_id', 'integer', (col) =>
      col.references('authors.id').onDelete('cascade')
    )
    .addColumn('genre_id', 'integer', (col) =>
      col.references('genres.id').onDelete('cascade')
    )
    .addColumn('created_at', 'timestamp')
    .execute();

  await db.schema
    .createTable('loans')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('borrower_id', 'integer', (col) =>
      col.references('borrowers.id').onDelete('cascade')
    )
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.id').onDelete('cascade')
    )
    .addColumn('loan_date', 'timestamp')
    .addColumn('due_date', 'timestamp')
    .addColumn('status', 'varchar')
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('loans').execute();
  await db.schema.dropTable('books').execute();
  await db.schema.dropTable('genres').execute();
  await db.schema.dropTable('authors').execute();
  await db.schema.dropTable('borrowers').execute();
}

