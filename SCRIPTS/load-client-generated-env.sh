#!/usr/bin/env bash

load_client_generated_env() {
  local script_dir env_file
  script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  env_file="${1:-$script_dir/../.client.generated.env}"

  if [[ ! -f "$env_file" ]]; then
    echo "Missing generated client env file at $env_file. Run node SCRIPTS/bootstrap-client-config.js --write first." >&2
    return 1
  fi

  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a
}

require_client_env_var() {
  local var_name="${1:?Missing variable name}"
  if [[ -z "${!var_name:-}" ]]; then
    echo "Missing required generated client env key: $var_name" >&2
    return 1
  fi
}