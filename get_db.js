const { execFileSync } = require('child_process');
const fs = require('fs');

const { getClientRemoteConfig } = require('./SCRIPTS/clientGeneratedEnv');

try {
    const remoteConfig = getClientRemoteConfig();
    const sshArgs = ['-i', remoteConfig.sshKeyPath];

    console.log('Downloading wp-config.php using scp...');
    execFileSync(
        'scp',
        [
            ...sshArgs,
            `${remoteConfig.sshTarget}:${remoteConfig.remoteWordPressRoot}/wp-config.php`,
            'temp_wp_config.php',
        ],
        { stdio: 'inherit' },
    );

    const config = fs.readFileSync('temp_wp_config.php', 'utf8');
    const dbName = config.match(/define\(\s*'DB_NAME',\s*'([^']+)'\s*\);/)[1];
    const dbUser = config.match(/define\(\s*'DB_USER',\s*'([^']+)'\s*\);/)[1];
    const dbPass = config.match(/define\(\s*'DB_PASSWORD',\s*'([^']+)'\s*\);/)[1];
    const dbHost = config.match(/define\(\s*'DB_HOST',\s*'([^']+)'\s*\);/)[1] || 'localhost';
    const prefixMatch = config.match(/\$table_prefix\s*=\s*'([^']+)';/);
    const prefix = prefixMatch ? prefixMatch[1] : 'wp_';

    console.log(`Extracted DB info: User ${dbUser}, DB: ${dbName}, Prefix: ${prefix}, Host: ${dbHost}`);

    const query = `SELECT option_name, option_value FROM ${prefix}options WHERE option_name LIKE 'woocommerce_store_%' OR option_name IN ('woocommerce_currency', 'woocommerce_default_country', 'woocommerce_allowed_countries');`;
    console.log('Running SQL query remotely...');

    const result = execFileSync(
        'ssh',
        [
            ...sshArgs,
            remoteConfig.sshTarget,
            `mysql -u '${dbUser}' -p'${dbPass}' -h '${dbHost}' '${dbName}' -e \"${query}\"`,
        ],
        { encoding: 'utf8', maxBuffer: 1024 * 1024 * 5, stdio: ['pipe', 'pipe', 'ignore'] },
    );
    fs.writeFileSync('wc-settings.txt', result);

    console.log('\n--- RESULT ---');
    console.log(result);
} catch (e) {
    console.error('ERROR:');
    console.error(e.message);
    if (e.stdout) console.log(e.stdout.toString());
}
