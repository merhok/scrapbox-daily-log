const days = ["日", "月", "火", "水", "木", "金", "土"];

function displayToday() {
  const now = new Date();
  const str = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}（${days[now.getDay()]}）`;
  document.getElementById("today-date").textContent = "📅 " + str;
}

function calculateSleepDuration() {
  const start = document.getElementById("sleep-start").value;
  const end   = document.getElementById("sleep-end").value;
  const disp  = document.getElementById("sleep-duration");
  if (!start || !end) {
    disp.textContent = "睡眠時間：";
    return;
  }
  const [sH, sM] = start.split(":").map(Number);
  const [eH, eM] = end.split(":").map(Number);
  let mins = (eH*60+eM) - (sH*60+sM);
  if (mins <= 0) mins += 1440;
  disp.textContent = `睡眠時間：${Math.floor(mins/60)}時間${mins%60>0?mins%60+"分":""}`;
}

function showSaved() {
  const msg = document.getElementById("status-message");
  msg.textContent = "保存しました";
  clearTimeout(window._saveTimer);
  window._saveTimer = setTimeout(()=>msg.textContent="",1500);
}

// 行動・嗜好品ログの入出力
function addEntry(containerId, className, content="", time="", saveFunc) {
  const c = document.getElementById(containerId);
  const div = document.createElement("div");
  div.className = className;
  const text = document.createElement("input");
  text.type = "text"; text.placeholder = "内容"; text.value = content;
  div.appendChild(text);
  if (className!=="substance-entry") {
    const clock = document.createElement("input");
    clock.type="time"; clock.value=time;
    clock.addEventListener("change", saveFunc);
    div.appendChild(clock);
  }
  text.addEventListener("input", saveFunc);
  c.appendChild(div);
}
function saveEntries(className, storageKey) {
  const arr = Array.from(document.querySelectorAll("."+className)).map(e=>{
    const [c,t] = e.querySelectorAll("input");
    return { content:c.value, time: t? t.value: undefined };
  }).filter(e=>e.content.trim());
  localStorage.setItem(storageKey, JSON.stringify(arr));
  showSaved();
}
function restoreEntries(containerId, className, storageKey) {
  const data = JSON.parse(localStorage.getItem(storageKey) || "[]");
  if (!data.length) addEntry(containerId, className, "", "", ()=>saveEntries(className,storageKey));
  data.forEach(e=>addEntry(containerId, className, e.content, e.time, ()=>saveEntries(className,storageKey)));
}

// テキストエリアのバインド
function bindTextarea(id,key) {
  const el = document.getElementById(id);
  el.value = localStorage.getItem(key) || "";
  el.addEventListener("input", ()=>{
    localStorage.setItem(key, el.value);
    showSaved();
  });
}

// 症状チェック
function saveSymptoms() {
  const arr = Array.from(document.querySelectorAll(".symptom:checked")).map(cb=>cb.value);
  localStorage.setItem("log_symptoms", JSON.stringify(arr));
  showSaved();
}
function restoreSymptoms() {
  const data = JSON.parse(localStorage.getItem("log_symptoms")||"[]");
  document.querySelectorAll(".symptom").forEach(cb=>cb.checked=data.includes(cb.value));
}

// 睡眠時間保存・復元
function saveSleepTimes() {
  localStorage.setItem("log_sleep_start", document.getElementById("sleep-start").value);
  localStorage.setItem("log_sleep_end",   document.getElementById("sleep-end").value);
  showSaved();
}
function restoreSleepTimes() {
  document.getElementById("sleep-start").value = localStorage.getItem("log_sleep_start") || "";
  document.getElementById("sleep-end").value   = localStorage.getItem("log_sleep_end") || "";
  calculateSleepDuration();
}

// 全リセット
function resetAll() {
  if (!confirm("一時保存されたデータをすべて削除します。よろしいですか？")) return;
  ["log_sleep_start","log_sleep_end","log_activity","log_substance","log_symptoms","log_health","log_overall","log_review"]
    .forEach(k=>localStorage.removeItem(k));
  location.reload();
}

// Markdown 出力
function generateScrapboxOutput() {
  const output = [];
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,"0")}-${String(now.getDate()).padStart(2,"0")}（${days[now.getDay()]}）`;
  output.push(`[${dateStr}]`, "");

  // 睡眠
  const s = localStorage.getItem("log_sleep_start"), e = localStorage.getItem("log_sleep_end");
  if (s||e) {
    output.push("■ 睡眠");
    if (s) output.push(`- 就寝：${s}`);
    if (e) output.push(`- 起床：${e}`);
    if (s&&e) {
      const [sH,sM] = s.split(":").map(Number);
      const [eH,eM] = e.split(":").map(Number);
      let mins=(eH*60+eM)-(sH*60+sM); if(mins<=0)mins+=1440;
      output.push(`- 睡眠時間：${Math.floor(mins/60)}時間${mins%60>0?mins%60+"分":""}`);
    }
    output.push("");
  }
  // 行動メモ
  const act = JSON.parse(localStorage.getItem("log_activity")||"[]");
  if (act.length) {
    output.push("■ 行動メモ");
    act.forEach(e=>output.push(`- ${e.time?e.time+" ":""}${e.content}`));
    output.push("");
  }
  // 嗜好品
  const sub = JSON.parse(localStorage.getItem("log_substance")||"[]");
  if(sub.length){
    output.push("■ 嗜好品");
    sub.forEach(e=>output.push(`- ${e.content}`));
    output.push("");
  }
  // 症状チェック
  const sym = JSON.parse(localStorage.getItem("log_symptoms")||"[]");
  if(sym.length){
    output.push("■ 症状チェック");
    sym.forEach(s=>output.push(`- ${s}`));
    output.push("");
  }
  // 補足メモ
  [["log_health","体調の補足"],["log_overall","今日の総評"],["log_review","ふりかえり・所感"]]
    .forEach(([key,title])=>{
      const v=localStorage.getItem(key);
      if(v?.trim()) output.push(`■ ${title}`, v.trim(), "");
    });

  // Markdown 改行用スペース２つを行末に付与
  const md = output.map(line=>line+"  ").join("\n");
  document.getElementById("output-text").textContent = md;
}

