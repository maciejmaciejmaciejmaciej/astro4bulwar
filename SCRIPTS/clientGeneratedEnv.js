const fs = require('node:fs');
const path = require('node:path');

const { parseEnvFileContents } = require('./bootstrap-client-config.js');

const workspaceRoot = path.resolve(__dirname, '..');
const defaultEnvFilePath = path.join(workspaceRoot, '.client.generated.env');

function loadClientGeneratedEnv(envFilePath = defaultEnvFilePath) {
  if (!fs.existsSync(envFilePath)) {
    throw new Error(`Missing generated client env file at ${envFilePath}. Run node SCRIPTS/bootstrap-client-config.js --write first.`);
  }

  return parseEnvFileContents(fs.readFileSync(envFilePath, 'utf8'));
}

function requireKey(values, key) {
  const value = values[key];

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`Missing required generated client env key: ${key}`);
  }

  return value.trim();
}

function resolveAbsolutePath(candidatePath) {
  return path.isAbsolute(candidatePath)
    ? candidatePath
    : path.resolve(workspaceRoot, candidatePath);
}

function getClientRemoteConfig(envFilePath = defaultEnvFilePath) {
  const values = loadClientGeneratedEnv(envFilePath);
  const sshUser = requireKey(values, 'CLIENT_SSH_USER');
  const sshHost = requireKey(values, 'CLIENT_SSH_HOST');
  const sshKeyPath = resolveAbsolutePath(requireKey(values, 'CLIENT_SSH_KEY_PATH'));

  return {
    values,
    workspaceRoot,
    sshUser,
    sshHost,
    sshTarget: `${sshUser}@${sshHost}`,
    sshKeyPath,
    remoteWordPressRoot: requireKey(values, 'CLIENT_REMOTE_WP_ROOT'),
  };
}

module.exports = {
  defaultEnvFilePath,
  getClientRemoteConfig,
  loadClientGeneratedEnv,
  workspaceRoot,
};