/* CONTROLLER: screen/modal navigation state + transitions. */

let view = { screen:'dashboard', subjectId:null };
let currentModal = null;    // {subjectId, levelId}

function openSubject(id){ view = { screen:'subject', subjectId:id }; renderSubjectMap(id); window.scrollTo(0,0); }
function backToDashboard(){ view = { screen:'dashboard' }; renderDashboard(); window.scrollTo(0,0); }
function openLevel(subjectId, levelId){ currentModal = { subjectId, levelId }; renderLevelModal(); }
function closeLevelModal(){ currentModal = null; renderLevelModal(); }
function refreshBackground(){
  if(view.screen==='dashboard') renderDashboard();
  else if(view.screen==='subject') renderSubjectMap(view.subjectId);
}