// 初期化
document.addEventListener("DOMContentLoaded", ()=>{
  displayToday();
  restoreSleepTimes();
  restoreEntries("activity-log","activity-entry","log_activity");
  restoreEntries("substance-log","substance-entry","log_substance");
  restoreSymptoms();
  bindTextarea("note-health","log_health");
  bindTextarea("note-overall","log_overall");
  bindTextarea("note-review","log_review");

  // イベントバインド
  document.getElementById("sleep-start").addEventListener("change",()=>{saveSleepTimes();calculateSleepDuration();});
  document.getElementById("sleep-end").addEventListener("change",()=>{saveSleepTimes();calculateSleepDuration();});
  document.getElementById("add-activity").addEventListener("click",()=>addEntry("activity-log","activity-entry","","",()=>saveEntries("activity-entry","log_activity")));
  document.getElementById("add-substance").addEventListener("click",()=>addEntry("substance-log","substance-entry","","",()=>saveEntries("substance-entry","log_substance")));
  document.querySelectorAll(".symptom").forEach(cb=>cb.addEventListener("change",saveSymptoms));
  document.getElementById("generate-output").addEventListener("click",generateScrapboxOutput);
  document.getElementById("reset-storage").addEventListener("click",resetAll);

  // ファイル名＋Token 保存＆復元
  const tokenInput = document.getElementById("token");
  const saved = localStorage.getItem("github_token");
  if(tokenInput&&saved) tokenInput.value=saved;
  if(tokenInput) tokenInput.addEventListener("input",()=>localStorage.setItem("github_token",tokenInput.value));

  // デフォルトファイル名設定
  const f = document.getElementById("filename");
  if(f){
    const now=new Date();
    const y=now.getFullYear(), m=String(now.getMonth()+1).padStart(2,"0"), d=String(now.getDate()).padStart(2,"0");
    f.value=`${y}-${m}-${d}.md`;
  }

  // ダウンロードボタン
  document.getElementById("download-md").addEventListener("click", ()=>{
    const markdown = document.getElementById("output-text").textContent||"";
    if(!markdown.trim()){ alert("まずは「Scrapbox用に出力」でMarkdownを生成してください");return; }
    const fn = document.getElementById("filename").value.trim()||"daily-log.md";
    const blob= new Blob([markdown], {type:"text/markdown;charset=utf-8"});
    const url= URL.createObjectURL(blob);
    const a=document.createElement("a");
    a.href=url; a.download=fn;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });
});
