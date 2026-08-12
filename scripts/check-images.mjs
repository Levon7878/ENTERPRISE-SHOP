import fs from 'fs';

const files = [
  'src/data/products.ts',
  'src/data/categories.ts',
  'src/data/brands.ts',
  'src/data/banks.ts',
  'src/data/reviews.ts',
];

const urls = new Set();
for (const f of files) {
  const text = fs.readFileSync(f, 'utf8');
  for (const m of text.matchAll(/https:\/\/images\.unsplash\.com[^'"\s]+/g)) {
    urls.add(m[0]);
  }
}

const list = [...urls];
console.log('Checking', list.length, 'urls...');

for (const u of list) {
  try {
    const r = await fetch(u, { method: 'HEAD', redirect: 'follow' });
    const status = r.status;
    if (status !== 200) console.log('BAD', status, u);
    else console.log('OK', u.slice(0, 80));
  } catch (e) {
    console.log('ERR', u.slice(0, 80), e.message);
  }
}
