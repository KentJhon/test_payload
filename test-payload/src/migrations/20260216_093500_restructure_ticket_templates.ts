import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Create enum types for select fields
  await db.execute(sql`
    CREATE TYPE "enum_ticket_templates_ticket_settings_type" AS ENUM('ticket', 'convention-id', 'certificate', 'others');
    CREATE TYPE "enum_ticket_templates_ticket_settings_fit_mode" AS ENUM('cover', 'contain', 'stretch', 'original');
  `)

  // 2. Add new typed columns with defaults
  await db.execute(sql`
    ALTER TABLE "ticket_templates"
      ADD COLUMN "ticket_settings_type" "enum_ticket_templates_ticket_settings_type" DEFAULT 'ticket' NOT NULL,
      ADD COLUMN "ticket_settings_width" numeric DEFAULT 226.32258 NOT NULL,
      ADD COLUMN "ticket_settings_height" numeric DEFAULT 80 NOT NULL,
      ADD COLUMN "ticket_settings_fit_mode" "enum_ticket_templates_ticket_settings_fit_mode" DEFAULT 'cover' NOT NULL,
      ADD COLUMN "label_config_label_column" varchar DEFAULT '',
      ADD COLUMN "label_config_label_colors" jsonb DEFAULT '{}'::jsonb,
      ADD COLUMN "label_config_label_block_width" numeric DEFAULT 20,
      ADD COLUMN "label_config_right_block_enabled" boolean DEFAULT false,
      ADD COLUMN "label_config_right_block_width" numeric DEFAULT 20,
      ADD COLUMN "print_settings_ticket_gap" numeric DEFAULT 2;
  `)

  // 3. Migrate data from old jsonb columns into new typed columns
  await db.execute(sql`
    UPDATE "ticket_templates" SET
      "ticket_settings_type" = COALESCE(
        (ticket_settings->>'type')::text::"enum_ticket_templates_ticket_settings_type",
        'ticket'
      ),
      "ticket_settings_width" = COALESCE(
        (ticket_settings->>'width')::numeric,
        226.32258
      ),
      "ticket_settings_height" = COALESCE(
        (ticket_settings->>'height')::numeric,
        80
      ),
      "ticket_settings_fit_mode" = COALESCE(
        (ticket_settings->>'fitMode')::text::"enum_ticket_templates_ticket_settings_fit_mode",
        'cover'
      )
    WHERE ticket_settings IS NOT NULL;
  `)

  await db.execute(sql`
    UPDATE "ticket_templates" SET
      "label_config_label_column" = COALESCE(label_config->>'labelColumn', ''),
      "label_config_label_colors" = COALESCE(label_config->'labelColors', '{}'::jsonb),
      "label_config_label_block_width" = COALESCE((label_config->>'labelBlockWidth')::numeric, 20),
      "label_config_right_block_enabled" = COALESCE((label_config->>'rightBlockEnabled')::boolean, false),
      "label_config_right_block_width" = COALESCE((label_config->>'rightBlockWidth')::numeric, 20)
    WHERE label_config IS NOT NULL;
  `)

  await db.execute(sql`
    UPDATE "ticket_templates" SET
      "print_settings_ticket_gap" = COALESCE((print_settings->>'ticketGap')::numeric, 2)
    WHERE print_settings IS NOT NULL;
  `)

  // 4. Drop old jsonb columns
  await db.execute(sql`
    ALTER TABLE "ticket_templates"
      DROP COLUMN "ticket_settings",
      DROP COLUMN "label_config",
      DROP COLUMN "print_settings";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // 1. Recreate old jsonb columns
  await db.execute(sql`
    ALTER TABLE "ticket_templates"
      ADD COLUMN "ticket_settings" jsonb NOT NULL DEFAULT '{}',
      ADD COLUMN "label_config" jsonb,
      ADD COLUMN "print_settings" jsonb;
  `)

  // 2. Copy data back into jsonb columns
  await db.execute(sql`
    UPDATE "ticket_templates" SET
      "ticket_settings" = jsonb_build_object(
        'type', ticket_settings_type::text,
        'width', ticket_settings_width,
        'height', ticket_settings_height,
        'fitMode', ticket_settings_fit_mode::text
      ),
      "label_config" = jsonb_build_object(
        'labelColumn', label_config_label_column,
        'labelColors', COALESCE(label_config_label_colors, '{}'::jsonb),
        'labelBlockWidth', label_config_label_block_width,
        'rightBlockEnabled', label_config_right_block_enabled,
        'rightBlockWidth', label_config_right_block_width
      ),
      "print_settings" = jsonb_build_object(
        'ticketGap', print_settings_ticket_gap
      );
  `)

  // 3. Remove default from ticket_settings since original had no default
  await db.execute(sql`
    ALTER TABLE "ticket_templates"
      ALTER COLUMN "ticket_settings" DROP DEFAULT;
  `)

  // 4. Drop new typed columns
  await db.execute(sql`
    ALTER TABLE "ticket_templates"
      DROP COLUMN "ticket_settings_type",
      DROP COLUMN "ticket_settings_width",
      DROP COLUMN "ticket_settings_height",
      DROP COLUMN "ticket_settings_fit_mode",
      DROP COLUMN "label_config_label_column",
      DROP COLUMN "label_config_label_colors",
      DROP COLUMN "label_config_label_block_width",
      DROP COLUMN "label_config_right_block_enabled",
      DROP COLUMN "label_config_right_block_width",
      DROP COLUMN "print_settings_ticket_gap";
  `)

  // 5. Drop enum types
  await db.execute(sql`
    DROP TYPE "enum_ticket_templates_ticket_settings_type";
    DROP TYPE "enum_ticket_templates_ticket_settings_fit_mode";
  `)
}
