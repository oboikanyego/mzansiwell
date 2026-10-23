import ExcelJS from 'exceljs';

export class ImportError extends Error {}

export interface ScheduleRow{row:number;date:string;breakfast:string;lunch:string;snack:string;dinner:string;focus:string;prepNote:string;videos:string[]}

const zipSignature=Buffer.from([0x50,0x4b,0x03,0x04]);
const mealColumns=['breakfast','lunch','snack','dinner'];
const headerScanRows=10;

function cellText(value:ExcelJS.CellValue):string{
 if(value===null||value===undefined)return '';
 if(value instanceof Date)return value.toISOString().slice(0,10);
 if(typeof value!=='object')return String(value).trim();
 if('richText' in value)return value.richText.map(part=>part.text).join('').trim();
 if('hyperlink' in value)return String(value.hyperlink||value.text||'').trim();
 if('result' in value)return cellText(value.result as ExcelJS.CellValue);
 if('error' in value)return '';
 return '';
}

export async function importSchedule(buffer:Buffer):Promise<ScheduleRow[]>{
 if(buffer.length<4||!buffer.subarray(0,4).equals(zipSignature))throw new ImportError('Upload a valid .xlsx workbook.');
 const workbook=new ExcelJS.Workbook();
 try{await workbook.xlsx.load(buffer as unknown as ExcelJS.Buffer);}catch{throw new ImportError('The workbook could not be read. Save it as .xlsx and try again.');}
 const sheet=workbook.worksheets.find(s=>/schedule/i.test(s.name))||workbook.worksheets[0];
 if(!sheet)throw new ImportError('Workbook has no sheets.');

 let headerRow=0;
 const headers=new Map<number,string>();
 for(let r=1;r<=Math.min(sheet.rowCount,headerScanRows)&&!headerRow;r++){
  const found=new Map<number,string>();
  sheet.getRow(r).eachCell((cell,col)=>{const text=cellText(cell.value).toLowerCase();if(text)found.set(col,text);});
  if([...found.values()].some(text=>text.includes('date'))){headerRow=r;found.forEach((text,col)=>headers.set(col,text));}
 }
 if(!headerRow)throw new ImportError('No Date column was found. Add a header row containing Date, Breakfast, Lunch, Snack and Dinner.');
 const present=new Set(mealColumns.filter(meal=>[...headers.values()].some(h=>h.includes(meal))));
 if(!present.size)throw new ImportError('No meal columns were found. Expected headers such as Breakfast, Lunch, Snack or Dinner.');

 const columnFor=(term:string)=>[...headers].find(([,text])=>text.includes(term))?.[0];
 const read=(row:ExcelJS.Row,term:string)=>{const col=columnFor(term);return col?cellText(row.getCell(col).value):''};
 const videoColumns=[...headers].filter(([,text])=>text.includes('video')).map(([col])=>col);

 const rows:ScheduleRow[]=[];
 for(let r=headerRow+1;r<=sheet.rowCount;r++){
  const row=sheet.getRow(r);
  const entry={row:r-headerRow,date:read(row,'date'),breakfast:read(row,'breakfast'),lunch:read(row,'lunch'),snack:read(row,'snack'),dinner:read(row,'dinner'),focus:read(row,'focus'),prepNote:read(row,'prep note'),videos:videoColumns.map(col=>cellText(row.getCell(col).value)).filter(Boolean)};
  if(entry.breakfast||entry.lunch||entry.dinner)rows.push(entry);
 }
 if(!rows.length)throw new ImportError('The workbook has a header row but no meal rows.');
 return rows;
}
