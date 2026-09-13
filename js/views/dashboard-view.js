/* VIEW: loading screen + main dashboard (subject cards, XP bar). */

function renderLoading(){
  document.getElementById('app').innerHTML = '<div class="loading-screen"><div class="eyebrow">Loading reviewer\'s log…</div></div>';
}

function renderDashboard(){
  const xp = totalXP(), max = maxXP();
  const pct = Math.round((xp/max)*100);
  const rank = rankFor(pct);
  const totalLessons = SUBJECTS.reduce((a,s)=>a+allLessons(s).length,0);
  const doneLessons = SUBJECTS.reduce((a,s)=>a+allLessons(s).filter(l=>lessonDone(l.id)).length,0);
  const clearedSubjects = SUBJECTS.filter(s=>s.levels.every(levelComplete)).length;

  const cards = SUBJECTS.map((s,i)=>{
    const stats = subjectStats(s);
    const subjPct = Math.round((stats.done/stats.total)*100);
    const complete = stats.done === stats.total;
    const mastered = isSubjectMastered(s);
    const curLevel = s.levels[stats.currentLevel-1];
    const ctaLabel = subjPct===0 ? 'Open file' : (complete ? 'Review file' : 'Continue');
    return (
      '<div class="file-card" style="--accent:'+s.color+'; animation-delay:'+(i*70)+'ms" tabindex="0" role="button" aria-label="Open '+esc(s.name)+'"'+
      ' onclick="openSubject(\''+s.id+'\')" onkeydown="if(event.key===\'Enter\')openSubject(\''+s.id+'\')">'+
        '<div class="file-card__tab">FILE · '+s.tag+'</div>'+
        (mastered ? '<div class="file-card__badge" title="Fully mastered">🏆</div>' : (complete ? '<div class="file-card__badge" title="Cleared">✅</div>' : '')) +
        '<div class="file-card__icon">'+s.icon+'</div>'+
        '<div class="file-card__title">'+esc(s.name)+'</div>'+
        '<div class="file-card__level">'+(complete ? 'All levels cleared' : 'Level '+stats.currentLevel+' of '+s.levels.length+' · '+esc(curLevel.title))+'</div>'+
        '<div class="barcode" aria-hidden="true"><div class="barcode__fill" style="width:'+subjPct+'%; --fill-color:'+s.color+'"></div></div>'+
        '<div class="file-card__meta">'+stats.done+'/'+stats.total+' topics logged</div>'+
        '<div class="file-card__cta" style="color:'+s.color+'">'+ctaLabel+' →</div>'+
      '</div>'
    );
  }).join('');

  document.getElementById('app').innerHTML =
    '<header class="masthead">'+
      '<div class="masthead__top">'+
        '<div>'+
          '<div class="eyebrow">Medical Technology Licensure Exam · Reviewer\'s Log</div>'+
          '<h1>LAB LEVEL-UP</h1>'+
          '<div class="tagline">Every topic logged. Every level earned.</div>'+
        '</div>'+
        '<div class="case-no">CASE NO. '+String(doneLessons).padStart(3,'0')+'<br>'+
          new Date().toLocaleDateString(undefined,{year:'numeric',month:'short',day:'2-digit'})+
          '<div class="case-actions">'+
            '<button class="btn-icon" aria-label="Download a backup of your progress" onclick="exportProgress()">⬇ export backup</button>'+
            '<button class="btn-icon" aria-label="Restore progress from a backup file" onclick="triggerImportPicker()">⬆ import backup</button>'+
            '<button class="btn-icon" aria-label="Reset all progress" onclick="resetProgress()">⟲ reset progress</button>'+
          '</div>'+
        '</div>'+
      '</div>'+
    '</header>'+
    '<section class="player-panel">'+
      '<div><div class="player-rank">'+rank.icon+' '+rank.title+'</div><div class="player-sub">'+xp+' / '+max+' XP earned</div></div>'+
      '<div class="player-bar-wrap">'+
        '<div class="barcode"><div class="barcode__fill" style="width:'+pct+'%"></div></div>'+
        '<div class="player-sub" style="margin-top:6px;">'+doneLessons+'/'+totalLessons+' topics logged across all 6 subjects · '+clearedSubjects+'/6 files cleared</div>'+
      '</div>'+
    '</section>'+
    '<div class="eyebrow" style="margin-bottom:26px;">Choose a case file to open</div>'+
    '<div class="file-grid">'+cards+'</div>'+
    '<footer class="log-footer">"I can do all things through Christ who strengthens me." — Phil 4:13<br>Keep logging. You\'ve got this, future RMT.</footer>';
}
