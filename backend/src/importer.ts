import * as XLSX from 'xlsx';
export function importSchedule(buffer:Buffer){
 const workbook=XLSX.read(buffer,{type:'buffer',cellDates:true});
 const sheetName=workbook.SheetNames.find(n=>/schedule/i.test(n))||workbook.SheetNames[0];
 if(!sheetName) throw new Error('Workbook has no sheets.');
 const rows=XLSX.utils.sheet_to_json<Record<string,unknown>>(workbook.Sheets[sheetName]!,{defval:''});
 return rows.filter(r=>Object.keys(r).some(k=>/date/i.test(k))).map((r,i)=>{
  const find=(term:string)=>{const k=Object.keys(r).find(x=>x.toLowerCase().includes(term));return k?String(r[k]??''):''};
  return {row:i+1,date:find('date'),breakfast:find('breakfast'),lunch:find('lunch'),snack:find('snack'),dinner:find('dinner'),focus:find('focus'),prepNote:find('prep note'),videos:Object.entries(r).filter(([k,v])=>/video/i.test(k)&&v).map(([,v])=>String(v))};
 }).filter(r=>r.breakfast||r.lunch||r.dinner);
}
