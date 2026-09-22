// Starts a throwaway Postgres 17 on port 5433 using downloaded binaries. No Docker, no admin rights.
// Data lives in .local/pg (gitignored). Ctrl-C stops it.
import EmbeddedPostgres from 'embedded-postgres'
import { existsSync } from 'node:fs'
import path from 'node:path'

const dataDir = path.resolve('.local/pg')
const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'katsura',
  password: 'katsura',
  port: 5433,
  persistent: true,
})

if (!existsSync(path.join(dataDir, 'PG_VERSION'))) {
  await pg.initialise()
}
await pg.start()
try {
  await pg.createDatabase('katsura')
} catch {
  // already exists
}
console.log('Postgres ready: postgres://katsura:katsura@127.0.0.1:5433/katsura')
console.log('Press Ctrl-C to stop.')

const stop = async () => {
  await pg.stop()
  process.exit(0)
}
process.on('SIGINT', stop)
process.on('SIGTERM', stop)
