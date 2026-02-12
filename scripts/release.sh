#!/usr/bin/env bash
set -euo pipefail

# ─────────────────────────────────────────────────────────
# release.sh — Commit, version bump, tag, push, build & publish
#
# Usage:
#   ./scripts/release.sh "commit message"                 # patch bump (default)
#   ./scripts/release.sh "commit message" minor           # minor bump
#   ./scripts/release.sh "commit message" major           # major bump
#   ./scripts/release.sh "commit message" 1.2.3           # explicit version
# ─────────────────────────────────────────────────────────

COMMIT_MSG="${1:?Usage: ./scripts/release.sh \"commit message\" [patch|minor|major|x.y.z]}"
BUMP="${2:-patch}"

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
PKG_DIR="$ROOT_DIR/packages/a2ui-shadcn"

echo ""
echo "━━━ Release Pipeline ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# 1. Ensure working tree is usable
cd "$ROOT_DIR"
if [ -z "$(git status --porcelain)" ] && [ "$BUMP" = "patch" ]; then
  echo "⚠  No changes to commit. Skipping commit step."
  SKIP_COMMIT=true
else
  SKIP_COMMIT=false
fi

# 2. Commit all changes
if [ "$SKIP_COMMIT" = false ]; then
  echo "① Committing all changes..."
  git add -A
  git commit -m "$COMMIT_MSG"
  echo "   ✓ Committed"
fi

# 3. Bump version in package.json (no auto-commit/tag — we do it ourselves)
echo "② Bumping version ($BUMP)..."
cd "$PKG_DIR"
if [[ "$BUMP" =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
  npm version "$BUMP" --no-git-tag-version
else
  npm version "$BUMP" --no-git-tag-version
fi
NEW_VERSION=$(node -p "require('./package.json').version")
echo "   ✓ New version: $NEW_VERSION"

# 4. Commit the version bump + create git tag
cd "$ROOT_DIR"
git add -A
git commit -m "release: v$NEW_VERSION"
git tag -a "v$NEW_VERSION" -m "v$NEW_VERSION"
echo "   ✓ Tagged v$NEW_VERSION"

# 5. Push commits + tags
echo "③ Pushing to origin..."
git push origin main --follow-tags
echo "   ✓ Pushed"

# 6. Build the package
echo "④ Building package..."
cd "$PKG_DIR"
pnpm build
echo "   ✓ Built"

# 7. Publish to npm
echo "⑤ Publishing to npm..."
npm publish --access public
echo "   ✓ Published a2ui-shadcn@$NEW_VERSION"

# 8. Create GitHub release (if gh is available)
if command -v gh &> /dev/null; then
  echo "⑥ Creating GitHub release..."
  cd "$ROOT_DIR"
  gh release create "v$NEW_VERSION" --title "v$NEW_VERSION" --notes "$COMMIT_MSG" --latest
  echo "   ✓ GitHub release created"
else
  echo "⑥ Skipping GitHub release (gh CLI not installed)"
fi

echo ""
echo "━━━ Done! Released a2ui-shadcn@$NEW_VERSION ━━━━━━"
echo ""
