// // Minimal JS for interactivity: modals, nav, progress, community, simple auth simulation
// document.addEventListener('DOMContentLoaded', ()=>{

//   // Utils
//   const $ = s => document.querySelector(s);
//   const $$ = s => Array.from(document.querySelectorAll(s));
//   const toast = $('#toast');
//   const showToast = (msg, ms=2500) => {
//     toast.textContent = msg;
//     toast.style.display = 'block';
//     setTimeout(()=> toast.style.display = 'none', ms);
//   };

//   // Year
//   document.getElementById('year').textContent = new Date().getFullYear();

//   // Nav toggle (mobile)
//   const navToggle = $('#navToggle');
//   const navLinks = $('#navLinks');
//   navToggle.addEventListener('click', ()=> navLinks.classList.toggle('show'));

//   // Smooth scroll for in-page links
//   document.querySelectorAll('a[href^="#"]').forEach(a=>{
//     a.addEventListener('click', (e)=>{
//       const target = document.querySelector(a.getAttribute('href'));
//       if(target){ e.preventDefault(); target.scrollIntoView({behavior:'smooth', block:'start'}); navLinks.classList.remove('show'); }
//     });
//   });

//   // Modals
//   function openModal(el){ el.setAttribute('aria-hidden','false'); }
//   function closeModal(el){ el.setAttribute('aria-hidden','true'); }
//   $$('[data-close]').forEach(btn=> btn.addEventListener('click', ()=> closeModal(btn.closest('.modal')) ));

//   const trainerModal = $('#trainerModal');
//   const customerModal = $('#customerModal');
//   $('#trainerLoginBtn').addEventListener('click', ()=> openModal(trainerModal));
//   $('#customerLoginBtn').addEventListener('click', ()=> openModal(customerModal));
//   [trainerModal, customerModal].forEach(m=> m.addEventListener('click', (e)=> { if(e.target===m) closeModal(m); }));

//   // Simulated auth
//   function login(type, email, pass){
//     // demo credentials
//     if(type==='trainer' && email==='trainer@fitflow.test' && pass==='trainer123') {
//       localStorage.setItem('fitflow_user', JSON.stringify({role:'trainer',email}));
//       showToast('Trainer logged in');
//       closeModal(trainerModal);
//       return true;
//     }
//     if(type==='customer' && email==='customer@fitflow.test' && pass==='customer123'){
//       localStorage.setItem('fitflow_user', JSON.stringify({role:'customer',email}));
//       showToast('Customer logged in');
//       closeModal(customerModal);
//       return true;
//     }
//     showToast('Invalid credentials');
//     return false;
//   }

//   $('#trainerForm').addEventListener('submit', (e)=>{
//     e.preventDefault();
//     const email = $('#trainerEmail').value.trim();
//     const pass = $('#trainerPassword').value;
//     login('trainer', email, pass);
//   });
//   $('#customerForm').addEventListener('submit', (e)=>{
//     e.preventDefault();
//     const email = $('#customerEmail').value.trim();
//     const pass = $('#customerPassword').value;
//     login('customer', email, pass);
//   });

//   // Plans actions
//   document.body.addEventListener('click', (e)=>{
//     const btn = e.target.closest('button[data-action]');
//     if(!btn) return;
//     const action = btn.dataset.action;
//     const plan = btn.dataset.plan;
//     if(action==='save-plan'){
//       const saved = JSON.parse(localStorage.getItem('fitflow_saved_plans')||'[]');
//       if(!saved.includes(plan)){ saved.push(plan); localStorage.setItem('fitflow_saved_plans', JSON.stringify(saved)); showToast('Plan saved'); }
//       else showToast('Plan already saved');
//     }
//     if(action==='start-plan'){
//       localStorage.setItem('fitflow_active_plan', plan);
//       showToast('Plan started: '+plan);
//     }
//   });

//   // Progress tracking
//   const progressForm = $('#progressForm');
//   const progressList = $('#progressList');
//   function renderProgress(){
//     const items = JSON.parse(localStorage.getItem('fitflow_progress')||'[]');
//     if(items.length===0){ progressList.innerHTML = '<div class="muted">No progress logged yet.</div>'; return; }
//     progressList.innerHTML = items.map(i=>`<div class="progress-item"><strong>${i.weight} kg</strong> — ${i.note} <span class="muted">(${new Date(i.t).toLocaleString()})</span></div>`).join('');
//   }
//   progressForm.addEventListener('submit', (e)=>{
//     e.preventDefault();
//     const w = parseFloat($('#weight').value);
//     const note = $('#note').value || '';
//     if(!w || w<=0){ showToast('Enter a valid weight'); return; }
//     const items = JSON.parse(localStorage.getItem('fitflow_progress')||'[]');
//     items.unshift({weight:w, note, t:Date.now()});
//     localStorage.setItem('fitflow_progress', JSON.stringify(items.slice(0,50)));
//     renderProgress();
//     progressForm.reset();
//     showToast('Progress logged');
//   });
//   renderProgress();

