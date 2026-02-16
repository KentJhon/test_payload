import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "ticket_templates" ADD COLUMN IF NOT EXISTS "print_settings" jsonb;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "ticket_templates" DROP COLUMN IF EXISTS "print_settings";
  `)
}
