const form = document.getElementById("quizForm");
const overlay = document.querySelector(".overlay");
const modalBox = document.getElementById("modalBox");

/* 🔹 pega usuário logado */
const usuarioLogado = localStorage.getItem("usuarioLogado");

/* 🔹 PROTEÇÃO */
if (!usuarioLogado) {
  alert("Você precisa estar logado para fazer o quiz.");
  window.location.href = "../index.html";
}

const respostasCorretas = {
  q1: "a",
  q2: "c",
  q3: "b",
  q4: "c",
  q5: "c",
  q6: "c",
  q7: "c",
  q8: "c",
  q9: "criar programas",
  q10: "deixar o site interativo"
};

let pontuacaoFinal = 0; // 🔹 NOVO

form.addEventListener("submit", function (e) {
  e.preventDefault();

  modalBox.innerHTML = `
    <h2>Enviando respostas</h2>
    <div class="dots">
      <span></span><span></span><span></span>
    </div>
  `;

  overlay.classList.remove("hidden");
  document.body.classList.add("locked");

  setTimeout(mostrarResultado, 800);
});

function mostrarResultado() {
  let pontos = 0;
  let html = `<h2>Resultado do Quiz</h2>`;

  Object.keys(respostasCorretas).forEach((q) => {
    const fieldset = document.querySelector(`fieldset[data-question="${q}"]`);
    if (!fieldset) return;

    let respostaUsuario = "";

    const inputRadio = fieldset.querySelector("input[type=radio]:checked");
    const inputText = fieldset.querySelector("input[type=text]");

    if (inputRadio) respostaUsuario = inputRadio.value;
    if (inputText) respostaUsuario = inputText.value.trim().toLowerCase();

    const correta = respostasCorretas[q].toLowerCase();
    let acertou = false;

    if (inputRadio) acertou = respostaUsuario === correta;
    if (inputText) acertou = respostaUsuario.includes(correta);

    if (acertou) pontos++;

    html += `
      <div class="answer ${acertou ? "correct" : "wrong"}">
        <strong class="${acertou ? "correct-text" : "wrong-text"}">
          ${acertou ? "Resposta correta" : "Resposta errada"}
        </strong><br>
        <strong>Sua resposta:</strong> ${respostaUsuario || "Não respondeu"}<br>
        <strong>Resposta correta:</strong> ${respostasCorretas[q]}
      </div>
    `;
  });

  pontuacaoFinal = pontos; // 🔹 guarda pontuação

  html += `
    <h3>Pontuação final: ${pontos} / 10</h3>

    <button class="close-btn" onclick="refazerQuiz()">Refazer quiz</button>
    <br><br>
    <button class="close-btn" onclick="pedirApelido()">Ver ranking</button>
  `;

  modalBox.innerHTML = html;
}

/* 🔹 NOVO: pede apelido */
function pedirApelido() {
  modalBox.innerHTML = `
    <h2>Digite seu apelido</h2>
    <input 
      type="text" 
      id="apelidoInput" 
      placeholder="Ex: DevMaster"
      style="width:100%; padding:10px; margin-top:10px; border-radius:8px;"
    />
    <br><br>
    <button class="close-btn" onclick="salvarPontuacao()">Confirmar</button>
  `;
}

/* 🔹 NOVO: salva no banco */
async function salvarPontuacao() {
  const apelido = document.getElementById("apelidoInput").value.trim();

  if (!apelido) {
    alert("Digite um apelido!");
    return;
  }

  try {
    await fetch("http://localhost:3000/api/quiz/score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: usuarioLogado,
        apelido,
        pontos: pontuacaoFinal
      })
    });

    window.location.href = "ranking/ranking.html";
  } catch (err) {
    console.error("Erro ao salvar pontuação:", err);
    alert("Erro ao salvar pontuação");
  }
}

function refazerQuiz() {
  overlay.classList.add("hidden");
  document.body.classList.remove("locked");
  form.reset();
}
