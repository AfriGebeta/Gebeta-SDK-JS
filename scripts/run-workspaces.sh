#!/bin/bash
# Run a command in all workspaces that have the script

SCRIPT_NAME=$1
shift

if [ -z "$SCRIPT_NAME" ]; then
  echo "Usage: $0 <script-name> [args...]"
  exit 1
fi

echo "Running '$SCRIPT_NAME' across all workspaces..."
echo ""

TOTAL=0
SUCCESS=0
SKIPPED=0
FAILED=0

for workspace in packages/*/ packages/client/*/ packages/server/*/; do
  if [ ! -f "$workspace/package.json" ]; then
    continue
  fi

  WORKSPACE_NAME=$(node -p "require('./$workspace/package.json').name" 2>/dev/null)
  if [ -z "$WORKSPACE_NAME" ]; then
    continue
  fi

  TOTAL=$((TOTAL + 1))
  
  # Check if the script exists in package.json
  if ! yarn workspace "$WORKSPACE_NAME" run "$SCRIPT_NAME" --help > /dev/null 2>&1; then
    # Check if script exists by looking at package.json directly
    if ! node -e "const pkg = require('./$workspace/package.json'); if (!pkg.scripts || !pkg.scripts['$SCRIPT_NAME']) process.exit(1);" 2>/dev/null; then
      echo "Skipping $WORKSPACE_NAME (no '$SCRIPT_NAME' script)"
      SKIPPED=$((SKIPPED + 1))
      continue
    fi
  fi

  echo "Running '$SCRIPT_NAME' in $WORKSPACE_NAME..."
  
  if yarn workspace "$WORKSPACE_NAME" run "$SCRIPT_NAME" "$@"; then
    echo "$WORKSPACE_NAME: '$SCRIPT_NAME' completed successfully"
    SUCCESS=$((SUCCESS + 1))
  else
    echo "$WORKSPACE_NAME: '$SCRIPT_NAME' failed"
    FAILED=$((FAILED + 1))
  fi
  echo ""
done

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Summary:"
echo "   Total workspaces: $TOTAL"
echo "   Successful: $SUCCESS"
echo "   Skipped: $SKIPPED"
echo "   Failed: $FAILED"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $FAILED -gt 0 ]; then
  exit 1
fi
