#!/usr/bin/env node

/**
 * FTP deploy script for Hostinger.
 *
 * Uploads the `out/` directory to public_html on the remote server.
 *
 * Protected paths (assets/images, assets/photos, article, articles, note) will
 * prompt before overwriting unless FTP_AUTO_OVERRIDE=true is set in the env.
 *
 * Required env vars (set in .env):
 *   FTP_HOST, FTP_USER, FTP_PASSWORD
 *
 * Optional:
 *   FTP_PORT          (default: 21)
 *   FTP_SECURE        (default: false)
 *   FTP_REMOTE_PATH   (default: /public_html)
 *   FTP_AUTO_OVERRIDE (default: false)
 */

const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

// Load .env manually (no dotenv dependency needed)
const envPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8')
    .split('\n')
    .forEach(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return;
      const idx = trimmed.indexOf('=');
      if (idx === -1) return;
      const key = trimmed.slice(0, idx).trim();
      const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
      if (!(key in process.env)) process.env[key] = val;
    });
}

const {
  FTP_HOST,
  FTP_USER,
  FTP_PASSWORD,
  FTP_PORT = '21',
  FTP_SECURE = 'false',
  FTP_REMOTE_PATH = '/public_html',
  FTP_AUTO_OVERRIDE = 'false',
  FTP_SKIP_CONFIRM = 'false',
} = process.env;

if (!FTP_HOST || !FTP_USER || !FTP_PASSWORD) {
  console.error('Error: FTP_HOST, FTP_USER, and FTP_PASSWORD must be set in .env');
  process.exit(1);
}

const LOCAL_DIR = path.join(__dirname, '..', 'out');
const AUTO_OVERRIDE = FTP_AUTO_OVERRIDE === 'true';
const SKIP_CONFIRM = FTP_SKIP_CONFIRM === 'true';

// Paths relative to the remote root that need a confirmation prompt.
// These are matched as prefixes of the remote path being uploaded.
const PROTECTED_PREFIXES = [
  'assets/images',
  'assets/photos',
  'article',
  'articles',
  'note',
];

function isProtected(remotePath) {
  // remotePath is relative to FTP_REMOTE_PATH, e.g. "assets/images/foo.png"
  const normalized = remotePath.replace(/\\/g, '/').replace(/^\/+/, '');
  return PROTECTED_PREFIXES.some(prefix => normalized === prefix || normalized.startsWith(prefix + '/'));
}

async function remoteExists(client, remotePath) {
  try {
    await client.list(remotePath);
    return true;
  } catch {
    return false;
  }
}

async function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function uploadDir(client, localDir, remoteDir, overrideDecisions) {
  const entries = fs.readdirSync(localDir, { withFileTypes: true });

  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = remoteDir ? `${remoteDir}/${entry.name}` : entry.name;
    const remoteFullPath = `${FTP_REMOTE_PATH}/${remotePath}`.replace(/\/+/g, '/');

    if (entry.isDirectory()) {
      if (!AUTO_OVERRIDE && isProtected(remotePath)) {
        const key = PROTECTED_PREFIXES.find(p => remotePath === p || remotePath.startsWith(p + '/'));
        if (overrideDecisions[key] === undefined) {
          const exists = await remoteExists(client, remoteFullPath);
          if (exists) {
            const answer = await confirm(
              `\n⚠️  Protected directory exists on remote: ${remoteFullPath}\n   Overwrite its contents? [y/N] `
            );
            overrideDecisions[key] = answer === 'y' || answer === 'yes';
          } else {
            overrideDecisions[key] = true; // doesn't exist remotely, safe to upload
          }
        }
        if (!overrideDecisions[key]) {
          console.log(`   Skipping ${remoteFullPath}`);
          continue;
        }
      }

      await client.ensureDir(remoteFullPath);
      await uploadDir(client, localPath, remotePath, overrideDecisions);
    } else {
      process.stdout.write(`  ↑ ${remoteFullPath}\r`);
      await client.uploadFrom(localPath, remoteFullPath);
    }
  }
}

async function deploy() {
  if (!fs.existsSync(LOCAL_DIR)) {
    console.error(`Error: Build output not found at ${LOCAL_DIR}. Run "npm run build:export" first.`);
    process.exit(1);
  }

  console.log('');
  console.log('FTP Deploy');
  console.log('──────────────────────────────────');
  console.log(`  Host:        ${FTP_HOST}`);
  console.log(`  Remote path: ${FTP_REMOTE_PATH}`);
  console.log(`  Local dir:   ${LOCAL_DIR}`);
  console.log(`  Secure:      ${FTP_SECURE === 'true' ? 'yes (FTPS)' : 'no'}`);
  console.log('──────────────────────────────────');

  if (!AUTO_OVERRIDE) {
    console.log('');
    console.log('Protected paths (will prompt before overwriting):');
    PROTECTED_PREFIXES.forEach(p => console.log(`  • ${p}`));
    console.log('  Set FTP_AUTO_OVERRIDE=true in .env to skip per-path prompts.');
  }

  if (!SKIP_CONFIRM) {
    const answer = await confirm('\nProceed with deploy? [y/N] ');
    if (answer !== 'y' && answer !== 'yes') {
      console.log('Deploy cancelled.');
      process.exit(0);
    }
  }

  console.log('');

  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    await client.access({
      host: FTP_HOST,
      user: FTP_USER,
      password: FTP_PASSWORD,
      port: parseInt(FTP_PORT, 10),
      secure: FTP_SECURE === 'true',
    });

    console.log(`Connected to ${FTP_HOST}`);
    console.log(`Uploading out/ → ${FTP_REMOTE_PATH} ...\n`);

    await client.ensureDir(FTP_REMOTE_PATH);

    const overrideDecisions = {};
    await uploadDir(client, LOCAL_DIR, '', overrideDecisions);

    console.log('\n✓ Deploy complete.');
  } catch (err) {
    console.error('\nDeploy failed:', err.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

deploy();
