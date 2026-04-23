const { execSync } = require('child_process');
const { writeFileSync } = require('fs');
const { join } = require('path');

const workspaceRoot = process.cwd();
const sshBase = 'ssh -i "id_rsa" client@client.ssh.host';
const wpPath = 'client.example/public_html';
const wp = `php83 /usr/local/bin/wp-cli.phar --path='${wpPath}'`;

function runRemote(label, remoteCommand) {
  try {
    const command = `${sshBase} "${remoteCommand.replace(/"/g, '\\"')}"`;
    const output = execSync(command, {
      cwd: workspaceRoot,
      encoding: 'utf8',
      maxBuffer: 1024 * 1024 * 20,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    return { ok: true, label, output: output.trim() };
  } catch (error) {
    return {
      ok: false,
      label,
      output: (error.stdout || '').toString().trim(),
      error: (error.stderr || error.message || '').toString().trim(),
    };
  }
}

const commands = {
  site: `${wp} option get siteurl; echo '---'; ${wp} option get home`,
  plugins: `${wp} plugin list --fields=name,status,version,update --format=json`,
  muPlugins: `${wp} plugin list --status=must-use --fields=name,status,version,update --format=json`,
  themes: `${wp} theme list --fields=name,status,version,update --format=json`,
  postTypes: `${wp} post-type list --fields=name,label,public,show_ui,hierarchical --format=json`,
  wooOptions: [
    `${wp} option get woocommerce_currency`,
    `${wp} option get woocommerce_default_country`,
    `${wp} option get woocommerce_allowed_countries`,
    `${wp} option get woocommerce_ship_to_countries`,
    `${wp} option get woocommerce_calc_taxes`,
    `${wp} option get woocommerce_prices_include_tax`,
    `${wp} option get woocommerce_tax_based_on`,
    `${wp} option get woocommerce_shipping_cost_requires_address`,
    `${wp} option get woocommerce_enable_guest_checkout`,
    `${wp} option get woocommerce_enable_checkout_login_reminder`,
  ].join('; echo "---"; '),
  gatewayOptions: `${wp} option list --search='woocommerce_%_settings' --fields=option_name,option_value --format=json --skip-themes`,
  paymentGateways: `${wp} eval 'foreach (WC()->payment_gateways()->payment_gateways() as $id => $gateway) { echo json_encode(array("id" => $id, "enabled" => ($gateway->enabled ?? null), "title" => ($gateway->title ?? null), "class" => get_class($gateway)), JSON_UNESCAPED_UNICODE) . PHP_EOL; }'`,
  shippingZones: `${wp} db query "SELECT zone_id, zone_name, zone_order FROM wp_woocommerce_shipping_zones ORDER BY zone_order, zone_id;" --skip-column-names`,
  shippingLocations: `${wp} db query "SELECT zone_id, location_code, location_type FROM wp_woocommerce_shipping_zone_locations ORDER BY zone_id, location_type, location_code;" --skip-column-names`,
  shippingMethods: `${wp} db query "SELECT zone_id, instance_id, method_id, method_order, is_enabled FROM wp_woocommerce_shipping_zone_methods ORDER BY zone_id, method_order, instance_id;" --skip-column-names`,
  taxRates: `${wp} db query "SELECT tax_rate_id, tax_rate_country, tax_rate_state, tax_rate, tax_rate_name, tax_rate_priority, tax_rate_order, tax_rate_shipping, tax_rate_compound FROM wp_woocommerce_tax_rates ORDER BY tax_rate_country, tax_rate_state, tax_rate_priority, tax_rate_order;" --skip-column-names`,
  taxClasses: `${wp} eval 'foreach (WC_Tax::get_tax_classes() as $class) { echo $class . PHP_EOL; }'`,
  wooPages: [
    `${wp} option get woocommerce_shop_page_id`,
    `${wp} option get woocommerce_cart_page_id`,
    `${wp} option get woocommerce_checkout_page_id`,
    `${wp} option get woocommerce_myaccount_page_id`,
    `${wp} option get woocommerce_terms_page_id`,
  ].join('; echo "---"; '),
  customCode: [
    `cd '${wpPath}'`,
    `echo '[MU-PLUGINS]'`,
    `find wp-content/mu-plugins -maxdepth 2 -type f 2>/dev/null | sort`,
    `echo '[THEME FUNCTIONS]'`,
    `find wp-content/themes/twentytwentyfour -maxdepth 3 -type f | grep -E '\\.php$|\\.html$' | sort`,
    `echo '[CUSTOM HOOK SEARCH]'`,
    `grep -RInE 'register_post_type|add_action|add_filter|woocommerce_' wp-content/mu-plugins wp-content/themes/twentytwentyfour 2>/dev/null | head -n 200`,
  ].join('; '),
};

const results = {};
for (const [key, command] of Object.entries(commands)) {
  results[key] = runRemote(key, command);
}

const outPath = join(workspaceRoot, 'docs', 'plan', 'bulwar-bridge-checkout', 'live_site_audit_raw.json');
writeFileSync(outPath, JSON.stringify({ wpPath, generatedAt: new Date().toISOString(), results }, null, 2));

console.log(`Wrote ${outPath}`);