//   // Community feed (local)
//   const feed = $('#feed');
//   const postForm = $('#postForm');
//   function renderFeed(){
//     const posts = JSON.parse(localStorage.getItem('fitflow_feed')||'[]');
//     if(posts.length===0){ feed.innerHTML = '<div class="muted">No posts yet — be the first to share a win!</div>'; return; }
//     feed.innerHTML = posts.map(p=>`<div class="post"><div class="post-meta"><strong>${p.author||'Anon'}</strong> <span class="muted">${new Date(p.t).toLocaleString()}</span></div><div class="post-body">${escapeHtml(p.text)}</div></div>`).join('');
//   }
//   function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
//   postForm.addEventListener('submit', (e)=>{
//     e.preventDefault();
//     const txt = $('#postInput').value.trim();
//     if(!txt) return showToast('Write something to post');
//     const user = JSON.parse(localStorage.getItem('fitflow_user')||'{}');
//     const posts = JSON.parse(localStorage.getItem('fitflow_feed')||'[]');
//     posts.unshift({text:txt, t:Date.now(), author:user.email||null});
//     localStorage.setItem('fitflow_feed', JSON.stringify(posts.slice(0,100)));
//     postForm.reset(); renderFeed(); showToast('Posted to community');
//   });
//   renderFeed();

//   // keyboard escape to close modals
//   document.addEventListener('keydown', (e)=>{ if(e.key==='Escape'){ [trainerModal,customerModal].forEach(m=> closeModal(m)); } });

// });
// ======= FitTrack+ Script =======

// ✅ ======= TOAST SYSTEM =======
function showToast(message, type = "info") {
  let toast = document.getElementById("toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.id = "toast";
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  toast.style.cssText = `
    position:fixed; bottom:20px; left:50%; transform:translateX(-50%);
    background:${type === "error" ? "#e74c3c" : type === "success" ? "#27ae60" : "#333"};
    color:white; padding:10px 20px; border-radius:6px; z-index:9999; transition:opacity .5s;
  `;
  setTimeout(() => { toast.className = "toast"; toast.style.opacity = 0; }, 3000);
}

// ✅ ======= MODAL HANDLING =======
const loginBtn = document.getElementById("loginBtn");
const loginDropdown = document.getElementById("loginDropdown");
const loginModal = document.getElementById("loginModal");
const loginTitle = document.getElementById("loginTitle");
const registerBtn = document.getElementById("registerBtn");

let registerModal = document.getElementById("registerModal");
if (!registerModal) {
  registerModal = document.createElement("div");
  registerModal.id = "registerModal";
  registerModal.style.cssText = `
    display:none; position:fixed; top:0; left:0; width:100%; height:100%;
    background:rgba(0,0,0,0.7); justify-content:center; align-items:center; z-index:9999;
  `;
  registerModal.innerHTML = `
    <div style="background:white; width:380px; border-radius:8px; padding:20px; text-align:center; color:#333;">
      <h2>Register Account</h2>
      <p style="font-size:14px;">Already have an account?
        <a href="#" id="backToLogin" style="color:#0d6efd;">Login here</a>
      </p>
      <div style="text-align:left;">
        <label>Full Name</label>
        <input type="text" placeholder="John Doe" style="width:100%; padding:8px; margin:5px 0; border:1px solid #ccc; border-radius:4px;">
        <label>Email Address</label>
        <input type="email" placeholder="you@example.com" style="width:100%; padding:8px; margin:5px 0; border:1px solid #ccc; border-radius:4px;">
        <label>Password</label>
        <input type="password" placeholder="******" style="width:100%; padding:8px; margin:5px 0; border:1px solid #ccc; border-radius:4px;">
        <label>Confirm Password</label>
        <input type="password" placeholder="******" style="width:100%; padding:8px; margin:5px 0; border:1px solid #ccc; border-radius:4px;">
      </div>
      <button style="width:100%; margin-top:10px; padding:10px; background:#0d6efd; color:white; border:none; border-radius:4px; cursor:pointer;">Register</button>
      <button id="closeRegister" style="margin-top:10px; background:none; border:none; color:#555; cursor:pointer;">Close</button>
    </div>
  `;
  document.body.appendChild(registerModal);
}

// ✅ ======= DROPDOWN =======
loginBtn?.addEventListener("click", e => {
  e.stopPropagation();
  loginDropdown.style.display = loginDropdown.style.display === "block" ? "none" : "block";
});

window.addEventListener("click", e => {
  if (!loginBtn.contains(e.target) && !loginDropdown.contains(e.target)) {
    loginDropdown.style.display = "none";
  }
});

// ✅ ======= LOGIN MODAL =======
function openModal(type) {
  loginDropdown.style.display = "none";
  loginModal.style.display = "flex";
  loginTitle.textContent = type === "customer" ? "Customer Login" : "Trainer Login";
}
function closeModal() {
  loginModal.style.display = "none";
}

// ✅ ======= REGISTER MODAL =======
registerBtn?.addEventListener("click", () => {
  loginModal.style.display = "none";
  registerModal.style.display = "flex";
});
document.getElementById("closeRegister")?.addEventListener("click", () => {
  registerModal.style.display = "none";
});
document.getElementById("backToLogin")?.addEventListener("click", (e) => {
  e.preventDefault();
  registerModal.style.display = "none";
  loginModal.style.display = "flex";
});

// ✅ ESC key closes modals
window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (loginModal.style.display === "flex") closeModal();
    if (registerModal.style.display === "flex") registerModal.style.display = "none";
  }
});

