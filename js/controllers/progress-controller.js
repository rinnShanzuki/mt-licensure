/* CONTROLLER: handles a lesson checkbox change and the reset button. */

function toggleStage(lessonId, subjectId, levelId, stage, checked){
  const s = getSubject(subjectId);
  const lvl = getLevel(s, levelId);
  const wasLevelComplete = levelComplete(lvl);
  const wasAllComplete = allSubjectsComplete();

  setStage(lessonId, stage, checked);

  renderLevelModal();
  refreshBackground();

  const nowLevelComplete = levelComplete(lvl);
  if(!wasLevelComplete && nowLevelComplete){
    const subjectNowComplete = s.levels.every(levelComplete);
    if(subjectNowComplete){
      celebrate('🏆 '+s.name+' — every level cleared!', s.color, 60);
    }else{
      const next = s.levels[lvl.num];
      celebrate('🎉 Level '+lvl.num+' logged!'+(next ? ' Level '+next.num+' unlocked.' : ''), s.color, 32);
    }
  }
  if(!wasAllComplete && allSubjectsComplete()){
    setTimeout(()=>celebrate('🎓 All six files cleared — you are exam-ready. Good luck, future RMT!', 'var(--gold)', 90), 900);
  }
}

function resetProgress(){
  const ok = confirm('Reset ALL logged progress across every subject? This cannot be undone.');
  if(!ok) return;
  progress = {};
  saveProgress();
  refreshBackground();
}
