param(
    [string]$BackupStamp = ''
)

$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'Load-ClientGeneratedEnv.ps1')

$repoRoot = Split-Path $PSScriptRoot -Parent
$clientEnv = Get-ClientGeneratedEnv
$sshKey = if ([System.IO.Path]::IsPathRooted($clientEnv.CLIENT_SSH_KEY_PATH)) {
    $clientEnv.CLIENT_SSH_KEY_PATH
} else {
    Join-Path $repoRoot $clientEnv.CLIENT_SSH_KEY_PATH
}
$remoteUser = $clientEnv.CLIENT_SSH_USER
$remoteHost = $clientEnv.CLIENT_SSH_HOST

$remotePublicRoot = $clientEnv.CLIENT_REMOTE_ASTRO_PUBLIC_ROOT
$remoteBackupRoot = $clientEnv.CLIENT_REMOTE_ASTRO_BACKUP_ROOT

if (-not (Test-Path $sshKey)) {
    throw "Missing SSH key at $sshKey."
}

$remoteCommand = @'
set -e
BACKUP_ROOT="{0}"
PUBLIC_ROOT="{1}"
REQUESTED_STAMP="{2}"

if [ ! -d "$BACKUP_ROOT" ]; then
    echo ASTRO_ROLLBACK_ERROR:NO_BACKUP_ROOT
    exit 1
fi

if [ -n "$REQUESTED_STAMP" ]; then
    TARGET="$BACKUP_ROOT/$REQUESTED_STAMP"
else
    TARGET=$(ls -1dt "$BACKUP_ROOT"/* 2>/dev/null | head -n 1)
fi

if [ -z "$TARGET" ] || [ ! -d "$TARGET" ]; then
    echo ASTRO_ROLLBACK_ERROR:NO_BACKUP_FOUND
    exit 1
fi

mkdir -p "$PUBLIC_ROOT"
rm -rf "$PUBLIC_ROOT"/*
cp -a "$TARGET/." "$PUBLIC_ROOT/"
find "$PUBLIC_ROOT" -type d -exec chmod 755 {{}} \;
find "$PUBLIC_ROOT" -type f -exec chmod 644 {{}} \;
echo ASTRO_ROLLBACK_OK:$(basename "$TARGET")
'@ -f $remoteBackupRoot, $remotePublicRoot, $BackupStamp

$remoteCommand = $remoteCommand -replace "`r`n", "`n"
$remoteCommand | ssh -o BatchMode=yes -o StrictHostKeyChecking=no -i $sshKey "$remoteUser@$remoteHost" "bash -s"