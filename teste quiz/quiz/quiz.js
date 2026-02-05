const form = document.getElementById("quizForm");
const overlay = document.querySelector(".overlay");
const modalBox = document.getElementById("modalBox");

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

    if (inputRadio) {
      acertou = respostaUsuario === correta;
    }

    if (inputText) {
      acertou = respostaUsuario.includes(correta);
    }

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

  html += `
    <h3>Pontuação final: ${pontos} / 10</h3>
    <button class="close-btn" onclick="refazerQuiz()">Refazer quiz</button>
  `;

  modalBox.innerHTML = html;
}

function refazerQuiz() {
  overlay.classList.add("hidden");
  document.body.classList.remove("locked");
  form.reset();
}
