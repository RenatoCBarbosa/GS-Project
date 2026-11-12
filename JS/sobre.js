// Abre ou fecha o texto adicional da página "Sobre".
document.addEventListener("DOMContentLoaded", () => {
  const btnSaibaMais = document.getElementById("btn-saiba-mais");
  const textoExpansivel = document.getElementById("texto-expansivel");

  // A classe "visivel" é lida pelo CSS para animar o texto para dentro e para fora.
  if (btnSaibaMais && textoExpansivel) {
    btnSaibaMais.addEventListener("click", () => {
      textoExpansivel.classList.toggle("visivel");

      // Altera o texto do botão dinamicamente
      if (textoExpansivel.classList.contains("visivel")) {
        btnSaibaMais.textContent = "Mostrar menos";
      } else {
        btnSaibaMais.textContent = "Saiba mais sobre a tecnologia";
      }
    });
  }
});