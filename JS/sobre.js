document.addEventListener("DOMContentLoaded", () => {
  const btnSaibaMais = document.getElementById("btn-saiba-mais");
  const textoExpansivel = document.getElementById("texto-expansivel");

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