import * as migration_20260922_145355 from './20260922_145355';
import * as migration_20260922_165749 from './20260922_165749';

export const migrations = [
  {
    up: migration_20260922_145355.up,
    down: migration_20260922_145355.down,
    name: '20260922_145355',
  },
  {
    up: migration_20260922_165749.up,
    down: migration_20260922_165749.down,
    name: '20260922_165749'
  },
];
