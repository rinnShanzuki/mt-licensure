/* CONTROLLER: export/import progress backup (file download/upload). */

function exportProgress(){
  const payload = {
    app: 'lab-level-up',
    version: 1,
    exportedAt: new Date().toISOString(),
    progress: progress
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'lab-level-up-backup-' + new Date().toISOString().slice(0,10) + '.json';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url), 1000);
  showToast('⬇ Backup downloaded');
}

function triggerImportPicker(){
  const input = document.getElementById('import-input');
  if(input) input.click();
}

function handleImportFile(event){
  const file = event.target.files && event.target.files[0];
  event.target.value = '';
  if(!file) return;

  const reader = new FileReader();
  reader.onload = function(){
    let data;
    try{
      data = JSON.parse(reader.result);
    }catch(e){
      alert('That file isn\'t a valid backup — it doesn\'t look like readable JSON.');
      return;
    }
    if(!data || typeof data.progress !== 'object' || data.progress === null){
      alert('That file doesn\'t look like a Lab Level-Up backup.');
      return;
    }
    const ok = confirm('Import this backup? It will replace your current progress in this reviewer.');
    if(!ok) return;
    progress = data.progress;
    saveProgress();
    refreshBackground();
    renderLevelModal();
    showToast('✅ Progress imported');
  };
  reader.onerror = function(){ alert('Could not read that file.'); };
  reader.readAsText(file);
}
