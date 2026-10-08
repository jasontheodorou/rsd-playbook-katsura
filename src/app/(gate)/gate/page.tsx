/** The password screen. A plain form, so it works without JavaScript. */
export default async function GatePage({ searchParams }: { searchParams: Promise<{ next?: string; wrong?: string }> }) {
  const { next = '/', wrong } = await searchParams
  return (
    <main className="gate">
      <h1 className="gate__title">
        The RSD Playbook<span className="gate__dot">.</span>
      </h1>
      <form className="gate__form" method="post" action="/gate/check">
        <input type="hidden" name="next" value={next} />
        <label className="gate__label" htmlFor="password">
          Password
        </label>
        {wrong ? (
          <p className="gate__error" id="password-error">
            That password is not right. Try again.
          </p>
        ) : null}
        <input
          className="gate__input"
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          autoFocus
          required
          aria-describedby={wrong ? 'password-error' : undefined}
        />
        <button className="gate__button" type="submit">
          Continue
        </button>
      </form>
    </main>
  )
}
