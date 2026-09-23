# CI workflows, pending

These two GitHub Actions workflows belong in `.github/workflows/`. They are parked here until the
GitHub login used to push has the `workflow` permission (`gh auth refresh -h github.com -s workflow`).
Move them back with:

    git mv .github-pending/workflows .github/workflows

- `ci.yml`: lint, typecheck, database-free build, then boots the company-shaped compose environment.
- `scheduled-jobs.yml`: calls the app's jobs endpoint every 5 minutes (replaces host cron).
