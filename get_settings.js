const { execFileSync } = require('child_process');
const fs = require('fs');

const { getClientRemoteConfig } = require('./SCRIPTS/clientGeneratedEnv');

try {
    const remoteConfig = getClientRemoteConfig();

    console.log(`Łączenie z serwerem i pobieranie ustawień z '${remoteConfig.remoteWordPressRoot}'...`);

    const output = execFileSync(
        'ssh',
        [
            '-i',
            remoteConfig.sshKeyPath,
            remoteConfig.sshTarget,
            `php83 /usr/local/bin/wp-cli.phar option list --search='woocommerce_*' --fields=option_name,option_value --path='${remoteConfig.remoteWordPressRoot}' --skip-themes --skip-plugins | grep -E 'woocommerce_(store_address|store_city|store_postcode|currency|default_country)'`,
        ],
        { encoding: 'utf8', maxBuffer: 1024 * 1024 * 10, stdio: ['pipe', 'pipe', 'ignore'] },
    );

    fs.writeFileSync('wc-settings.txt', output);
    console.log('Pomyślnie zapisano do wc-settings.txt');
    console.log('Znalezione ustawienia:\n' + output);
} catch (e) {
    console.error('Wystąpił błąd podczas pobierania:', e.message);
    if (e.stdout) console.log('STDOUT:', e.stdout.toString());
}
