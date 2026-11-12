// Controla a busca e a abertura das respostas na página de perguntas frequentes.
document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");
  const searchInput = document.getElementById("faq-search");
  const msgVazio = document.getElementById("faq-vazio");

  // Funcionalidade do Acordeão (Abrir/Fechar)
  // O acordeão mantém no máximo uma resposta aberta por vez.
  faqItems.forEach((item) => {
    const questionButton = item.querySelector(".faq-question");

    questionButton.addEventListener("click", () => {
      // Fecha os outros itens abertos
      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          otherItem.classList.remove("active");
        }
      });

      // Alterna o estado do item clicado
      item.classList.toggle("active");
    });
  });

  // Funcionalidade da Barra de Pesquisa em Tempo Real
  // Filtra as perguntas enquanto a pessoa digita, comparando pergunta e resposta.
  searchInput.addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase().trim();
    let encontrouResultados = false;

    faqItems.forEach((item) => {
      const textoPergunta = item.querySelector(".faq-question").textContent.toLowerCase();
      const textoResposta = item.querySelector(".faq-answer").textContent.toLowerCase();
      const palavrasChave = item.getAttribute("data-keywords") || "";

      // Verifica se o termo digitado está presente na pergunta, resposta ou nas palavras-chave
      if (
        textoPergunta.includes(termo) ||
        textoResposta.includes(termo) ||
        palavrasChave.includes(termo)
      ) {
        item.style.display = "block";
        encontrouResultados = true;
      } else {
        item.style.display = "none";
        item.classList.remove("active"); // Fecha se estiver aberto e for filtrado
      }
    });

    // Mostra ou oculta a mensagem de "nenhum resultado"
    if (encontrouResultados || termo === "") {
      msgVazio.style.display = "none";
    } else {
      msgVazio.style.display = "block";
    }
  });
});