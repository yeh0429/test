import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, onAuthStateChanged, signOut as firebaseSignOut } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";

// Firebase Web App config for daily-planner-da7e4.
const firebaseConfig = {
  apiKey: "AIzaSyAlKrJPlK-e5vEAWPhdLPfWMDSoYJpir18",
  authDomain: "daily-planner-da7e4.firebaseapp.com",
  projectId: "daily-planner-da7e4",
  storageBucket: "daily-planner-da7e4.firebasestorage.app",
  messagingSenderId: "586658175283",
  appId: "1:586658175283:web:131f6588e8b5ab5a900646"
};
const firebaseConfigured = !Object.values(firebaseConfig).some(v => String(v).startsWith("YOUR_"));
const authGate = document.getElementById("authGate");
const authMessage = document.getElementById("authMessage");
const authError = document.getElementById("authError");
const googleSignIn = document.getElementById("googleSignIn");
const appRoot = document.querySelector(".app");
appRoot.hidden = true;
function showSignedOut(message = "登入後即可查看你的行程與任務。") {
  appRoot.hidden = true;
  authGate.hidden = false;
  authMessage.textContent = message;
  googleSignIn.hidden = !firebaseConfigured;
  if (!firebaseConfigured) authError.textContent = "尚未設定 Firebase 網頁應用程式。請填入本頁 firebaseConfig 後再部署。";
}
let firebaseAuth = null;
if (firebaseConfigured) {
  const firebaseApp = initializeApp(firebaseConfig);
  firebaseAuth = getAuth(firebaseApp);
  const googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({ prompt: "select_account" });
  getRedirectResult(firebaseAuth).catch(error => {
    authMessage.textContent = "登入狀態確認失敗，請重新登入。";
    authError.textContent = error.code === "auth/unauthorized-domain"
      ? "此網站網域尚未加入 Firebase Authentication 授權網域。"
      : `Google 登入未完成（${error.code || "未知錯誤"}）。請重新登入。`;
    googleSignIn.hidden = false;
    googleSignIn.disabled = false;
  });
  googleSignIn.addEventListener("click", async () => {
    googleSignIn.disabled = true;
    authError.textContent = "";
    authMessage.textContent = "正在前往 Google 登入…";
    try {
      await signInWithRedirect(firebaseAuth, googleProvider);
    } catch (error) {
      authMessage.textContent = "登入尚未完成，請再試一次。";
      authError.textContent = error.code === "auth/unauthorized-domain"
        ? "此網站網域尚未加入 Firebase Authentication 授權網域。"
        : `Google 登入失敗（${error.code || "未知錯誤"}）。請再試一次。`;
      googleSignIn.disabled = false;
    }
  });
  onAuthStateChanged(firebaseAuth, user => {
    googleSignIn.disabled = false;
    authGate.hidden = true;
    appRoot.hidden = !user;
    if (user) {
      document.getElementById("authUser").hidden = false;
      document.getElementById("authName").textContent = user.displayName || user.email || "已登入";
      const avatar = document.getElementById("authAvatar");
      if (user.photoURL) { avatar.src = user.photoURL; avatar.hidden = false; }
      else avatar.hidden = true;
      loadPlannerItems(user);
    } else {
      loadPlannerItems(null);
      showSignedOut();
    }
  }, error => {
    authGate.hidden = false;
    appRoot.hidden = true;
    authMessage.textContent = "無法讀取登入狀態，請重新登入。";
    authError.textContent = `Firebase 驗證錯誤（${error.code || "未知錯誤"}）。`;
    googleSignIn.hidden = false;
    googleSignIn.disabled = false;
  });
  document.getElementById("signOut").addEventListener("click", () => firebaseSignOut(firebaseAuth));
} else {
  showSignedOut("首次使用前，需先設定 Firebase 網頁應用程式。");
}
const today=new Date();let selected=new Date(today),month=new Date(today.getFullYear(),today.getMonth(),1);let items=[{id:1,title:'晨間伸展與咖啡',date:'2026-10-30',start:'08:00',duration:30,type:'event',category:'個人',priority:'',tag:'晨間儀式',done:false},{id:2,title:'回覆客戶提案信件',date:'2026-10-30',start:'09:00',duration:45,type:'task',category:'工作',priority:'high',tag:'客戶專案',done:false},{id:3,title:'設計提案討論',date:'2026-10-30',start:'10:30',duration:60,type:'event',category:'工作',priority:'',tag:'品牌改版',done:false},{id:4,title:'午餐與休息',date:'2026-10-30',start:'12:00',duration:60,type:'event',category:'個人',priority:'',tag:'',done:false},{id:5,title:'完成首頁線框稿',date:'2026-10-30',start:'13:30',duration:90,type:'task',category:'工作',priority:'high',tag:'產品設計',done:false},{id:6,title:'整理本週採買清單',date:'2026-10-30',start:'16:00',duration:30,type:'task',category:'家庭',priority:'medium',tag:'生活',done:false},{id:7,title:'團隊週會',date:'2026-10-31',start:'09:30',duration:60,type:'event',category:'工作',priority:'',tag:'例行會議',done:false},{id:8,title:'提交研究摘要',date:'2026-10-31',start:'11:00',duration:60,type:'task',category:'工作',priority:'high',tag:'研究',done:false},{id:9,title:'繳交水電費',date:'2026-11-01',start:'10:00',duration:20,type:'task',category:'家庭',priority:'medium',tag:'每月例行',done:true},{id:10,title:'和媽媽吃晚餐',date:'2026-11-02',start:'18:30',duration:90,type:'event',category:'家庭',priority:'',tag:'',done:false},{id:11,title:'採買週末食材',date:'2026-11-02',start:'15:00',duration:45,type:'task',category:'家庭',priority:'low',tag:'採買',done:false},{id:12,title:'瑜伽課',date:'2026-11-03',start:'19:00',duration:60,type:'event',category:'個人',priority:'',tag:'健康',done:false},{id:13,title:'回顧季度目標',date:'2026-11-04',start:'14:00',duration:60,type:'task',category:'個人',priority:'medium',tag:'目標',done:false},{id:14,title:'產品設計同步',date:'2026-11-05',start:'10:00',duration:45,type:'event',category:'工作',priority:'',tag:'跨部門',done:false},{id:15,title:'更新作品集',date:'2026-11-06',start:'16:00',duration:60,type:'task',category:'個人',priority:'low',tag:'成長',done:false}];const fmt = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
const same = (a,b) => fmt(a) === fmt(b);
const esc = value => String(value).replace(/[&<>"']/g, char => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[char]));
const plus = (time, minutes) => {
  let [hours, remainder] = time.split(":").map(Number);
  remainder += minutes;
  hours += Math.floor(remainder / 60);
  return `${String(hours % 24).padStart(2,"0")}:${String(remainder % 60).padStart(2,"0")}`;
};
const sampleAnchor = new Date(2026, 9, 30);
items = items.map(item => {
  const sampleDate = new Date(`${item.date}T00:00:00`);
  const dayOffset = Math.round((sampleDate - sampleAnchor) / 86400000);
  const shiftedDate = new Date(today);
  shiftedDate.setDate(today.getDate() + dayOffset);
  return {...item, date: fmt(shiftedDate)};
});
const sampleItems = items.map(item => ({...item}));
const STORAGE_PREFIX = "daily-planner.items.v1";
let activeStorageKey = `${STORAGE_PREFIX}.guest`;
let editingItemId = null;

function savePlannerItems() {
  try {
    localStorage.setItem(activeStorageKey, JSON.stringify(items));
    return true;
  } catch {
    say("瀏覽器儲存空間無法使用，變更可能不會保留。");
    return false;
  }
}

function loadPlannerItems(user) {
  activeStorageKey = `${STORAGE_PREFIX}.${user?.uid || "guest"}`;
  try {
    const saved = JSON.parse(localStorage.getItem(activeStorageKey) || "null");
    items = Array.isArray(saved)
      ? saved.filter(item => item && (typeof item.id === "string" || Number.isSafeInteger(item.id))
        && typeof item.title === "string" && typeof item.date === "string"
        && typeof item.type === "string" && typeof item.done === "boolean")
      : sampleItems.map(item => ({...item}));
  } catch {
    items = sampleItems.map(item => ({...item}));
  }
  drawAgenda();
  drawMini();
  drawCalendar();
  drawAll();
}

const formattedToday = new Intl.DateTimeFormat("zh-TW", {year:"numeric",month:"long",day:"numeric",weekday:"long"}).format(today);
document.getElementById("headerDate").textContent = formattedToday;
document.querySelector("#today .title .green").textContent = formattedToday;

function say(s){let t=document.getElementById('toast');t.textContent=s;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}function showView(v){document.querySelectorAll('.view').forEach(x=>x.classList.remove('active'));document.getElementById(v==='tasksView'?'tasksView':v).classList.add('active');document.querySelectorAll('[data-v]').forEach(b=>b.classList.toggle('active',b.dataset.v===v));document.getElementById('crumb').textContent=({today:'今日總覽',calendar:'行事曆',tasksView:'所有任務',settings:'設定與提醒'})[v];document.getElementById('side').classList.remove('open');if(v==='calendar')drawCalendar();if(v==='tasksView')drawAll()}document.querySelectorAll('[data-v]').forEach(b=>b.onclick=()=>showView(b.dataset.v));function drawAgenda() {
  document.getElementById("daylabel").textContent = `${same(selected,today) ? "今天，" : ""}${selected.getMonth()+1}/${selected.getDate()}`;
  const dayItems = items.filter(item => item.date === fmt(selected)).sort((a,b) => a.start.localeCompare(b.start));
  const agenda = document.getElementById("agenda");
  agenda.innerHTML = dayItems.length ? dayItems.map(item => {
    const tone = item.category === "個人" ? "purple" : item.category === "家庭" ? "gold" : item.type === "task" ? "blue" : "";
    const checkbox = item.type === "task"
      ? `<input type="checkbox" data-check="${esc(item.id)}" ${item.done ? "checked" : ""}> `
      : "";
    const actions = item.type === "event"
      ? `<div class="event-actions"><button type="button" data-edit="${esc(item.id)}">編輯</button><button type="button" data-delete="${esc(item.id)}">刪除</button></div>`
      : "";
    return `<div class="item"><div class="time">${esc(item.start)}</div><div class="event ${tone}">${checkbox}${esc(item.title)}<small>${esc(item.category)} · ${esc(item.start)}–${plus(item.start,item.duration)}${item.tag ? ` · #${esc(item.tag)}` : ""}</small>${actions}</div></div>`;
  }).join("") : '<p class="muted">這天沒有安排，享受留白時光吧 ☁</p>';
  agenda.querySelectorAll("[data-check]").forEach(control => control.onchange = () => toggle(control.dataset.check));
  agenda.querySelectorAll("[data-edit]").forEach(button => button.onclick = () => {
    const item = items.find(entry => String(entry.id) === button.dataset.edit);
    if (item) openModal(item.type, item.id);
  });
  agenda.querySelectorAll("[data-delete]").forEach(button => button.onclick = () => {
    const item = items.find(entry => String(entry.id) === button.dataset.delete);
    if (!item || !window.confirm(`要刪除「${item.title}」嗎？`)) return;
    items = items.filter(entry => String(entry.id) !== button.dataset.delete);
    savePlannerItems();
    drawAgenda();
    drawMini();
    drawCalendar();
    drawAll();
    say("行程已刪除");
  });
  drawTasks();
  drawStats();
}
function taskHTML(x){return '<div class="taskrow"><input type="checkbox" data-check="'+x.id+'" '+(x.done?'checked':'')+'><div>'+esc(x.title)+' '+(x.priority?'<span class="priority">'+({high:'高優先',medium:'中優先',low:'低優先'})[x.priority]+'</span>':'')+'<span class="tag">'+esc(x.category)+'</span>'+(x.tag?'<span class="tag">#'+esc(x.tag)+'</span>':'')+'<div class="muted" style="margin-top:5px">截止 '+x.date+' · '+x.start+' · '+x.duration+' 分鐘</div></div></div>'}function drawTasks(){let a=items.filter(x=>x.type==='task'&&x.date===fmt(selected)).sort((x,y)=>(x.done?1:0)-(y.done?1:0)||x.start.localeCompare(y.start));document.getElementById('tasks').innerHTML=a.length?a.map(taskHTML).join(''):'<div class="taskrow muted">今天沒有排定任務。</div>';document.querySelectorAll('[data-check]').forEach(c=>c.onchange=()=>toggle(+c.dataset.check))}function drawAll(){let a=items.filter(x=>x.type==='task'),f=document.getElementById('filter').value;if(f==='open')a=a.filter(x=>!x.done);if(f==='done')a=a.filter(x=>x.done);document.getElementById('allTasks').innerHTML=a.map(taskHTML).join('')||'<p class="taskrow muted">沒有任務</p>';document.querySelectorAll('[data-check]').forEach(c=>c.onchange=()=>toggle(+c.dataset.check))}function drawStats(){let a=items.filter(x=>x.date===fmt(today)&&x.type==='task'),open=a.filter(x=>!x.done);document.getElementById('sEvents').textContent=items.filter(x=>x.date===fmt(today)&&x.type==='event').length;document.getElementById('sTasks').textContent=open.length;document.getElementById('sHigh').textContent=open.filter(x=>x.priority==='high').length+' 項高優先';document.getElementById('sProgress').textContent=(a.length?Math.round((a.length-open.length)/a.length*100):0)+'%';document.getElementById('navCount').textContent=items.filter(x=>x.date===fmt(today)&&x.type==='task'&&!x.done).length;let all=items.filter(x=>x.type==='task'),done=all.filter(x=>x.done).length;document.getElementById('weekProgress').textContent=done+' / '+all.length;document.getElementById('bar').style.width=(all.length?done/all.length*100:0)+'%'}function toggle(id) {
  const item = items.find(entry => String(entry.id) === String(id));
  if (!item) return;
  item.done = !item.done;
  savePlannerItems();
  drawAgenda();
  drawAll();
  drawMini();
  drawCalendar();
  say(item.done ? "任務已完成，做得好！" : "已標記為未完成");
}
function drawMini(){let r=document.getElementById('mini'),y=month.getFullYear(),m=month.getMonth(),off=(new Date(y,m,1).getDay()+6)%7,nd=new Date(y,m+1,0).getDate(),pd=new Date(y,m,0).getDate();document.getElementById('monthTitle').textContent=y+' 年 '+(m+1)+' 月';let h=['一','二','三','四','五','六','日'].map(n=>'<div class="dow">'+n+'</div>').join('');for(let i=0;i<42;i++){let n=i-off+1,d,mut=false;if(n<1){d=new Date(y,m-1,pd+n);mut=true}else if(n>nd){d=new Date(y,m+1,n-nd);mut=true}else d=new Date(y,m,n);h+='<div style="'+(mut?'opacity:.4':'')+'" data-date="'+fmt(d)+'"><span class="'+(same(d,today)?'today':'')+'">'+d.getDate()+'</span>'+(items.some(x=>x.date===fmt(d))?'<span class="ev">· 有安排</span>':'')+'</div>'}r.innerHTML=h;r.querySelectorAll('[data-date]').forEach(c=>c.onclick=()=>{selected=new Date(c.dataset.date+'T12:00:00');drawAgenda();drawWeek()});let s=new Date(selected);s.setDate(s.getDate()-((s.getDay()+6)%7));let w=document.getElementById('week'),names=['一','二','三','四','五','六','日'];w.innerHTML=names.map((n,i)=>{let d=new Date(s);d.setDate(d.getDate()+i);return '<button class="'+(same(d,selected)?'sel':'')+'" data-date="'+fmt(d)+'">'+n+'<b>'+d.getDate()+'</b>'+items.filter(x=>x.date===fmt(d)).length+' 項</button>'}).join('');w.querySelectorAll('[data-date]').forEach(c=>c.onclick=()=>{selected=new Date(c.dataset.date+'T12:00:00');drawAgenda();drawMini()})}function drawWeek(){drawMini()}function drawCalendar(){let r=document.getElementById('fullCal'),y=month.getFullYear(),m=month.getMonth(),off=(new Date(y,m,1).getDay()+6)%7,nd=new Date(y,m+1,0).getDate(),h=['一','二','三','四','五','六','日'].map(n=>'<div class="dow">星期'+n+'</div>').join('');document.getElementById('fullTitle').textContent=y+' 年 '+(m+1)+' 月';for(let i=0;i<42;i++){let n=i-off+1,d=new Date(y,m,n),a=items.filter(x=>x.date===fmt(d));h+='<div data-date="'+fmt(d)+'"><span class="'+(same(d,today)?'today':'')+'">'+d.getDate()+'</span>'+a.slice(0,3).map(x=>'<span class="ev">'+x.start+' '+esc(x.title)+'</span>').join('')+'</div>'}r.innerHTML=h;r.querySelectorAll('[data-date]').forEach(c=>c.onclick=()=>{selected=new Date(c.dataset.date+'T12:00:00');showView('today');drawAgenda()})}function openModal(type, itemId = null) {
  const form = document.getElementById("form");
  const item = itemId == null ? null : items.find(entry => String(entry.id) === String(itemId));
  editingItemId = item?.id ?? null;
  form.reset();
  document.getElementById("modalbg").classList.add("show");
  document.querySelector('[name="type"]').value = item?.type || type;
  document.querySelector('[name="date"]').value = item?.date || fmt(selected);
  document.querySelector('[name="title"]').value = item?.title || "";
  document.querySelector('[name="category"]').value = item?.category || "工作";
  document.querySelector('[name="priority"]').value = item?.priority || "";
  document.querySelector('[name="start"]').value = item?.start || "";
  document.querySelector('[name="duration"]').value = String(item?.duration || 60);
  document.querySelector('[name="tag"]').value = item?.tag || "";
  document.querySelector('[name="reminder"]').value = item?.reminder || "系統通知";
  document.getElementById("modalTitle").textContent = item ? "編輯項目" : "新增項目";
  document.getElementById("saveItem").textContent = item ? "儲存變更" : "儲存項目";
}
function closeModal() {
  document.getElementById("modalbg").classList.remove("show");
  editingItemId = null;
  document.getElementById("form").reset();
  document.getElementById("modalTitle").textContent = "新增項目";
  document.getElementById("saveItem").textContent = "儲存項目";
}
document.getElementById("add").onclick = () => openModal("task");
document.getElementById("taskAdd").onclick = () => openModal("task");
document.getElementById("calAdd").onclick = () => openModal("event");
document.getElementById("close").onclick = closeModal;
document.getElementById("cancel").onclick = closeModal;
document.getElementById("modalbg").onclick = event => { if (event.target.id === "modalbg") closeModal(); };
document.getElementById("form").onsubmit = event => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const prior = editingItemId == null ? null : items.find(item => String(item.id) === String(editingItemId));
  const item = {
    id: prior?.id ?? Date.now(),
    title: String(formData.get("title")).trim(),
    type: String(formData.get("type")),
    category: String(formData.get("category")),
    date: String(formData.get("date")),
    start: String(formData.get("start") || "09:00"),
    duration: Number(formData.get("duration")),
    priority: String(formData.get("priority") || ""),
    tag: String(formData.get("tag") || "").trim(),
    done: prior?.done || false,
    reminder: String(formData.get("reminder") || ""),
  };
  if (prior) items = items.map(entry => String(entry.id) === String(prior.id) ? item : entry);
  else items.push(item);
  selected = new Date(`${item.date}T12:00:00`);
  month = new Date(selected.getFullYear(), selected.getMonth(), 1);
  savePlannerItems();
  closeModal();
  drawAgenda();
  drawMini();
  drawCalendar();
  drawAll();
  say(prior ? "項目已更新" : "項目已新增至安排");
};
document.getElementById('filter').onchange=drawAll;document.getElementById('prev').onclick=()=>{selected.setDate(selected.getDate()-1);drawAgenda();drawMini()};document.getElementById('next').onclick=()=>{selected.setDate(selected.getDate()+1);drawAgenda();drawMini()};document.getElementById('mPrev').onclick=()=>{month.setMonth(month.getMonth()-1);drawCalendar()};document.getElementById('mNext').onclick=()=>{month.setMonth(month.getMonth()+1);drawCalendar()};document.getElementById('hamb').onclick=()=>document.getElementById('side').classList.toggle('open');document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{document.querySelectorAll('[data-mode]').forEach(x=>x.style.fontWeight=x===b?'bold':'normal');if(b.dataset.mode==='week'){month=new Date(selected.getFullYear(),selected.getMonth(),1)}drawCalendar()});document.getElementById('notif').onclick=()=>say('今天有高優先任務待完成');document.getElementById('tagAdd').onclick=()=>{let t=prompt('自訂標籤名稱');if(t)say('已新增標籤：'+t)};loadPlannerItems(firebaseAuth?.currentUser || null);
drawAgenda();drawMini();drawCalendar();drawAll();
