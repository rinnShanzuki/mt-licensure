/* MODEL: study-progress state, persistence, and derived stats (XP, rank, completion). */

let progress = {};          // lessonId -> {done,again,last}

let currentUserId = null; // Will be set by main.js after login
let storageMode = 'supabase';
let saveSeq = 0;
let pendingSaves = 0;

function setCurrentUser(userId) {
    currentUserId = userId;
}

async function loadProgress(){
    if (!currentUserId) {
        progress = {};
        return;
    }
    setSaveState('loading');
    try {
        progress = await DBService.loadProgress(currentUserId);
        storageMode = 'supabase';
        setSaveState('idle');
    } catch(e) {
        console.error("Failed to load progress", e);
        progress = {};
        storageMode = 'error';
        setSaveState('error');
    }
}

async function saveProgress(){
    if (!currentUserId) return;
    
    const seq = ++saveSeq;
    pendingSaves++;
    setSaveState('saving');
    
    try {
        await DBService.saveProgress(currentUserId, progress);
        if (seq === saveSeq) {
            storageMode = 'supabase';
        }
    } catch(e) {
        console.error("Failed to save progress", e);
        if (seq === saveSeq) {
            storageMode = 'error';
        }
    } finally {
        pendingSaves--;
        if (seq === saveSeq) {
            setSaveState(storageMode === 'error' ? 'error' : 'idle');
        }
    }
}

/* Small fixed badge (lives outside #app so it survives every
   screen re-render) telling you exactly where — or whether —
   your progress is actually being saved. */
function setSaveState(kind){
  const el = document.getElementById('save-status');
  if(!el) return;
  let cls, text;
  if (kind === 'saving' || kind === 'loading'){
    cls = 'saving';
    text = kind === 'loading' ? 'Loading…' : 'Saving…';
  } else if (kind === 'error' || storageMode === 'memory'){
    cls = 'error';
    text = '⚠ Sync Error';
  } else if (storageMode === 'supabase'){
    cls = 'saved';
    text = '✓ Saved to Cloud';
  } else {
    cls = 'saved';
    text = '✓ Saved';
  }
  el.className = 'save-status save-status--' + cls;
  el.innerHTML = '<span class="save-status__dot"></span>' + esc(text);
}

function getStage(id){ return progress[id] || { done:false, again:false, last:false }; }
function setStage(id, stage, value){
  const cur = Object.assign({}, getStage(id));
  cur[stage] = value;
  if(stage==='done' && !value){ cur.again=false; cur.last=false; }
  if(stage==='again' && !value){ cur.last=false; }
  progress[id] = cur;
  saveProgress();
}
function lessonDone(id){ return !!getStage(id).done; }
function allLessons(subject){ return subject.levels.flatMap(l=>l.lessons); }
function levelComplete(level){ return level.lessons.every(l=>lessonDone(l.id)); }
function levelDoneCount(level){ return level.lessons.filter(l=>lessonDone(l.id)).length; }
function isUnlocked(subject, levelIndex){
  if(levelIndex===0) return true;
  return levelComplete(subject.levels[levelIndex-1]);
}
function subjectStats(subject){
  const lessons = allLessons(subject);
  const done = lessons.filter(l=>lessonDone(l.id)).length;
  let currentLevel = subject.levels.length;
  for(let i=0;i<subject.levels.length;i++){
    if(!levelComplete(subject.levels[i])){ currentLevel = i+1; break; }
  }
  return { done, total: lessons.length, currentLevel };
}
function isSubjectMastered(subject){
  return allLessons(subject).every(l=>{ const s=getStage(l.id); return s.done && s.again && s.last; });
}
function totalXP(){
  let xp = 0;
  SUBJECTS.forEach(s=> allLessons(s).forEach(l=>{
    const st = getStage(l.id);
    if(st.done) xp += 10;
    if(st.again) xp += 5;
    if(st.last) xp += 5;
  }));
  return xp;
}
function maxXP(){ return SUBJECTS.reduce((a,s)=>a+allLessons(s).length,0) * 20; }
function rankFor(pct){
  if(pct>=100) return { title:'R.M.T. — Registered Medical Technologist', icon:'🏆' };
  if(pct>=85)  return { title:'Topnotcher in Training', icon:'⭐' };
  if(pct>=65)  return { title:'Licensure Contender', icon:'🥇' };
  if(pct>=45)  return { title:'Board Candidate', icon:'🎓' };
  if(pct>=25)  return { title:'Clinical Trainee', icon:'🧫' };
  if(pct>=10)  return { title:'MedTech Intern', icon:'📘' };
  return { title:'New Reviewee', icon:'🐣' };
}
function allSubjectsComplete(){ return SUBJECTS.every(s=>s.levels.every(levelComplete)); }
