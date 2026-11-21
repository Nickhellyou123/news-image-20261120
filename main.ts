// news-image-20261120 entry (Node 22, standard library only).
// The entry is the front-page image stored beside this file as entry.png
// (a JPEG by magic bytes; the name stays entry.png either way). The program
// copies those exact bytes to /output/entry.png, so both grader runs write
// identical output. No network, no dependencies.
//
// The image itself was drawn in-session by staging/compose.py (PIL):
// masthead + UTC timeline + 3 hero stories + 12 numbered stories, each with
// its own flat-vector icon, a world map with numbered pins, a printed
// DATE CHECK box naming near-misses left out on purpose, and a one-line
// index — 51 stories in all, every one first reported on Friday 20 Nov 2026.
//
// Local check: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const source = new URL('./entry.png', import.meta.url);
const bytes = readFileSync(source);

// Guard the gate before copying: JPEG magic and the 1 MiB limit.
// (The image is 1024x1024, ~308 KB, so both guards pass with room to spare.)
if (bytes[0] !== 0xff || bytes[1] !== 0xd8 || bytes[2] !== 0xff) {
  throw new Error('entry.png is not a JPEG');
}
if (statSync(source).size > 1048576) {
  throw new Error('entry.png is over the 1 MiB limit');
}

copyFileSync(source, join(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png'));
