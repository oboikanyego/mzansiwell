import test from 'node:test'; import assert from 'node:assert/strict'; import ExcelJS from 'exceljs'; import {ImportError,importSchedule} from './importer.js';

async function workbook(rows:unknown[][],sheetName='Schedule'){
  const wb=new ExcelJS.Workbook(); wb.addWorksheet(sheetName).addRows(rows);
  return Buffer.from(await wb.xlsx.writeBuffer());
}
const header=['Date','Breakfast','Lunch','Snack','Dinner','Focus','Prep note','Video link'];

test('imports every meal column with ISO dates and videos',async()=>{
  const rows=await importSchedule(await workbook([header,[new Date('2026-08-24'),'Oats','Chicken','Popcorn','Eggs','Walk','Cook extra','https://youtu.be/dQw4w9WgXcQ']]));
  assert.deepEqual(rows,[{row:1,date:'2026-08-24',breakfast:'Oats',lunch:'Chicken',snack:'Popcorn',dinner:'Eggs',focus:'Walk',prepNote:'Cook extra',videos:['https://youtu.be/dQw4w9WgXcQ']}]);
});

test('skips rows without meals and numbers rows from the header',async()=>{
  const rows=await importSchedule(await workbook([header,['Mon','','','','','Rest','',''],['Tue','Oats','','','Fish','','','']]));
  assert.equal(rows.length,1); assert.equal(rows[0]?.row,2); assert.equal(rows[0]?.dinner,'Fish');
});

test('finds the header below a title row and prefers a Schedule sheet',async()=>{
  const wb=new ExcelJS.Workbook(); wb.addWorksheet('Notes').addRow(['ignore me']);
  wb.addWorksheet('Meal schedule').addRows([['My plan'],header,['Mon','Oats','Rice','','Beans']]);
  const rows=await importSchedule(Buffer.from(await wb.xlsx.writeBuffer()));
  assert.equal(rows[0]?.lunch,'Rice');
});

test('rejects non-xlsx uploads such as CSV text',async()=>{
  await assert.rejects(importSchedule(Buffer.from('Date,Breakfast\n2026-08-24,Oats')),(e:Error)=>e instanceof ImportError&&/valid \.xlsx/.test(e.message));
});

test('rejects a corrupt workbook',async()=>{
  await assert.rejects(importSchedule(Buffer.from([0x50,0x4b,0x03,0x04,1,2,3,4])),(e:Error)=>e instanceof ImportError&&/could not be read/.test(e.message));
});

test('reports a missing Date header',async()=>{
  await assert.rejects(importSchedule(await workbook([['Day','Meal'],['Mon','Oats']])),(e:Error)=>e instanceof ImportError&&/No Date column/.test(e.message));
});

test('reports missing meal columns',async()=>{
  await assert.rejects(importSchedule(await workbook([['Date','Focus'],['Mon','Walk']])),(e:Error)=>e instanceof ImportError&&/No meal columns/.test(e.message));
});

test('reports an empty schedule',async()=>{
  await assert.rejects(importSchedule(await workbook([header])),(e:Error)=>e instanceof ImportError&&/no meal rows/.test(e.message));
});
