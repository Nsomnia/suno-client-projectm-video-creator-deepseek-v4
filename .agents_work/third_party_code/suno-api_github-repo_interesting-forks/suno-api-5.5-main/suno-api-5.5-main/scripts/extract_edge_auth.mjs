import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'rebrowser-playwright-core';

const userDataDir = path.join(
  process.env.LOCALAPPDATA,
  'Microsoft',
  'Edge',
  'User Data',
);

const cookieNames = new Set([
  '__client',
  '__client_Jnxw-muT',
  '__session',
  '__session_Jnxw-muT',
  '__client_uat',
  '__client_uat_Jnxw-muT',
  '_u',
  'clerk_active_context',
  'has_logged_in_before',
  'suno_device_id',
]);

function buildCookieHeader(cookies) {
  const sunoCookies = cookies.filter(
    (cookie) => cookie.domain.includes('suno') || cookie.domain.includes('clerk'),
  );

  const prioritized = [];
  const remainder = [];

  for (const cookie of sunoCookies) {
    if (cookieNames.has(cookie.name)) {
      prioritized.push(cookie);
    } else {
      remainder.push(cookie);
    }
  }

  const ordered = [...prioritized, ...remainder.sort((a, b) => a.name.localeCompare(b.name))];
  const seen = new Set();

  return ordered
    .filter((cookie) => {
      const key = `${cookie.domain}|${cookie.name}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

async function main() {
  console.log('Launching Edge profile to read Suno auth cookies...');
  console.log('Close Microsoft Edge first if this hangs or fails.\n');

  const context = await chromium.launchPersistentContext(userDataDir, {
    channel: 'msedge',
    headless: true,
    args: ['--profile-directory=Default'],
  });

  try {
    const cookies = await context.cookies([
      'https://suno.com',
      'https://auth.suno.com',
      'https://app.suno.ai',
      'https://clerk.suno.com',
    ]);

    const header = buildCookieHeader(cookies);
    if (!header.includes('__client')) {
      throw new Error('No __client cookie found. Sign in at https://app.suno.ai in Edge first.');
    }

    const envPath = path.resolve(process.cwd(), '.env');
    fs.writeFileSync(envPath, `SUNO_COOKIE=${header}\n`, 'utf8');

    console.log(`Wrote ${cookies.length} cookies to ${envPath}`);
    console.log(`Preview: ${header.slice(0, 72)}...`);
  } finally {
    await context.close().catch(() => undefined);
  }
}

main().catch((error) => {
  console.error('Failed to extract Edge auth:', error.message);
  process.exit(1);
});