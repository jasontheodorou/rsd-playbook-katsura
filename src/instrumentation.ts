export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return
  if (process.env.JOBS_TRIGGER !== 'inprocess') return
  const { getPayload } = await import('payload')
  const { default: config } = await import('@payload-config')
  // Initialising Payload starts its autoRun timers.
  await getPayload({ config })
}
