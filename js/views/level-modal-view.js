/* VIEW: level detail modal with lesson checkboxes. */

function renderLevelModal(){
  if(!currentModal){ document.getElementById('modal-root').innerHTML=''; return; }
  const s = getSubject(currentModal.subjectId);
  const lvl = getLevel(s, currentModal.levelId);
  const done = levelDoneCount(lvl);
  const complete = levelComplete(lvl);

  const lessonsHtml = lvl.lessons.map(les=>{
    const st = getStage(les.id);
    return (
      '<div class="lesson-row '+(st.done?'lesson-row--done':'')+'">'+
        '<div class="lesson-row__name">'+esc(les.name)+'</div>'+
        '<div class="stamp-group">'+
          '<label class="stamp-check stamp-check--done"><input type="checkbox" '+(st.done?'checked':'')+
            ' onchange="toggleStage(\''+les.id+'\',\''+s.id+'\',\''+lvl.id+'\',\'done\',this.checked)"><span class="stamp-check__box">✓</span> Done</label>'+
          '<label class="stamp-check stamp-check--again"><input type="checkbox" '+(st.again?'checked':'')+(!st.done?' disabled':'')+
            ' onchange="toggleStage(\''+les.id+'\',\''+s.id+'\',\''+lvl.id+'\',\'again\',this.checked)"><span class="stamp-check__box">↻</span> Again</label>'+
          '<label class="stamp-check stamp-check--last"><input type="checkbox" '+(st.last?'checked':'')+(!st.again?' disabled':'')+
            ' onchange="toggleStage(\''+les.id+'\',\''+s.id+'\',\''+lvl.id+'\',\'last\',this.checked)"><span class="stamp-check__box">★</span> Last</label>'+
        '</div>'+
      '</div>'
    );
  }).join('');

  document.getElementById('modal-root').innerHTML =
    '<div class="modal-overlay" onclick="if(event.target===this)closeLevelModal()">'+
      '<div class="modal" role="dialog" aria-modal="true" aria-label="Level '+lvl.num+' details">'+
        '<div class="modal__header">'+
          '<div>'+
            '<div class="eyebrow" style="color:'+s.color+'">LEVEL '+lvl.num+(complete?' · CLEARED':'')+'</div>'+
            '<h2 style="font-size:1.25rem;">'+lvl.icon+' '+esc(lvl.title)+'</h2>'+
            '<div class="player-sub">'+esc(lvl.sub)+'</div>'+
          '</div>'+
          '<button class="btn-icon" onclick="closeLevelModal()" aria-label="Close">✕ close</button>'+
        '</div>'+
        '<div class="modal__body">'+
          '<div class="barcode" style="margin-bottom:14px;"><div class="barcode__fill" style="width:'+Math.round(done/lvl.lessons.length*100)+'%; --fill-color:'+s.color+'"></div></div>'+
          '<div class="modal__hint">Log each topic as you study it: <strong>Done</strong> → first pass, <strong>Again</strong> → reviewed, <strong>Last</strong> → final review before exam day. Clear every "Done" in this level to unlock the next one.</div>'+
          lessonsHtml+
        '</div>'+
      '</div>'+
    '</div>';
}
