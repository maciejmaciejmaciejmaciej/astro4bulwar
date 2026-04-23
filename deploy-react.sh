#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ENV_FILE:-$SCRIPT_DIR/.client.generated.env}"

if [ -f "$ENV_FILE" ]; then
  set -a
  # shellcheck disable=SC1090
  source "$ENV_FILE"
  set +a
fi

: "${CLIENT_REMOTE_REACT_PUBLIC_ROOT:?Missing CLIENT_REMOTE_REACT_PUBLIC_ROOT. Run node SCRIPTS/bootstrap-client-config.js --write first or export the variable manually.}"

BASE="$CLIENT_REMOTE_REACT_PUBLIC_ROOT"
STAMP=$(date +%Y%m%d-%H%M%S)

if [ -d "$BASE" ]; then
  mv "$BASE" "${BASE}_backup_$STAMP"
fi

mkdir -p "$BASE"
unzip -oq ~/react-deploy.zip -d "$BASE"
rm -f ~/react-deploy.zip
find "$BASE" -type d -exec chmod 755 {} \;
find "$BASE" -type f -exec chmod 644 {} \;
echo "DEPLOY_OK:$STAMP"
