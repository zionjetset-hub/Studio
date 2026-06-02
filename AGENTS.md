# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

**Studio** is intended to be a recording app (`README.md`). At present the repository is a **greenfield stub**: documentation, Unlicense, and a placeholder GitHub Actions workflow only. There is no application source, dependency manifests, or runnable services yet.

## Cursor Cloud specific instructions

### Services

| Service | Required? | Notes |
|---------|-----------|--------|
| Application / API / UI | No | Not present in the repo yet |
| Database / cache / queue | No | Not configured |
| Docker Compose stack | No | No `docker-compose` or Dockerfiles |

When application code lands, update this table with how to start each service for local development.

### Update script behavior

The VM update script is a no-op (`true`) because there are no lockfiles or package managers to refresh. After dependencies are added (e.g. `package.json`, `requirements.txt`), change the update script to the appropriate install command and document run/lint/test commands here.

### Lint, test, and build

Nothing is configured locally. The only automated check today is CI in `.github/workflows/blank.yml`, which runs:

```bash
echo Hello, world!
```

To mirror CI locally from the repo root:

```bash
echo Hello, world!
```

### Running the “application”

There is no dev server or binary to run until implementation is added. Treat a successful local run of the CI step above as the current smoke check for environment health.

### Gotchas

- Do not assume Node, Python, or Docker are required until manifests appear in the tree.
- Pre-commit hooks (Husky, etc.) are not configured.
