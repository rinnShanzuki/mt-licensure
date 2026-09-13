/* MODEL: exam content - subjects/levels/lessons, plus simple lookups. */

const RAW_SUBJECTS = [
  { id:'chem', name:'Clinical Chemistry', icon:'🧪', color:'var(--chem)',
    levels:[
      { title:'Lab Rookie', sub:'Foundations & Safety', icon:'🧪', lessons:[
        'Specimen collection','Laboratory safety','Reagent preparation and laboratory mathematics'] },
      { title:'Bench Technician', sub:'Tools & Quality', icon:'⚙️', lessons:[
        'Instrumentation (Principles, Methods, Calibration, Others)','Quality assurance'] },
      { title:'Metabolic Scout', sub:'Core Metabolic Panel', icon:'🍬', lessons:[
        'Water balance and electrolytes','NPN and other metabolic intermediaries and inorganic ions','Carbohydrates'] },
      { title:'Metabolic Specialist', sub:'Advanced Metabolic Panel', icon:'🧬', lessons:[
        'Lipids and dysproteinemia','Specific proteins','Liver function tests','Clinical enzymology'] },
      { title:'Hormone Hunter', sub:'Endocrinology', icon:'🦋', lessons:[
        'Thyroid hormones','Sex hormones','Other hormones (Pituitary, Adrenal)'] },
      { title:'Tox Screener', sub:'Toxicology', icon:'☠️', lessons:[
        'Substance of abuse','Other poisons/toxic agents (Alcohol, Carbon monoxide, Mercury, Lead, Arsenic)','TDM — anticonvulsants and other drugs'] },
      { title:'Blood Gas Boss', sub:'Capstone', icon:'🫁', lessons:[
        'Blood gas analysis and other tests (Principles, Procedures, Diseases/Disorders, Reference values)'] },
    ]},
  { id:'mipa', name:'Microbiology & Parasitology', icon:'🦠', color:'var(--mipa)',
    levels:[
      { title:'Micro Rookie', sub:'Lab Basics', icon:'🔬', lessons:[
        'Collection, transport, processing and staining of specimens','Culture media',
        'Equipment and instrumentation — manual','Equipment and instrumentation — automated'] },
      { title:'Safety Officer', sub:'Quality Assurance & Safety', icon:'🥽', lessons:[
        'Quality assurance and safety: collection of specimen','Quality control',
        'Safety — patient/staff','Safety — workplace/environment'] },
      { title:'Aerobe Apprentice', sub:'Aerobic Bacteria I', icon:'🦠', lessons:[
        'Bacteria (Aerobes): morphology and staining characteristics','Bacteria (Aerobes): cultural characteristics'] },
      { title:'Aerobe Analyst', sub:'Aerobic Bacteria II', icon:'🧫', lessons:[
        'Work-up for identification: biochemical, differential and confirmatory tests',
        'Serologic/molecular tests','Susceptibility tests'] },
      { title:'Field Inspector', sub:'Applied & Anaerobic Bacteriology', icon:'🥛', lessons:[
        'Bacteriologic examination of water, food, milk, and utensils','Bacteria (Anaerobes)'] },
      { title:'Specialist Hunter', sub:'Unusual Bacteria', icon:'🩻', lessons:[
        'Mycobacteria','Other bacteria with unusual growth requirements (Spirochetes, Chlamydia, Mycoplasma, Rickettsia)'] },
      { title:'Fungal Explorer', sub:'Mycology', icon:'🍄', lessons:[
        'Collection, transport and examination of clinical specimens (Mycology)','Culture (Mycology)'] },
      { title:'Virus Tracker', sub:'Virology', icon:'🧬', lessons:[
        'General characteristics, transmission and diseases (Virology)',
        'Collection, transport and examination of clinical specimens (Virology)'] },
      { title:'Parasite Scout', sub:'Protozoa & Roundworms', icon:'🐛', lessons:[
        'Protozoa','Nematodes'] },
      { title:'Worm Wrangler', sub:'Tapeworms, Flukes & Ectoparasites', icon:'🪱', lessons:[
        'Cestodes','Trematodes','Ectoparasites'] },
      { title:'Parasitology Master', sub:'Lab Techniques & QA · Capstone', icon:'🔍', lessons:[
        'Parasitologic techniques: routine','Parasitologic techniques: concentration','Parasitologic techniques: others',
        'Quality assurance: collection and preservation of specimen','Quality assurance: quality control'] },
    ]},
  { id:'cmic', name:'Clinical Microscopy', icon:'🔬', color:'var(--cmic)',
    levels:[
      { title:'Microscopy Rookie', sub:'Lab Basics', icon:'🔬', lessons:[
        'Collection, preservation and handling of specimens','Microscope, automation, other instruments','Quality assurance and laboratory safety'] },
      { title:'Urinalysis Apprentice', sub:'Urine Foundations', icon:'💧', lessons:[
        'Anatomy and physiology of the kidney','Formation of urine','Macroscopic examination'] },
      { title:'Urinalysis Analyst', sub:'Core Urine Testing', icon:'🧪', lessons:[
        'Chemical analyses','Microscopic examination'] },
      { title:'Urinalysis Specialist', sub:'Special Urine Tests', icon:'💎', lessons:[
        'Pregnancy testing','Renal calculi'] },
      { title:'Fecalysis Expert', sub:'Feces', icon:'🧫', lessons:[
        'Feces'] },
      { title:'Fluid Investigator I', sub:'Body Fluids', icon:'💧', lessons:[
        'CSF','Seminal fluid','Synovial fluid'] },
      { title:'Fluid Investigator II', sub:'Advanced Body Fluids · Capstone', icon:'🫗', lessons:[
        'Amniotic fluid','Gastric fluid and duodenal content','Sputum and bronchial washings','Peritoneal, pleural, and pericardial fluids'] },
    ]},
  { id:'hema', name:'Hematology', icon:'🩸', color:'var(--hema)',
    levels:[
      { title:'Phlebotomy Rookie', sub:'Blood Collection', icon:'💉', lessons:[
        'Blood collection, anticoagulants and others (including Safety)'] },
      { title:'CBC Technician', sub:'Core Hematology Testing', icon:'🩸', lessons:[
        'Hematology tests and procedures: routine','Hematology tests and procedures: automation'] },
      { title:'Cell Line Scout', sub:'Special Techniques & Hematopoiesis', icon:'🔴', lessons:[
        'Hematology tests and procedures: special','Hematopoiesis (in general)'] },
      { title:'Cell Line Specialist', sub:'RBCs & WBCs', icon:'⚪', lessons:[
        'Erythropoiesis and RBCs','Leukopoiesis and WBCs'] },
      { title:'Clot Watcher', sub:'Platelets & Hemostasis', icon:'🩹', lessons:[
        'Thrombopoiesis and platelets','Hemostasis — theories/concepts, mechanisms'] },
      { title:'Coagulation Analyst', sub:'Coagulation Testing', icon:'⏱️', lessons:[
        'Coagulation procedures/tests','Coagulation factors, diseases/disorders & reference values'] },
      { title:'Hematology Master', sub:'Quality Assurance · Capstone', icon:'🏆', lessons:[
        'Quality assurance'] },
    ]},
  { id:'isbb', name:'Immunology, Serology & Blood Banking', icon:'🛡️', color:'var(--isbb)',
    levels:[
      { title:'Immunology Rookie', sub:'Innate Immunity', icon:'🛡️', lessons:[
        'Historical background','Natural (innate) immunity, including role of macrophages, monocytes and granulocytes'] },
      { title:'Adaptive Defender', sub:'Acquired Immunity', icon:'⚔️', lessons:[
        'Acquired immunity — humoral responses, immunogens, immunoglobulins, B cells',
        'Acquired immunity — cellular responses, T cells, cytokines and chemokines'] },
      { title:'System Architect', sub:'Complement & Transplant Immunology', icon:'🧩', lessons:[
        'Complement system','MHC, HLA and transplantation'] },
      { title:'Serology Analyst I', sub:'Bacterial & Viral Serology', icon:'🧫', lessons:[
        'Immunologic tests: bacterial infections and STD','Immunologic tests: viral infections, including Hepatitis and HIV'] },
      { title:'Serology Analyst II', sub:'Fungal, Parasitic & Autoimmune Serology', icon:'🔬', lessons:[
        'Immunologic tests: fungal infections','Immunologic tests: parasitic infections, including malaria','Immunologic tests: autoimmune disorders'] },
      { title:'Immunology Specialist', sub:'Tumor Markers & Hypersensitivity', icon:'🎗️', lessons:[
        'Tumor immunology (tumor markers, oncoproteins)','Hypersensitivity','Instrumentation and quality management'] },
      { title:'Blood Typer', sub:'ABO/Rh & Genetics', icon:'🧬', lessons:[
        'ABO and Rh blood group systems','Basic genetics'] },
      { title:'Antigen Hunter', sub:'Blood Group Systems', icon:'🎯', lessons:[
        'Other major blood group systems: Kell, Duffy, Kidd, Lewis, MNSs, Lutheran, P, I',
        'Minor blood group systems: Diego, Cartwright, Chido, XG, Scianna, Gerbich, Milton, Knops, Bg, Indian, etc.'] },
      { title:'Blood Bank Technician', sub:'Donor to Component', icon:'🏦', lessons:[
        'Blood donor selection and processing','Blood preservation and banking','Component preparation'] },
      { title:'Transfusion Specialist', sub:'Transfusion Practice', icon:'💉', lessons:[
        'Transfusion therapy','Transfusion reactions','Transfusion-transmitted diseases'] },
      { title:'Blood Bank Master', sub:'Capstone', icon:'🏆', lessons:[
        'BB techniques and procedures: typing, compatibility testing, antibody detection and identification',
        'Hemolytic Disease of the Newborn (HDN) and Auto-immune Hemolytic Anemia',
        'Quality management (structure, set-up/equipment, Laboratory Information System/LIS)'] },
    ]},
  { id:'hlaw', name:'Histotechniques & MedTech Laws', icon:'⚖️', color:'var(--hlaw)',
    levels:[
      { title:'Histo Rookie', sub:'Disease Foundations', icon:'🔎', lessons:[
        'Terminologies (Histology and Pathology)','Etiology of disease','Signs, symptoms and course of disease','Cellular and tissue changes'] },
      { title:'Tissue Processor', sub:'Basic Processing', icon:'🧫', lessons:[
        'Preservation and handling of specimen (Histopathology)','Tissue processing: routine — manual','Tissue processing: routine — automation'] },
      { title:'Staining Specialist', sub:'Advanced Techniques', icon:'🎨', lessons:[
        'Tissue processing: special — frozen section, microwave','Staining: routine','Staining: special (Immunohistochemistry)'] },
      { title:'Cytology Expert', sub:'Cytological Techniques', icon:'🔬', lessons:[
        'Preservation and handling of specimen (Cytology)','Processing: manual','Processing: automation','Staining (Cytology)'] },
      { title:'Forensic Investigator', sub:'Autopsy & Quality', icon:'🕵️', lessons:[
        'Autopsy: terminologies','Autopsy: handling, processing and documentation','Quality assurance'] },
      { title:'Legal Eagle', sub:'MedTech Law & Ethics · Capstone', icon:'⚖️', lessons:[
        'MT laws','Laboratory management','Related laws','Code of ethics including bioethics'] },
    ]},
];

/* Normalize: derive ids, level numbers, and lesson ids so the
   data above only ever has to be written once, as plain text. */
function normalize(subjects){
  subjects.forEach(s=>{
    s.tag = s.id.toUpperCase();
    s.levels.forEach((lvl, li)=>{
      lvl.id = s.id + '-L' + (li+1);
      lvl.num = li+1;
      lvl.lessons = lvl.lessons.map((name, ni)=>({ id: lvl.id + '-' + (ni+1), name }));
    });
  });
  return subjects;
}
const SUBJECTS = normalize(RAW_SUBJECTS);

function getSubject(id){ return SUBJECTS.find(s=>s.id===id); }
function getLevel(subject, id){ return subject.levels.find(l=>l.id===id); }
