<?php

declare(strict_types=1);

$GLOBALS['seedGlobalLayoutFooterOptionStore'] = [];

function reset_seed_global_layout_footer_option_store(): void
{
    $GLOBALS['seedGlobalLayoutFooterOptionStore'] = [];
}

function get_option(string $name, $default = false)
{
    if (array_key_exists($name, $GLOBALS['seedGlobalLayoutFooterOptionStore'])) {
        return $GLOBALS['seedGlobalLayoutFooterOptionStore'][$name];
    }

    return $default;
}

function update_option(string $name, $value, $autoload = null): bool
{
    $GLOBALS['seedGlobalLayoutFooterOptionStore'][$name] = $value;

    return true;
}

function add_option(string $name, $value, string $deprecated = '', $autoload = null): bool
{
    if (array_key_exists($name, $GLOBALS['seedGlobalLayoutFooterOptionStore'])) {
        return false;
    }

    $GLOBALS['seedGlobalLayoutFooterOptionStore'][$name] = $value;

    return true;
}

function delete_option(string $name): bool
{
    unset($GLOBALS['seedGlobalLayoutFooterOptionStore'][$name]);

    return true;
}

define('BULWAR_SEED_GLOBAL_LAYOUT_FOOTER_SKIP_BOOTSTRAP', true);

require __DIR__ . '/seed-global-layout-footer.php';

function assert_true(bool $condition, string $message): void
{
    if ($condition !== true) {
        throw new RuntimeException($message);
    }
}

function assert_same($expected, $actual, string $message): void
{
    if ($expected !== $actual) {
        throw new RuntimeException(
            $message
            . "\nExpected: " . var_export($expected, true)
            . "\nActual: " . var_export($actual, true)
        );
    }
}

function run_test(string $name, callable $test): void
{
    $test();
    fwrite(STDOUT, "PASS {$name}\n");
}

run_test('missing-option snapshot survives rollback verification', static function (): void {
    reset_seed_global_layout_footer_option_store();

    $snapshot = captureGlobalLayoutOptionSnapshot('bulwar_bridge_global_layout');

    update_option('bulwar_bridge_global_layout', ['footerPageId' => 91], false);

    restoreGlobalLayoutOption('bulwar_bridge_global_layout', $snapshot);
    assertGlobalLayoutOptionMatchesSnapshot('bulwar_bridge_global_layout', $snapshot);

    $restoredSnapshot = captureGlobalLayoutOptionSnapshot('bulwar_bridge_global_layout');

    assert_same(false, $restoredSnapshot['exists'], 'Rollback should restore the missing-option state.');
});

run_test('stored false stays distinct from missing-option state', static function (): void {
    reset_seed_global_layout_footer_option_store();

    $missingSnapshot = captureGlobalLayoutOptionSnapshot('bulwar_bridge_global_layout');
    update_option('bulwar_bridge_global_layout', false, false);
    $storedFalseSnapshot = captureGlobalLayoutOptionSnapshot('bulwar_bridge_global_layout');

    assert_same(false, $missingSnapshot['exists'], 'Missing option should report exists=false.');
    assert_same(true, $storedFalseSnapshot['exists'], 'Stored false should still report exists=true.');
    assert_true(
        snapshotGlobalLayoutOptionMatches($storedFalseSnapshot, captureGlobalLayoutOptionSnapshot('bulwar_bridge_global_layout')),
        'Stored false should compare equal only to another stored-false snapshot.'
    );
});

run_test('json string restore compares exact pre-image value', static function (): void {
    reset_seed_global_layout_footer_option_store();

    update_option('bulwar_bridge_global_layout', '{"footerPageId":17}', false);
    $snapshot = captureGlobalLayoutOptionSnapshot('bulwar_bridge_global_layout');

    update_option('bulwar_bridge_global_layout', '{"footerPageId":99}', false);

    restoreGlobalLayoutOption('bulwar_bridge_global_layout', $snapshot);
    assertGlobalLayoutOptionMatchesSnapshot('bulwar_bridge_global_layout', $snapshot);

    $restoredSnapshot = captureGlobalLayoutOptionSnapshot('bulwar_bridge_global_layout');

    assert_same('{"footerPageId":17}', $restoredSnapshot['value'], 'Rollback should restore the exact pre-image string value.');
});