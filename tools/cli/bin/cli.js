#!/usr/bin/env node

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { SpaceEraDate } from 'space-era-calendar';

const __dirname = dirname(fileURLToPath(import.meta.url));

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
Space Era Calendar CLI (Standard v1.0)

Usage:
  space-era today                    Display current date in Space Era dual format
  space-era ce <YYYY-MM-DD>          Convert Common Era date to Space Era
  space-era phase1 <YYYY-MM-DD>      Display Phase 1 calculation details
  space-era phase2 <YYYY-MM-DD>      Display Phase 2 calculation details
  space-era migrate <YYYY-MM-DD>     Display Phase 2 migration offset data
  space-era -v, --version            Display CLI version
  `);
}

function printVersion() {
  try {
    const pkgPath = join(__dirname, '../package.json');
    const pkgData = JSON.parse(readFileSync(pkgPath, 'utf8'));
    console.log(`space-era-cli v${pkgData.version}`);
  } catch (err) {
    console.log('space-era-cli v1.0.0');
  }
}

function parseDateArg(dateStr) {
  if (!dateStr) return new Date();
  const parts = dateStr.split('-').map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error('Invalid date format. Please use YYYY-MM-DD.');
  }
  const [year, month, day] = parts;
  return new Date(Date.UTC(year, month - 1, day));
}

try {
  if (command === '-v' || command === '--version') {
    printVersion();
    process.exit(0);
  }

  switch (command) {
    case 'today': {
      const now = new Date();
      const seDate = new SpaceEraDate(now.getUTCFullYear(), now.getUTCMonth() + 1, now.getUTCDate());
      console.log(`Current Space Era Time: ${seDate.toDualString()}`);
      break;
    }
    case 'ce': {
      const dateStr = args[1];
      if (!dateStr) {
        throw new Error('Please provide a date in YYYY-MM-DD format.');
      }
      const seDate = SpaceEraDate.fromIso(dateStr);
      console.log(seDate.toDualString());
      break;
    }
    case 'phase1': {
      const d = parseDateArg(args[1]);
      const seDate = new SpaceEraDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
      console.log(seDate.toPhase1());
      break;
    }
    case 'phase2': {
      const d = parseDateArg(args[1]);
      const seDate = new SpaceEraDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
      console.log(seDate.toPhase2());
      break;
    }
    case 'migrate': {
      const d = parseDateArg(args[1]);
      const seDate = new SpaceEraDate(d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate());
      console.log(seDate.migrateToPhase2());
      break;
    }
    default:
      printHelp();
      break;
  }
} catch (err) {
  console.error(`Error: ${err.message}`);
  process.exit(1);
}