// ✅ ======= DEMO LOGIN VALIDATION =======
const demoTrainer = { email: "trainer@fitflow.test", password: "trainer123" };
const demoCustomer = { email: "customer@fitflow.test", password: "customer123" };

document.getElementById("trainerForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("trainerEmail").value;
  const pass = document.getElementById("trainerPassword").value;
  if (email === demoTrainer.email && pass === demoTrainer.password) {
    showToast("Trainer login successful!", "success");
    closeModal();
  } else {
    showToast("Invalid trainer credentials.", "error");
  }
});

document.getElementById("customerForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const email = document.getElementById("customerEmail").value;
  const pass = document.getElementById("customerPassword").value;
  if (email === demoCustomer.email && pass === demoCustomer.password) {
    showToast("Customer login successful!", "success");
    closeModal();
  } else {
    showToast("Invalid customer credentials.", "error");
  }
});

// ✅ ======= CHAT SYSTEM =======
function openChat() { document.getElementById("chatBox").style.display = "block"; }
function closeChat() { document.getElementById("chatBox").style.display = "none"; }

function sendMessage() {
  let input = document.getElementById("userInput");
  let message = input.value.trim();
  if (message === "") return;
  let chatMessages = document.getElementById("chatMessages");
  chatMessages.innerHTML += `<div style="text-align:right;"><div style="display:inline-block;background:#6A0DAD;color:white;padding:8px;border-radius:5px;margin-bottom:10px;max-width:80%;">${message}</div></div>`;
  input.value = "";
  setTimeout(() => {
    let reply = getAIReply(message);
    chatMessages.innerHTML += `<div style="background:#eee;padding:8px;border-radius:5px;margin-bottom:10px;max-width:80%;">${reply}</div>`;
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, 800);
}

function getAIReply(msg) {
  msg = msg.toLowerCase();
  if (msg.includes("hello") || msg.includes("hi")) return "Hello! 😊 How can I assist you?";
  if (msg.includes("help")) return "Sure! Tell me what you need help with.";
  if (msg.includes("course")) return "We offer many courses. Which subject are you interested in?";
  if (msg.includes("thanks")) return "You're welcome! 😊";
  return "I'm not sure, but I'm learning every day 🤖. Can you say it another way?";
}

// ✅ ======= PROGRESS TRACKING =======
function renderProgress() {
  const data = JSON.parse(localStorage.getItem("progressData") || "[]");
  const list = document.getElementById("progressList");
  if (list) list.innerHTML = data.map(p => `<div class="progress-entry">📊 ${p.weight}kg — ${p.note}</div>`).join("");
}
document.getElementById("progressForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const weight = document.getElementById("weight").value;
  const note = document.getElementById("note").value;
  if (weight && note) {
    const data = JSON.parse(localStorage.getItem("progressData") || "[]");
    data.push({ weight, note });
    localStorage.setItem("progressData", JSON.stringify(data));
    renderProgress();
    showToast("Progress logged!", "success");
    e.target.reset();
  }
});
renderProgress();



// ✅ ======= COMMUNITY POSTS =======
function renderPosts() {
  const posts = JSON.parse(localStorage.getItem("posts") || "[]");
  const feed = document.getElementById("feed");
  if (feed) feed.innerHTML = posts.map(p => `<div class="post-item">💬 ${p.text}</div>`).join("");
}
document.getElementById("postForm")?.addEventListener("submit", e => {
  e.preventDefault();
  const text = document.getElementById("postInput").value.trim();
  if (text) {
    const posts = JSON.parse(localStorage.getItem("posts") || "[]");
    posts.unshift({ text });
    localStorage.setItem("posts", JSON.stringify(posts));
    renderPosts();
    e.target.reset();
    showToast("Post shared!", "success");
  }
});
renderPosts();
// ======== SLIDER SCRIPT ======== -->

let ind = 0;
const total = 5; // total number of reviews
const slider = document.getElementById("review-inner");

setInterval(() => {
  ind = (ind + 1) % total;
  slider.style.transform = `translateX(-${ind * 100}%)`;
}, 3000); // every 10 seconds
