import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const publicDirectory=resolve('public');
const apiBaseUrl=(process.env.API_BASE_URL||'').trim().replace(/\/$/,'');
const config=`window.__EATHEALTHY_CONFIG__ = ${JSON.stringify({apiBaseUrl},null,2)};\n`;

await mkdir(publicDirectory,{recursive:true});
await writeFile(resolve(publicDirectory,'runtime-config.js'),config,'utf8');
console.log(`Runtime API target: ${apiBaseUrl||'same-origin / local proxy'}`);
