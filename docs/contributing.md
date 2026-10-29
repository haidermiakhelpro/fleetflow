# Contributing

## Branches

- main: integration branch.
- feature/*: new functionality.
- fix/*: bug fixes.
- docs/*: documentation.
- chore/*: maintenance and tooling.
- practice/*: isolated learning exercises.

## Change process

1. Update main.
2. Create a short-lived branch.
3. Make a focused change.
4. Run relevant checks.
5. Push the branch.
6. Open a pull request.
7. Address review feedback.
8. Merge when required checks and reviews are satisfied.

## History

- Use squash merging for normal pull requests.
- Do not force-push main.
- Coordinate before rewriting a published feature branch.
- Use revert when undoing shared changes where appropriate.

## Secrets

- Never commit .env, private keys, or database backups.
- Keep safe configuration examples in .env.example.

## Practice branches

Practice exercises must not be merged into main unless
they contain documentation intentionally approved for inclusion.