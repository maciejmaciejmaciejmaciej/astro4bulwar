$ErrorActionPreference = 'Stop'

. (Join-Path $PSScriptRoot 'Load-ClientGeneratedEnv.ps1')

$repoRoot = Split-Path $PSScriptRoot -Parent
$clientEnv = Get-ClientGeneratedEnv
$astroRoot = Join-Path $repoRoot 'astro-site'
$distRoot = Join-Path $astroRoot 'dist'
$sshKey = if ([System.IO.Path]::IsPathRooted($clientEnv.CLIENT_SSH_KEY_PATH)) {
    $clientEnv.CLIENT_SSH_KEY_PATH
} else {
    Join-Path $repoRoot $clientEnv.CLIENT_SSH_KEY_PATH
}
$remoteUser = $clientEnv.CLIENT_SSH_USER
$remoteHost = $clientEnv.CLIENT_SSH_HOST

$remoteSourceRoot = $clientEnv.CLIENT_REMOTE_ASTRO_SOURCE_ROOT
$remotePublicRoot = $clientEnv.CLIENT_REMOTE_ASTRO_PUBLIC_ROOT
$remoteBackupRoot = $clientEnv.CLIENT_REMOTE_ASTRO_BACKUP_ROOT

if (-not (Test-Path $distRoot)) {
    throw "Missing Astro dist directory at $distRoot. Run astro build first."
}

if (-not (Test-Path $sshKey)) {
    throw "Missing SSH key at $sshKey."
}

$stageRoot = Join-Path $repoRoot 'astro-deploy-stage'
$archivePath = Join-Path $repoRoot 'astro-dist-deploy.zip'

if (Test-Path $stageRoot) {
    Remove-Item $stageRoot -Recurse -Force
}

New-Item -ItemType Directory -Path $stageRoot | Out-Null
Copy-Item (Join-Path $distRoot '*') $stageRoot -Recurse -Force

if (Test-Path $archivePath) {
    Remove-Item $archivePath -Force
}

Compress-Archive -Path (Join-Path $stageRoot '*') -DestinationPath $archivePath -Force

scp -o BatchMode=yes -o StrictHostKeyChecking=no -i $sshKey $archivePath "$remoteUser@${remoteHost}:~/astro-dist-deploy.zip"

$remoteCommand = @'
set -e
mkdir -p '{0}'
mkdir -p '{1}'
mkdir -p '{2}'
STAMP=$(date +%Y%m%d-%H%M%S)
if [ -d '{1}' ] && [ "$(find '{1}' -mindepth 1 -maxdepth 1 | wc -l)" -gt 0 ]; then
    mkdir -p '{2}/$STAMP'
    cp -a '{1}/.' '{2}/$STAMP/'
fi
rm -rf '{1}'/*
unzip -oq ~/astro-dist-deploy.zip -d '{1}'
rm -f ~/astro-dist-deploy.zip
find '{1}' -type d -exec chmod 755 {{}} \;
find '{1}' -type f -exec chmod 644 {{}} \;
echo ASTRO_DEPLOY_OK:$STAMP
'@ -f $remoteSourceRoot, $remotePublicRoot, $remoteBackupRoot

$remoteCommand = $remoteCommand -replace "`r`n", "`n"
$remoteCommand | ssh -o BatchMode=yes -o StrictHostKeyChecking=no -i $sshKey "$remoteUser@$remoteHost" "bash -s"
