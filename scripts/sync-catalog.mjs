import { writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SOURCE = 'https://raw.githubusercontent.com/Marcus-W-Camargo/liste-e-compre/main/src/data/produtosMercado.json';
const here = dirname(fileURLToPath(import.meta.url));
const target = resolve(here, '../src/data/produtosMercado.json');

const response = await fetch(SOURCE, { signal: AbortSignal.timeout(20_000) });
if (!response.ok) throw new Error(`Falha ao buscar catálogo oficial: HTTP ${response.status}`);
const data = await response.json();
if (!Array.isArray(data) || data.length < 900 || data.some((item) => typeof item !== 'string' || !item.trim())) {
  throw new Error('O catálogo oficial retornou um formato inesperado ou incompleto.');
}
const unique = [...new Set(data.map((item) => item.normalize('NFC').trim()))];
if (unique.length < 900) throw new Error('O catálogo oficial perdeu itens após deduplicação.');
await writeFile(target, `${JSON.stringify(unique, null, 2)}\n`, 'utf8');
console.log(`Catálogo sincronizado: ${unique.length} produtos.`);
