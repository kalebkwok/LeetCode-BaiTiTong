import {dayKey, addCalendarDays} from './time.js';
  'use strict';
  const INTERVALS = [1, 3, 7, 14, 30];
  const SKILLS = ['recognize', 'explain', 'implement'];
  const copy = value => JSON.parse(JSON.stringify(value));

  const empty = () => ({version: 1, records: {}, skills: {}, notes: {}});
  const plain = x => x !== null && typeof x === 'object' && !Array.isArray(x);
  const timestamp = x => Number.isFinite(x) && x >= 0 && x < 8640000000000000;
  const validId = x => /^lc-\d+$/.test(x);
  function validate(input) {
    if (!plain(input) || input.version !== 1 || !plain(input.records) || !plain(input.skills) || !plain(input.notes)) throw Error('备份格式不正确，原有进度没有改变。');
    const result = empty();
    for (const [id, r] of Object.entries(input.records)) {
      if (!validId(id) || !plain(r) || !Number.isInteger(r.stage) || r.stage < -1 || r.stage > 4 || !['main','followup'].includes(r.phase) || !Number.isInteger(r.reviews) || r.reviews < 1 || ![r.firstSeen,r.lastReviewed,r.due].every(timestamp) || r.lastReviewed < r.firstSeen) throw Error('复习记录有无效值，未导入。');
      result.records[id] = {stage:r.stage,phase:r.phase,reviews:r.reviews,firstSeen:r.firstSeen,lastReviewed:r.lastReviewed,due:r.due};
    }
    for (const [id, skills] of Object.entries(input.skills)) {
      if (!validId(id) || !plain(skills)) throw Error('能力记录无效，未导入。');
      result.skills[id] = {};
      for (const [key, s] of Object.entries(skills)) {
        if (!SKILLS.includes(key) || !plain(s) || ![0,1,2].includes(s.value) || !timestamp(s.at)) throw Error('能力评分无效，未导入。');
        result.skills[id][key] = {value:s.value,at:s.at};
      }
    }
    for (const [id, note] of Object.entries(input.notes)) {
      if (!validId(id) || !plain(note) || typeof note.text !== 'string' || note.text.length > 1500 || !timestamp(note.at)) throw Error('卡点笔记无效，未导入。');
      result.notes[id] = {text:note.text,at:note.at};
    }
    return result;
  }
  function queue(state, cards, now = Date.now(), dailyNewLimit = 3) {
    const today = dayKey(now);
    const introduced = Object.values(state.records).filter(r => dayKey(r.firstSeen) === today).length;
    const due = cards.filter(c => state.records[c.uid]?.due <= now).sort((a,b) => state.records[a.uid].due - state.records[b.uid].due);
    const fresh = cards.filter(c => !state.records[c.uid]).slice(0, Math.max(0, dailyNewLimit-introduced));
    return [...due,...fresh].map(c => ({uid:c.uid,kind:state.records[c.uid]?.phase || 'main'}));
  }
  function schedule(record, score, now = Date.now()) {
    if (![0,1,2].includes(score)) throw Error('请选择这次的回忆情况。');
    if (score === 0) return {stage:-1,due:now+10*60*1000,label:'10 分钟后'};
    const stage = score === 1 ? 0 : Math.min((record?.stage ?? -1)+1, INTERVALS.length-1);
    return {stage,due:addCalendarDays(now,INTERVALS[stage]),label:`${INTERVALS[stage]} 天后`};
  }
  function review(state, {uid,kind,ratings,usedHelp=false,practice=false}, now = Date.now()) {
    if (!validId(uid) || !['main','followup','code'].includes(kind) || !plain(ratings)) throw Error('复习请求无效。');
    const expected = kind === 'main' ? ['recognize','explain'] : kind === 'code' ? ['implement'] : ['explain'];
    if (Object.keys(ratings).length !== expected.length || !expected.every(k => [0,1,2].includes(ratings[k]))) throw Error('请分别评价本次练到的能力。');
    const result = copy(state);
    result.skills[uid] ||= {};
    const scores = expected.map(key => {
      const value = usedHelp ? Math.min(ratings[key],1) : ratings[key];
      result.skills[uid][key] = {value,at:now};
      return value;
    });
    if (practice || kind === 'code') return {state:result,label:'已记录能力自评，复习日期不变'};
    const score = Math.min(...scores), old = state.records[uid];
    const next = schedule(old,score,now);
    result.records[uid] = {stage:next.stage,due:next.due,firstSeen:old?.firstSeen ?? now,lastReviewed:now,reviews:(old?.reviews ?? 0)+1,phase:score === 0 ? kind : kind === 'main' ? 'followup' : 'main'};
    return {state:result,label:`下次复习：${next.label}`};
  }
  function merge(current, incoming) {
    const result = validate(current), other = validate(incoming);
    for (const [id,r] of Object.entries(other.records)) {
      const old = result.records[id];
      if (!old) result.records[id] = r;
      else result.records[id] = {...(r.lastReviewed > old.lastReviewed ? r : old),firstSeen:Math.min(r.firstSeen,old.firstSeen)};
    }
    for (const [id,skills] of Object.entries(other.skills)) {
      result.skills[id] ||= {};
      for (const [key,s] of Object.entries(skills)) if (!result.skills[id][key] || s.at > result.skills[id][key].at) result.skills[id][key] = s;
    }
    for (const [id,note] of Object.entries(other.notes)) if (!result.notes[id] || note.at > result.notes[id].at) result.notes[id] = note;
    return result;
  }
  function stats(state, cards, now = Date.now()) {
    const records = cards.map(c=>state.records[c.uid]).filter(Boolean);
    return {started:records.length,reviewed:records.filter(r=>dayKey(r.lastReviewed)===dayKey(now)).length,due:records.filter(r=>r.due<=now).length,new:queue(state,cards,now).filter(c=>!state.records[c.uid]).length,nextDue:Math.min(...records.filter(r=>r.due>now).map(r=>r.due))};
  }
  const api = {INTERVALS,SKILLS,empty,validate,queue,schedule,review,merge,stats,dayKey};
export {INTERVALS,SKILLS,empty,validate,queue,schedule,review,merge,stats,dayKey};
export default api;
