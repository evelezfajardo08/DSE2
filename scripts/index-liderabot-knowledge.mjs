import 'dotenv/config';
import { access } from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { GoogleGenAI } from '@google/genai';

const apiKey = process.env.GEMINI_API_KEY;
const storeName = process.env.GEMINI_FILE_SEARCH_STORE_NAME;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY no está configurada en .env.');
}

if (!storeName) {
  throw new Error('GEMINI_FILE_SEARCH_STORE_NAME no está configurada en .env.');
}

const sources = [
  {
    path: path.resolve('documents/LideraBot/base-conocimiento-liderazgo.md'),
    displayName: 'base-conocimiento-liderazgo.md',
    mimeType: 'text/markdown',
  },
  {
    path: path.resolve('documents/LideraBot/catalogo-fuentes.csv'),
    displayName: 'catalogo-fuentes.csv',
    mimeType: 'text/plain',
  },
];

for (const source of sources) {
  await access(source.path);
}

const ai = new GoogleGenAI({ apiKey });
const documents = await ai.fileSearchStores.documents.list({ parent: storeName });
const indexedNames = new Set();

for await (const document of documents) {
  if (document.displayName) indexedNames.add(document.displayName);
}

for (const source of sources) {
  if (indexedNames.has(source.displayName)) {
    console.log(`Ya indexado: ${source.displayName}`);
    continue;
  }

  console.log(`Indexando: ${source.displayName}`);
  let operation = await ai.fileSearchStores.uploadToFileSearchStore({
    fileSearchStoreName: storeName,
    file: source.path,
    config: { displayName: source.displayName, mimeType: source.mimeType },
  });

  while (!operation.done) {
    await delay(2000);
    operation = await ai.operations.get({ operation });
  }

  if (operation.error) {
    throw new Error(`Falló la indexación de ${source.displayName}: ${JSON.stringify(operation.error)}`);
  }

  console.log(`Indexado: ${source.displayName}`);
}

console.log(`Sincronización terminada: ${storeName}`);