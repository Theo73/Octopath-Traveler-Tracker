/* Zone et coffres */
const defaultZones = {};

/* Bosses */
const characters = [
  "Olberic","Cyrus","Tressa","Ophilia",
  "Primrose","Alfyn","Therion","H'aanit","Extra"
];
const bossData = {};
const STORAGE_KEY_COFFRES = "octopath_coffres_v4";
const STORAGE_KEY_BOSS = "octopath_boss_v4";

/* Elements de la page */
const regionSelect = document.getElementById("regionSelect");
const zoneSelect = document.getElementById("zoneSelect");
const coffresContainer = document.getElementById("coffresContainer");
const btnResetZone = document.getElementById("btnResetZone");
const btnResetAll = document.getElementById("btnResetAll");
const csvInput = document.getElementById("csvInput");
const btnImportCsv = document.getElementById("btnImportCsv");
const btnExportSave = document.getElementById("btnExportSave");
const btnImportSave = document.getElementById("btnImportSave");
const importSaveFile = document.getElementById("importSaveFile");
const bossContainer = document.getElementById("bossContainer");

/* Load  */
let zoneData = JSON.parse(localStorage.getItem(STORAGE_KEY_COFFRES)) || defaultZones;
let savedBossData = JSON.parse(localStorage.getItem(STORAGE_KEY_BOSS)) || {};
characters.forEach((char) => {
  const count = char === "Extra" ? 5 : 4;
  bossData[char] = savedBossData[char] || Array(count).fill(false);
});

/* Save des données en local */
function saveCoffres(){
  localStorage.setItem(STORAGE_KEY_COFFRES,JSON.stringify(zoneData));
}

function saveBosses(){
  localStorage.setItem(STORAGE_KEY_BOSS,JSON.stringify(bossData));
}

/* Gestion des selects */
function populateRegions(){
  regionSelect.innerHTML='<option value="">-- Select a region --</option>';
  Object.keys(zoneData).forEach(r => {
    const opt=document.createElement("option");
    opt.value=r; opt.textContent=r;
    regionSelect.appendChild(opt);
  });
}

function populateZones(){
  const region=regionSelect.value;
  zoneSelect.innerHTML='<option value="">-- Select a zone --</option>';
  if(region && zoneData[region]){
    Object.keys(zoneData[region]).forEach( z => {
      const opt = document.createElement("option");
      opt.value = z; 
      opt.textContent = z;
      zoneSelect.appendChild(opt);
    });
  }
}

/* Coffres */
function renderCoffres(){
  coffresContainer.innerHTML = "";
  const region = regionSelect.value;
  const zone = zoneSelect.value;
  if(!region || !zone || !zoneData[region][zone]){
    coffresContainer.innerHTML = "<li>Sélectionne une zone</li>"; 
    return;
  }
  zoneData[region][zone].forEach(item => {
    const li = document.createElement("li");
    const cb = document.createElement("input"); 
    cb.type = "checkbox"; 
    cb.checked = item.done;
    cb.addEventListener("change",()=>{
      item.done = cb.checked; 
      saveCoffres();
    });
    const label = document.createElement("label"); 
    label.textContent = item.name;
    li.appendChild(cb); 
    li.appendChild(label);
    coffresContainer.appendChild(li);
  });
}
regionSelect.addEventListener("change", () =>{
  populateZones(); renderCoffres();
});
zoneSelect.addEventListener("change", renderCoffres);

/* Boss Tracker */
function renderBosses(){
  bossContainer.innerHTML="";
  characters.forEach(char=>{
    const card = document.createElement("div"); 
    card.className = "boss-card";
    const title = document.createElement("div"); 
    title.className = "boss-name"; 
    title.textContent = char;
    const iconsWrapper = document.createElement("div"); 
    iconsWrapper.className = "boss-icons";
    const count=char==="Extra"?5:4;
    for(let i=0;i<count;i++){
      const img=document.createElement("img");
      img.src=`./assets/boss_${char.toLowerCase()}_${i+1}.png`;
      img.className="boss-icon";
      if(bossData[char][i]) img.classList.add("active");
      img.addEventListener("click",()=>{
        bossData[char][i]=!bossData[char][i];
        img.classList.toggle("active");
        saveBosses();
      });
      iconsWrapper.appendChild(img);
    }
    card.appendChild(title); card.appendChild(iconsWrapper); bossContainer.appendChild(card);
  });
}
renderBosses();

/*Imporation du CSV */
btnImportCsv.addEventListener("click",()=>csvInput.click());
csvInput.addEventListener("change",(ev)=>{
  const file=ev.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    const text=reader.result;
    const parsed=parseCsv(text);
    parsed.forEach(row=>{
      const region=(row[0]||'').trim();
      const zone=(row[1]||'').trim();
      const name=(row[2]||'').trim()||"Coffre";
      if(!zoneData[region]) zoneData[region]={};
      if(!zoneData[region][zone]) zoneData[region][zone]=[];
      zoneData[region][zone].push({name,done:false});
    });
    saveCoffres(); populateRegions(); populateZones(); alert("CSV importé !");
  };
  reader.readAsText(file);
  csvInput.value="";
});

// parse CSV
function parseCsv(csvText){
  const sep="|";
  return csvText.split(/\r?\n/).filter(l=>l.trim()!=='')
      .map(l=>l.split(sep).map(c=>c.trim()));
}

/* Reset */
btnResetZone.addEventListener("click",()=>{
  const region=regionSelect.value; const zone=zoneSelect.value;
  if(!region||!zone) return alert("Sélectionne une zone !");
  if(confirm(`Réinitialiser ${zone} ?`)){
    zoneData[region][zone].forEach(c=>c.done=false);
    saveCoffres(); renderCoffres();
  }
});
btnResetAll.addEventListener("click",()=>{
  if(!confirm("Tout réinitialiser ?")) return;
  localStorage.removeItem(STORAGE_KEY_COFFRES);
  localStorage.removeItem(STORAGE_KEY_BOSS);
  zoneData=JSON.parse(JSON.stringify(defaultZones));
  characters.forEach(c=>bossData[c]=Array(c==="Extra"?5:4).fill(false));
  saveCoffres(); saveBosses(); populateRegions(); populateZones(); renderCoffres(); renderBosses();
});

/*  Export / Import JSON pour les saves */
btnExportSave.addEventListener("click",()=>{
  const saveData={coffres:zoneData,bosses:bossData};
  const blob=new Blob([JSON.stringify(saveData,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a"); a.href=url; a.download="octopath_tracker_save.json"; a.click();
  URL.revokeObjectURL(url);
});

btnImportSave.addEventListener("click",()=>importSaveFile.click());
importSaveFile.addEventListener("change",(ev)=>{
  const file=ev.target.files[0]; if(!file) return;
  const reader=new FileReader();
  reader.onload=()=>{
    try{
      const imported=JSON.parse(reader.result);
      if(imported.coffres) zoneData=imported.coffres;
      if(imported.bosses) characters.forEach(c=>{
        if(imported.bosses[c]) bossData[c]=imported.bosses[c];
      });
      saveCoffres(); saveBosses(); populateRegions(); populateZones(); renderCoffres(); renderBosses();
      alert("Progression importée avec succès !");
    }catch(e){alert("Fichier invalide !"); console.error(e);}
  };
  reader.readAsText(file); importSaveFile.value="";
});

populateRegions(); populateZones(); renderCoffres(); renderBosses();
