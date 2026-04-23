#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "$SCRIPT_DIR/load-client-generated-env.sh"
if [[ -f "$SCRIPT_DIR/../.client.generated.env" ]]; then
  load_client_generated_env "$SCRIPT_DIR/../.client.generated.env"
fi

require_client_env_var CLIENT_REMOTE_WP_ROOT
require_client_env_var CLIENT_WORDPRESS_BASE_URL

WP_PATH="$CLIENT_REMOTE_WP_ROOT"
WP="/usr/bin/php82 /usr/local/bin/wp-cli.phar --path=${WP_PATH}"
SCHEMA_FILE="$HOME/testowa-blueprint.page_builder_schema.json"
AI_SCHEMA_FILE="$HOME/testowa-blueprint.page_builder_schema_for_ai.json"

PAGE_ID="$(${WP} post list --post_type=page --name=testowa-blueprint --field=ID --posts_per_page=1)"

if [ -z "${PAGE_ID}" ]; then
  PAGE_ID="$(${WP} post create --post_type=page --post_status=publish --post_title="Testowa Blueprint" --post_name=testowa-blueprint --porcelain)"
else
  ${WP} post update "${PAGE_ID}" --post_status=publish --post_title="Testowa Blueprint" >/dev/null
fi

${WP} eval 'update_post_meta((int) $args[0], "page_builder_schema", file_get_contents(getenv("HOME") . "/testowa-blueprint.page_builder_schema.json"));' -- "${PAGE_ID}"

if [ -f "${AI_SCHEMA_FILE}" ]; then
  ${WP} eval 'update_post_meta((int) $args[0], "page_builder_schema_for_ai", file_get_contents(getenv("HOME") . "/testowa-blueprint.page_builder_schema_for_ai.json"));' -- "${PAGE_ID}"
  echo "AI_SCHEMA:updated"
else
  echo "AI_SCHEMA:skipped"
fi

echo "PAGE_ID:${PAGE_ID}"
curl -s "${CLIENT_WORDPRESS_BASE_URL%/}/wp-json/bulwar/v1/page-builder/pages/testowa-blueprint"