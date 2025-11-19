// LocalStorage users & transactions
let users = JSON.parse(localStorage.getItem("rup_users") || "[]");
let txns = JSON.parse(localStorage.getItem("rup_txns") || "[]");

// Toggle login/register
function toggleMode(mode) {
  document.getElementById("login-form").style.display = mode === "login" ? "block" : "none";
  document.getElementById("register-form").style.display = mode === "register" ? "block" : "none";
}

// Register
function register() {
  let name = document.getElementById("reg-name").value;
  let email = document.getElementById("reg-email").value;
  let pass = document.getElementById("reg-pass").value;

  users.push({ name, email, pass });
  localStorage.setItem("rup_users", JSON.stringify(users));

  alert("Account created!");
  toggleMode("login");
}

// Login
function login() {
  let email = document.getElementById("login-email").value;
  let pass = document.getElementById("login-pass").value;

  let user = users.find(u => u.email === email && u.pass === pass);

  if (!user) return alert("Invalid credentials");

  localStorage.setItem("rup_session", JSON.stringify(user));

  document.getElementById("auth-screen").style.display = "none";
  document.getElementById("dashboard").style.display = "block";

  loadUser();
}

// Logout
function logout() {
  localStorage.removeItem("rup_session");
  location.reload();
}

// Load user into dashboard
function loadUser() {
  let user = JSON.parse(localStorage.getItem("rup_session"));
  if (!user) return;

  document.getElementById("user-name").innerText = user.name;
  document.getElementById("acc-name").innerText = user.name;
  document.getElementById("acc-email").innerText = user.email;

  renderTxns();
}

// Switch pages
function openPage(id) {
  document.querySelectorAll(".subpage").forEach(p => p.style.display = "none");
  document.getElementById("dashboard-main").style.display = "none";

  document.getElementById(id).style.display = "block";
}

// Add transfer
function sendMoney() {
  let to = document.getElementById("to").value;
  let amt = document.getElementById("amount").value;

  txns.push({ desc: `Transfer to ${to}`, amount: amt, date: new Date().toLocaleDateString() });
  localStorage.setItem("rup_txns", JSON.stringify(txns));

  alert("Money sent (demo)");
  renderTxns();
}

// Pay bill
function payBill() {
  let b = document.getElementById("biller").value;
  let amt = document.getElementById("bill-amount").value;

  txns.push({ desc: `${b} Bill Paid`, amount: amt, date: new Date().toLocaleDateString() });
  localStorage.setItem("rup_txns", JSON.stringify(txns));

  alert("Bill paid (demo)");
  renderTxns();
}

// Render transaction list
function renderTxns() {
  let list = document.getElementById("txn-list");
  list.innerHTML = "";

  txns.slice().reverse().forEach(t => {
    list.innerHTML += `
      <div class="txn-row">
        <strong>${t.desc}</strong><br>
        Amount: ₹${t.amount}<br>
        <small>${t.date}</small>
      </div>
    `;
  });
}
