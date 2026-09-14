// Every browser uses the server's shared learning calendar.
let zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
let offset = 0;
export function configureClock(timeZone, serverNow, receivedAt = Date.now()) {
  if (timeZone) { new Intl.DateTimeFormat('en', {timeZone}).format(); zone = timeZone; }
  if (Number.isFinite(serverNow)) offset = serverNow - receivedAt;
}
export const now = () => Date.now() + offset;
export const timeZone = () => zone;
function parts(time, timeZone = zone) {
  return Object.fromEntries(new Intl.DateTimeFormat('en-CA', {timeZone, year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit', second:'2-digit', hourCycle:'h23'}).formatToParts(time).filter(p=>p.type!=='literal').map(p=>[p.type,Number(p.value)]));
}
export function dayKey(time, timeZone = zone) {
  const p=parts(time,timeZone);
  return `${p.year}-${String(p.month).padStart(2,'0')}-${String(p.day).padStart(2,'0')}`;
}
export function displayTime(time, short = false) {
  if (!Number.isFinite(time)) return '—';
  return new Intl.DateTimeFormat('zh-CN',{timeZone:zone,...(!short?{year:'numeric',month:'2-digit',day:'2-digit'}:{}),hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).format(time);
}
export function addCalendarDays(time, days, timeZone = zone) {
  const p=parts(time,timeZone), target=Date.UTC(p.year,p.month-1,p.day+days,p.hour,p.minute,p.second,time%1000);
  // Resolve wall time using offsets near the target. At a fall overlap, prefer
  // the earlier occurrence. At a spring gap, advance by the size of the gap.
  const wall = value => {const q=parts(value,timeZone); return Date.UTC(q.year,q.month-1,q.day,q.hour,q.minute,q.second,value%1000);};
  const offsets=[...new Set([-2,-1,0,1,2].map(d=>{const t=target+d*86400000;return wall(t)-t;}))];
  const candidates=offsets.map(o=>target-o).sort((a,b)=>a-b);
  return candidates.find(t=>wall(t)===target) ?? candidates.filter(t=>wall(t)>target).sort((a,b)=>wall(a)-wall(b))[0];
}
