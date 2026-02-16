import * as migration_20260216_004719_add_print_settings from './20260216_004719_add_print_settings';
import * as migration_20260216_093500_restructure_ticket_templates from './20260216_093500_restructure_ticket_templates';

export const migrations = [
  {
    up: migration_20260216_004719_add_print_settings.up,
    down: migration_20260216_004719_add_print_settings.down,
    name: '20260216_004719_add_print_settings'
  },
  {
    up: migration_20260216_093500_restructure_ticket_templates.up,
    down: migration_20260216_093500_restructure_ticket_templates.down,
    name: '20260216_093500_restructure_ticket_templates'
  },
];
