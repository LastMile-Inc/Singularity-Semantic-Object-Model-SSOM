# SSOM v1.0 Release Execution Guide

## Approved release scope

- Portable release: `SSOM Core v1.0.0`
- Separate proprietary release: `Last Mile Platform Operations and SSOM Master Profile v1.0.0`
- Boundary: the proprietary platform profile remains optional and explicitly outside portable SSOM Core semantics.

## Required local validation commands

Run these commands from the repository root before any synchronization step:

```powershell
git status --short
git status --branch
git diff --check
npm run validate
git log --oneline --decorate -20
git show-ref --tags
```

Expected state:

- `git status --short` produces no output.
- `git diff --check` produces no output.
- `npm run validate` exits successfully.

## Current local release state

- Branch: `feature/ssom-equipment-device-roles`
- Remote: `origin`
- Remote URL: `https://github.com/LastMile-Inc/Singularity-Semantic-Object-Model-SSOM`

## Intended synchronization flow

Validated local feature branch
-> Push feature branch to origin
-> Open pull request into `main`
-> GitHub CI passes
-> Human review of release audit and PR
-> Merge into `main`
-> Verify `main` commit and release artifacts
-> Create or push `v1.0.0` tag on approved `main` commit
-> Create GitHub release only after human approval

## Exact push sequence

```powershell
git push -u origin feature/ssom-equipment-device-roles
git fetch origin
git ls-remote --heads origin feature/ssom-equipment-device-roles
git log --oneline --decorate origin/main..origin/feature/ssom-equipment-device-roles
```

## Pull-request creation sequence

1. Open the repository on GitHub.
2. Select the compare view for `feature/ssom-equipment-device-roles` into `main`.
3. Use the prepared body in `docs/releases/SSOM_v1_0_GitHub_Pull_Request_Summary.md`.
4. Attach the final release audit from `docs/reviews/SSOM_v1_0_Release_Acceptance_Audit.md` in the PR description or review checklist.
5. Require human review before merge.

If GitHub CLI is available and authorized, the PR may be created with:

```powershell
gh pr create --base main --head feature/ssom-equipment-device-roles --title "release: SSOM Core v1.0.0" --body-file docs/releases/SSOM_v1_0_GitHub_Pull_Request_Summary.md
```

## Required PR checks

- GitHub Actions `validate` workflow passes.
- No unexpected file additions appear in the PR diff.
- The final release audit remains present.
- README and the v1.0 release index remain current.
- The proprietary Last Mile platform profile remains explicitly separated from portable SSOM Core.

## Merge requirements

- At least one final human review of the release audit.
- Reviewer confirmation that no prohibited standards, scale, or certification claims were introduced.
- Reviewer confirmation that no generated, temporary, secret-bearing, or machine-specific files are present.
- Reviewer confirmation that the PR diff matches the validated local commit history.

## Post-merge verification

After merge to `main`, run:

```powershell
git fetch origin
git checkout main
git pull --ff-only origin main
git log --oneline --decorate -20
git status --short
git diff --check
npm run validate
```

## Tag verification and release policy

The stable `v1.0.0` tag belongs on the approved merge commit in `main`, not merely on a transient feature-branch commit, unless a documented repository release policy explicitly states otherwise.

Recommended tag sequence after the approved merge commit exists in `main`:

```powershell
git tag -a v1.0.0 <approved-main-commit> -m "SSOM Core v1.0.0 and Last Mile Platform Operations and SSOM Master Profile v1.0.0"
git show v1.0.0 --stat
git push origin v1.0.0
```

## Rollback guidance

- Do not move the tag if it has already been pushed without explicit human approval.
- If the PR is found incorrect before merge, close it and prepare a corrective branch commit.
- If the merge commit is incorrect before tagging, revert or repair `main` first, then tag only the corrected approved merge commit.
- If a GitHub release draft is created prematurely, delete or unpublish it before external announcement.