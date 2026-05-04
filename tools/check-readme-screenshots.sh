#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
README="$ROOT_DIR/README.md"

if [[ ! -f "$README" ]]; then
  echo "ERROR: README.md not found at $README" >&2
  exit 2
fi

paths_file="$(mktemp)"
trap 'rm -f "$paths_file"' EXIT

sed -n 's/.*!\[[^]]*\](\([^)]*\)).*/\1/p' "$README" \
  | sed 's/[[:space:]]*$//' \
  | grep -vE '^(https?:)?//' > "$paths_file" || true

if [[ ! -s "$paths_file" ]]; then
  echo "No local markdown image references found in README.md"
  exit 0
fi

missing=0
checked=0

while IFS= read -r rel; do
  [[ -z "$rel" ]] && continue
  checked=$((checked + 1))
  target="$ROOT_DIR/$rel"
  if [[ -f "$target" ]]; then
    echo "OK   $rel"
  else
    echo "MISS $rel"
    missing=$((missing + 1))
  fi
done < "$paths_file"

echo "Checked $checked local image link(s)."

if [[ $missing -gt 0 ]]; then
  echo "FAILED: $missing missing image file(s)." >&2
  exit 1
fi

echo "PASS: all README local image links resolve."
