const rankingList = document.getElementById("rankingList");

async function carregarRanking() {
  try {
    const res = await fetch("http://localhost:3000/api/rank");
    const data = await res.json();

    if (!data.success || data.ranking.length === 0) {
      rankingList.innerHTML = "<p class='loading'>Nenhuma pontuação ainda</p>";
      return;
    }

    rankingList.innerHTML = "";

    data.ranking.forEach((item, index) => {
      const row = document.createElement("div");
      row.classList.add("rank-row");

      const dataFormatada = new Date(item.data).toLocaleDateString("pt-BR");

      row.innerHTML = `
        <span>${index + 1}</span>
        <span>${item.nome}</span>
        <span>${item.pontos}</span>
        <span>${dataFormatada}</span>
      `;

      rankingList.appendChild(row);
    });

  } catch (err) {
    console.error(err);
    rankingList.innerHTML =
      "<p class='loading'>Erro ao carregar ranking</p>";
  }
}

function voltar() {
  window.location.href = "/home.html"; // ajuste se quiser
}

carregarRanking();
