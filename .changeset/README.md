# Changesets

Every PR that changes behaviour adds a changeset: run `pnpm changeset`, pick the affected packages
and the bump (patch, minor or major) and describe the change in one line for the changelog.

At release time `pnpm version-packages` applies the pending changesets: it bumps versions and writes
each package's `CHANGELOG.md`. Packages are private; nothing is published to npm.
