set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${ENV_FILE:-$SCRIPT_DIR/.client.generated.env}"

if [ -f "$ENV_FILE" ]; then
    set -a
    # shellcheck disable=SC1090
    source "$ENV_FILE"
    set +a
fi

: "${CLIENT_REMOTE_WP_ROOT:?Missing CLIENT_REMOTE_WP_ROOT. Run node SCRIPTS/bootstrap-client-config.js --write first or export the variable manually.}"
: "${CLIENT_BRIDGE_GOOGLE_MAPS_API_KEY:?Missing CLIENT_BRIDGE_GOOGLE_MAPS_API_KEY.}"
: "${CLIENT_BRIDGE_STORE_ORIGIN_LINE1:?Missing CLIENT_BRIDGE_STORE_ORIGIN_LINE1.}"
: "${CLIENT_BRIDGE_STORE_ORIGIN_CITY:?Missing CLIENT_BRIDGE_STORE_ORIGIN_CITY.}"
: "${CLIENT_BRIDGE_STORE_ORIGIN_POSTAL_CODE:?Missing CLIENT_BRIDGE_STORE_ORIGIN_POSTAL_CODE.}"
: "${CLIENT_BRIDGE_STORE_ORIGIN_COUNTRY:?Missing CLIENT_BRIDGE_STORE_ORIGIN_COUNTRY.}"
: "${CLIENT_BRIDGE_DELIVERY_BASE_FEE:?Missing CLIENT_BRIDGE_DELIVERY_BASE_FEE.}"
: "${CLIENT_BRIDGE_DELIVERY_PRICE_PER_KM:?Missing CLIENT_BRIDGE_DELIVERY_PRICE_PER_KM.}"
: "${CLIENT_BRIDGE_FREE_DELIVERY_THRESHOLD:?Missing CLIENT_BRIDGE_FREE_DELIVERY_THRESHOLD.}"
: "${CLIENT_BRIDGE_TIMEZONE:?Missing CLIENT_BRIDGE_TIMEZONE.}"
: "${CLIENT_BRIDGE_SPECIAL_PRODUCT_ID:?Missing CLIENT_BRIDGE_SPECIAL_PRODUCT_ID.}"

TARGET="${CLIENT_REMOTE_WP_ROOT}/wp-config.php"
STAMP=$(date +%Y%m%d-%H%M%S)
BACKUP="${TARGET}.bridge-backup-${STAMP}"
cp "$TARGET" "$BACKUP"
python3 - <<'PY'
import os
from pathlib import Path
path = Path(os.environ['TARGET'])
text = path.read_text(encoding='utf-8', errors='ignore')
marker = "/* To wszystko, zakończ edycję w tym miejscu! Miłego blogowania! */"
block = f"""if (!defined('BULWAR_BRIDGE_GOOGLE_MAPS_API_KEY')) define('BULWAR_BRIDGE_GOOGLE_MAPS_API_KEY', {os.environ['CLIENT_BRIDGE_GOOGLE_MAPS_API_KEY']!r});
if (!defined('BULWAR_BRIDGE_STORE_ORIGIN_LINE1')) define('BULWAR_BRIDGE_STORE_ORIGIN_LINE1', {os.environ['CLIENT_BRIDGE_STORE_ORIGIN_LINE1']!r});
if (!defined('BULWAR_BRIDGE_STORE_ORIGIN_CITY')) define('BULWAR_BRIDGE_STORE_ORIGIN_CITY', {os.environ['CLIENT_BRIDGE_STORE_ORIGIN_CITY']!r});
if (!defined('BULWAR_BRIDGE_STORE_ORIGIN_POSTAL_CODE')) define('BULWAR_BRIDGE_STORE_ORIGIN_POSTAL_CODE', {os.environ['CLIENT_BRIDGE_STORE_ORIGIN_POSTAL_CODE']!r});
if (!defined('BULWAR_BRIDGE_STORE_ORIGIN_COUNTRY')) define('BULWAR_BRIDGE_STORE_ORIGIN_COUNTRY', {os.environ['CLIENT_BRIDGE_STORE_ORIGIN_COUNTRY']!r});
if (!defined('BULWAR_BRIDGE_DELIVERY_BASE_FEE')) define('BULWAR_BRIDGE_DELIVERY_BASE_FEE', {os.environ['CLIENT_BRIDGE_DELIVERY_BASE_FEE']!r});
if (!defined('BULWAR_BRIDGE_DELIVERY_PRICE_PER_KM')) define('BULWAR_BRIDGE_DELIVERY_PRICE_PER_KM', {os.environ['CLIENT_BRIDGE_DELIVERY_PRICE_PER_KM']!r});
if (!defined('BULWAR_BRIDGE_FREE_DELIVERY_THRESHOLD')) define('BULWAR_BRIDGE_FREE_DELIVERY_THRESHOLD', {os.environ['CLIENT_BRIDGE_FREE_DELIVERY_THRESHOLD']!r});
if (!defined('BULWAR_BRIDGE_TIMEZONE')) define('BULWAR_BRIDGE_TIMEZONE', {os.environ['CLIENT_BRIDGE_TIMEZONE']!r});
if (!defined('BULWAR_BRIDGE_SPECIAL_PRODUCT_ID')) define('BULWAR_BRIDGE_SPECIAL_PRODUCT_ID', {os.environ['CLIENT_BRIDGE_SPECIAL_PRODUCT_ID']!r});
if (!defined('BULWAR_BRIDGE_MAKE_WEBHOOK_URL')) define('BULWAR_BRIDGE_MAKE_WEBHOOK_URL', {os.environ.get('CLIENT_BRIDGE_MAKE_WEBHOOK_URL', '')!r});

"""
if 'BULWAR_BRIDGE_GOOGLE_MAPS_API_KEY' not in text:
    if marker not in text:
        raise SystemExit('marker not found in wp-config.php')
    text = text.replace(marker, block + marker, 1)
    path.write_text(text, encoding='utf-8')
PY
php83 -l "$TARGET"
