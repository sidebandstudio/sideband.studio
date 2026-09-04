#!/usr/bin/env bash
# Publish a screenshot to the pr-assets branch and print markdown that renders
# inline in a PR body or comment (same-origin /raw/ URL pinned to a commit).
#
# Usage: scripts/pr-screenshot.sh <image> <pr-number> [name]
#
# The image lands at pr/<pr-number>/<name> on the pr-assets branch, the same
# layout the pr-screenshots workflow uses. The printed URL pins the commit
# SHA, so later pushes never break it.
set -euo pipefail

img=$1
pr=$2
name=${3:-$(basename "$img")}

slug=$(git remote get-url origin | sed -E 's#^(git@github\.com:|https://github\.com/)##; s#\.git$##')

git fetch origin pr-assets:refs/remotes/origin/pr-assets 2>/dev/null || true

GIT_INDEX_FILE=$(mktemp)
export GIT_INDEX_FILE
rm -f "$GIT_INDEX_FILE"

parent=""
if git rev-parse -q --verify refs/remotes/origin/pr-assets >/dev/null; then
  parent=$(git rev-parse refs/remotes/origin/pr-assets)
  git read-tree "$parent"
else
  git read-tree --empty
fi

git update-index --add --cacheinfo "100644,$(git hash-object -w -- "$img"),pr/${pr}/${name}"
tree=$(git write-tree)
commit=$(git commit-tree "$tree" ${parent:+-p "$parent"} -m "ci: screenshot ${name} for PR #${pr}")
git push origin "$commit:refs/heads/pr-assets" >&2
rm -f "$GIT_INDEX_FILE"

echo "![${name%.*}](https://github.com/${slug}/raw/${commit}/pr/${pr}/${name})"
