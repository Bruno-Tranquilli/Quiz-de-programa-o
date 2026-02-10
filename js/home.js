// ===============================
// SELETORES
// ===============================
const body = document.body;

const createAccountBtn = document.getElementById("createAccountBtn");
const loginBtn = document.getElementById("loginBtn");
const startQuizBtn = document.getElementById("startQuizBtn");

const createAccountModal = document.getElementById("createAccountModal");
const loginModal = document.getElementById("loginModal");

const createForm = document.getElementById("createForm");
const loginForm = document.getElementById("loginForm");

const createErrorMsg = document.getElementById("createErrorMsg");
const loginErrorMsg = document.getElementById("loginErrorMsg");

// ===============================
// FUNÇÕES DE MODAL
// ===============================
function openModal(modal) {
  modal.classList.remove("hidden");
  body.classList.add("locked");
}

function closeModal(modal) {
  modal.classList.add("hidden");
  body.classList.remove("locked");
}

// ===============================
// EVENTOS DE ABRIR MODAIS
// ===============================
createAccountBtn.addEventListener("click", () => openModal(createAccountModal));
loginBtn.addEventListener("click", () => openModal(loginModal));

// FECHAR MODAL AO CLICAR FORA
[createAccountModal, loginModal].forEach((modal) => {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal(modal);
  });
});

// ===============================
// VERIFICAÇÃO DE LOGIN
// ===============================
const usuarioSalvo = localStorage.getItem("usuarioLogado");

if (!usuarioSalvo || usuarioSalvo === "undefined" || usuarioSalvo === "null") {
  localStorage.removeItem("usuarioLogado");
}

function verificarLogin() {
  const usuario = localStorage.getItem("usuarioLogado");

  if (usuario) {
    startQuizBtn.classList.remove("hidden");
    createAccountBtn.classList.add("hidden");
    loginBtn.classList.add("hidden");
  } else {
    startQuizBtn.classList.add("hidden");
    createAccountBtn.classList.remove("hidden");
    loginBtn.classList.remove("hidden");
  }
}

// chama ao carregar
verificarLogin();

// ===============================
// IR PARA O QUIZ
// ===============================
startQuizBtn.addEventListener("click", () => {
  window.location.href = "quiz/quiz.html";
});

// ===============================
// CRIAR CONTA
// ===============================
createForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = createForm.username.value.trim();
  const password = createForm.password.value.trim();
  const confirmPassword = createForm.confirmPassword.value.trim();

  if (!username || !password || !confirmPassword) {
    createErrorMsg.textContent = "Preencha todos os campos!";
    return;
  }

  if (password !== confirmPassword) {
    createErrorMsg.textContent = "Senhas não coincidem!";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/create-account", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!data.success) {
      createErrorMsg.textContent = data.message || "Erro ao criar conta";
      return;
    }

    createErrorMsg.textContent = "";
    alert("Conta criada com sucesso!");
    closeModal(createAccountModal);
    createForm.reset();

  } catch (error) {
    createErrorMsg.textContent = "Erro ao conectar com o servidor";
  }
});

// ===============================
// LOGIN
// ===============================
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = loginForm.username.value.trim();
  const password = loginForm.password.value.trim();

  if (!username || !password) {
    loginErrorMsg.textContent = "Preencha todos os campos!";
    return;
  }

  try {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (!data.success) {
      loginErrorMsg.textContent = data.message || "Usuário ou senha inválidos";
      return;
    }

    // SALVA LOGIN
    localStorage.setItem("usuarioLogado", data.username);

    verificarLogin();

    loginErrorMsg.textContent = "";
    alert(`Login realizado com sucesso! Bem-vindo ${data.username}`);
    closeModal(loginModal);
    loginForm.reset();

  } catch (error) {
    loginErrorMsg.textContent = "Erro ao conectar com o servidor";
  }
});
