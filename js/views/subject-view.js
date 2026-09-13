/* VIEW: single-subject level map. */

function renderSubjectMap(subjectId){
  const s = getSubject(subjectId);
  const stats = subjectStats(s);
  const subjPct = Math.round((stats.done/stats.total)*100);

  const rows = s.levels.map((lvl,i)=>{
    const unlocked = isUnlocked(s,i);
    const complete = levelComplete(lvl);
    const done = levelDoneCount(lvl);
    const side = (i%2===0) ? 'left' : 'right';
    let stateClass = 'level-node--locked';
    if(complete) stateClass = 'level-node--complete';
    else if(unlocked) stateClass = 'level-node--current';

    const clickable = unlocked
      ? ' onclick="openLevel(\''+s.id+'\',\''+lvl.id+'\')" role="button" tabindex="0" onkeydown="if(event.key===\'Enter\')openLevel(\''+s.id+'\',\''+lvl.id+'\')"'
      : '';

    const meta = unlocked
      ? '<div class="barcode" style="height:13px;margin-top:2px;"><div class="barcode__fill" style="width:'+Math.round(done/lvl.lessons.length*100)+'%; --fill-color:'+s.color+'"></div></div>'+
        '<div class="level-info__meta">'+done+'/'+lvl.lessons.length+' logged'+(complete?' · cleared':'')+'</div>'
      : '<div class="level-info__meta">Locked — clear Level '+(lvl.num-1)+' to open</div>';

    return (
      '<div class="level-row level-row--'+side+'">'+
        '<div class="level-node-wrap"'+clickable+'>'+
          '<div class="level-node '+stateClass+'" style="--node-color:'+s.color+'">'+
            '<span>'+(complete ? '✔' : lvl.icon)+'</span>'+
            (!unlocked ? '<div class="level-node__lock">🔒</div>' : '')+
          '</div>'+
          '<div class="level-info">'+
            '<div class="level-info__title">Level '+lvl.num+' · '+esc(lvl.title)+'</div>'+
            '<div class="level-info__sub">'+esc(lvl.sub)+'</div>'+
            meta+
          '</div>'+
        '</div>'+
      '</div>'
    );
  }).join('');

  document.getElementById('app').innerHTML =
    '<button class="btn" onclick="backToDashboard()">← Back to case files</button>'+
    '<header class="masthead" style="margin-top:18px;">'+
      '<div class="masthead__top">'+
        '<div><div class="eyebrow" style="color:'+s.color+'">FILE · '+s.tag+'</div><h1 style="font-size:2rem;">'+s.icon+' '+esc(s.name)+'</h1></div>'+
        '<div class="case-no">'+stats.done+'/'+stats.total+' topics<br>logged</div>'+
      '</div>'+
      '<div class="barcode" style="margin-top:14px;"><div class="barcode__fill" style="width:'+subjPct+'%; --fill-color:'+s.color+'"></div></div>'+
    '</header>'+
    '<div class="level-path">'+rows+'</div>';
}
