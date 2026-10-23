import test,{after,before} from 'node:test'; import assert from 'node:assert/strict'; import ExcelJS from 'exceljs'; import type {AddressInfo} from 'node:net'; import type {Server} from 'node:http'; import {app} from './app.js';

let server:Server; let base='';
before(()=>new Promise<void>(resolve=>{server=app.listen(0,()=>{base=`http://127.0.0.1:${(server.address() as AddressInfo).port}`;resolve();});}));
after(()=>new Promise(resolve=>server.close(resolve)));

async function upload(bytes:Uint8Array|Buffer,name='plan.xlsx'){
  const body=new FormData(); body.append('file',new Blob([new Uint8Array(bytes)]),name);
  return fetch(`${base}/api/import/excel`,{method:'POST',body});
}

test('health reports the storage mode',async()=>{
  const res=await fetch(`${base}/api/health`); assert.equal(res.status,200); assert.equal((await res.json()).status,'ok');
});

test('plan generation validates the profile',async()=>{
  const res=await fetch(`${base}/api/plans/generate`,{method:'POST',headers:{'content-type':'application/json'},body:'{}'});
  assert.equal(res.status,400); assert.ok((await res.json()).issues.length>0);
});

test('plan generation returns a plan',async()=>{
  const profile={name:'T',age:30,sex:'male',heightCm:175,weightKg:85,goal:'lose',activity:'moderate',diet:'vegetarian',budgetZar:2500,planDays:10,familiarFoods:[],pantryFoods:[],excludedFoods:[],allergies:[],mealsPerDay:3};
  const res=await fetch(`${base}/api/plans/generate`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(profile)});
  assert.equal(res.status,201); assert.equal((await res.json()).days.length,10);
});

test('a disallowed CORS origin gets 403',async()=>{
  const res=await fetch(`${base}/api/health`,{headers:{origin:'https://evil.example'}});
  assert.equal(res.status,403); assert.equal((await res.json()).message,'Origin is not allowed by CORS.');
});

test('malformed JSON gets 400, not 500',async()=>{
  const res=await fetch(`${base}/api/plans/generate`,{method:'POST',headers:{'content-type':'application/json'},body:'{nope'});
  assert.equal(res.status,400);
});

test('import accepts a valid workbook',async()=>{
  const wb=new ExcelJS.Workbook(); wb.addWorksheet('Schedule').addRows([['Date','Breakfast','Lunch','Dinner'],[new Date('2026-08-24'),'Oats','Chicken','Fish']]);
  const res=await upload(Buffer.from(await wb.xlsx.writeBuffer()));
  assert.equal(res.status,200); const json=await res.json(); assert.equal(json.rows[0].date,'2026-08-24');
});

test('import rejects CSV and a missing file with 400',async()=>{
  const csv=await upload(Buffer.from('Date,Breakfast\n2026-08-24,Oats'),'plan.csv');
  assert.equal(csv.status,400); assert.match((await csv.json()).message,/valid \.xlsx/);
  const none=await fetch(`${base}/api/import/excel`,{method:'POST'}); assert.equal(none.status,400);
});

test('import rejects files over 5 MB with 413',async()=>{
  const res=await upload(Buffer.alloc(5*1024*1024+1)); assert.equal(res.status,413);
});
