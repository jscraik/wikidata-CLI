import fs from "fs";
import path from "path";
import os from "os";

export type CredentialsFile = {
  version: 1;
  kdf: "scrypt";
  salt: string;
  iv: string;
  tag: string;
  ciphertext: string;
};

export type ConfigFile = {
  profile?: string;
  userAgent?: string;
  apiUrl?: string;
  actionUrl?: string;
  sparqlUrl?: string;
  timeout?: number;
  retries?: number;
  retryBackoff?: number;
};

export function getConfigDir(): string {
  const xdg = process.env.XDG_CONFIG_HOME;
  if (xdg && xdg.trim().length > 0) {
    return path.join(xdg, "wiki-cli");
  }
  return path.join(os.homedir(), ".config", "wiki-cli");
}

export function getConfigPath(): string {
  return path.join(getConfigDir(), "config.json");
}

export function getCredentialsPath(): string {
  return path.join(getConfigDir(), "credentials.json");
}

export function ensureConfigDir(): void {
  const dir = getConfigDir();
  fs.mkdirSync(dir, { recursive: true, mode: 0o700 });
}

export function loadConfig(): ConfigFile {
  const file = getConfigPath();
  if (!fs.existsSync(file)) return {};
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw) as ConfigFile;
}

export function saveConfig(config: ConfigFile): void {
  ensureConfigDir();
  const file = getConfigPath();
  fs.writeFileSync(file, JSON.stringify(config, null, 2), { encoding: "utf8", mode: 0o600 });
}

export function loadCredentials(): CredentialsFile | null {
  const file = getCredentialsPath();
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  return JSON.parse(raw) as CredentialsFile;
}

export function saveCredentials(payload: CredentialsFile): void {
  ensureConfigDir();
  const file = getCredentialsPath();
  fs.writeFileSync(file, JSON.stringify(payload, null, 2), { encoding: "utf8", mode: 0o600 });
}

export function removeCredentials(): void {
  const file = getCredentialsPath();
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
}
