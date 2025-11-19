/* STORAGE */
let users = JSON.parse(localStorage.getItem("rup_users") || "[]");
let txns = JSON.parse(localStorage.getItem("rup_txns") || "[]");

/* AUTH */
function toggleMode(mode) {
  document.getElementById("login-form").style.display =
    mode === "login" ? "block" : "none";
  document.getElementById("register-form").style.display =
    mode === "register" ? "block" : "none";
}

function register() {
  let name = document.getElementById("reg-name").value;
  let email = document.getElementById("reg-email").value;
  let pass = document.getElementById("reg-pass").value;
  if (!name || !email || !pass) return alert("Fill all fields");

  if (users.some(u => u.email === email)) return alert("Email already exists");

  users.push({ name, email, pass });
  localStorage.setItem("rup_users", JSON.stringify(users));

  alert("Account created!");
  toggleMode("login");
}

function login() {
  let email = document.getElementById("login-email").value;
  let pass = document.getElementById("login-pass").value;

  let user = users.find(u => u.email === email && u.pass === pass);
  if (!user) return alert("Incorrect email or password");

  localStorage.setItem("rup_session", JSON.stringify(user));
  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("dashboard").style.display = "flex";

  loadUser();
  openPage('dashboard-main');
}

function logout() {
  localStorage.removeItem("rup_session");
  location.reload();
}

/* LOAD USER */
function loadUser() {
  let user = JSON.parse(localStorage.getItem("rup_session"));
  if (!user) return;

  document.getElementById("user-name").innerText = user.name;
  document.getElementById("acc-name").innerText = user.name;
  document.getElementById("acc-email").innerText = user.email;

  updateBalance();
  renderTxns();
  randomAITip();
}

/* FIXED NAVIGATION */
function openPage(id) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

/* TRANSACTIONS */
function updateBalance() {
  let total = txns.reduce((s,t) => s + Number(t.amount), 0);
  document.getElementById("balance").innerText = "₹" + total;
}

function renderTxns() {
  let list = document.getElementById("txn-list");
  list.innerHTML = "";

  txns.slice().reverse().forEach(t => {
    list.innerHTML += `
      <div class="txn-row">
        <strong>${t.desc}</strong> - ₹${t.amount}<br>
        <small>${t.date}</small>
      </div>
    `;
  });

  updateBalance();
}

/* TRANSFER */
function sendMoney() {
  let to = document.getElementById("to").value;
  let amt = document.getElementById("amount").value;

  if (!to || !amt) return alert("Enter all details");

  txns.push({
    desc: `Transfer to ${to}`,
    amount: -Math.abs(amt),
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem("rup_txns", JSON.stringify(txns));
  alert("Money sent (demo)");
  renderTxns();
}

/* BILL PAYMENT */
function payBill() {
  let b = document.getElementById("biller").value;
  let amt = document.getElementById("bill-amount").value;

  if (!b || !amt) return alert("Enter all details");

  txns.push({
    desc: `${b} Bill Paid`,
    amount: -Math.abs(amt),
    date: new Date().toLocaleDateString()
  });

  localStorage.setItem("rup_txns", JSON.stringify(txns));
  alert("Bill Paid (demo)");
  renderTxns();
}

/* AI TIP */
function randomAITip() {
  const tips = [
    "✨ Save at least 10% today.",
    "📊 Spending low this week.",
    "🔐 Enable 2FA for protection.",
    "💡 Plan monthly bills in advance."
  ];
  document.getElementById("ai-tip").innerText =
    tips[Math.floor(Math.random() * tips.length)];
}

/* AI ASSISTANT */
function runAI() {
  let input = document.getElementById("ai-input").value.toLowerCase();
  let out = document.getElementById("ai-output");

  if (!input) return out.innerHTML = "Type something 🙂";

  if (input.includes("balance")) {
    let total = txns.reduce((s,t)=>s+Number(t.amount),0);
    return out.innerHTML = `💰 Your balance is ₹${total}`;
  }

  if (input.includes("last")) {
    let last = txns.slice(-3).reverse();
    out.innerHTML = "<strong>Recent:</strong><br>";
    last.forEach(t => out.innerHTML += `• ${t.desc} – ₹${t.amount}<br>`);
    return;
  }

  if (input.includes("spend") || input.includes("spent")) {
    let spent = txns.filter(t=>t.amount<0)
        .reduce((s,t)=>s+Math.abs(t.amount),0);
    return out.innerHTML = `🧾 Total spent: ₹${spent}`;
  }

  out.innerHTML = "🤖 I'm learning!";
}


