function Get-ClientGeneratedEnv {
    param(
        [string]$EnvFilePath = (Join-Path (Split-Path $PSScriptRoot -Parent) '.client.generated.env')
    )

    if (-not (Test-Path $EnvFilePath)) {
        throw "Missing generated client env file at $EnvFilePath. Run node SCRIPTS/bootstrap-client-config.js --write first."
    }

    $values = @{}

    foreach ($rawLine in Get-Content -Path $EnvFilePath) {
        $line = $rawLine.Trim()

        if ([string]::IsNullOrWhiteSpace($line) -or $line.StartsWith('#')) {
            continue
        }

        $separatorIndex = $line.IndexOf('=')

        if ($separatorIndex -le 0) {
            throw ('Invalid env line in {0} -> {1}' -f $EnvFilePath, $rawLine)
        }

        $key = $line.Substring(0, $separatorIndex).Trim()
        $rawValue = $line.Substring($separatorIndex + 1).Trim()

        if ($rawValue.StartsWith('"') -and $rawValue.EndsWith('"')) {
            $rawValue = $rawValue.Substring(1, $rawValue.Length - 2)
            $rawValue = $rawValue.Replace('\\n', "`n").Replace('\\r', "`r").Replace('\\t', "`t").Replace('\\"', '"').Replace('\\\\', '\\')
        }

        $values[$key] = $rawValue
    }

    return $values
}