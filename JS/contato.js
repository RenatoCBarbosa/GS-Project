// Valida os campos de contato e exibe uma confirmação local quando todos estão corretos.
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-contato");
  const msgSucesso = document.getElementById("msg-sucesso");

  form.addEventListener("submit", function (e) {
    // Impede o recarregamento da página enquanto a validação acontece.
    e.preventDefault(); // Impede o envio padrão

    // Captura dos campos
    const nome = document.getElementById("nome");
    const email = document.getElementById("email");
    const assunto = document.getElementById("assunto");
    const mensagem = document.getElementById("mensagem");

    let formValidado = true;

    // Função auxiliar para exibir erro
    // Estas funções mostram o erro ao lado do campo ou limpam o aviso anterior.
    function mostrarErro(input, spanId, mensagemErro) {
      input.style.borderColor = "#e74c3c";
      document.getElementById(spanId).textContent = mensagemErro;
      formValidado = false;
    }

    // Função auxiliar para limpar erro
    function limparErro(input, spanId) {
      input.style.borderColor = "#2ecc71";
      document.getElementById(spanId).textContent = "";
    }

    // Validação do Nome
    if (nome.value.trim() === "") {
      mostrarErro(nome, "erro-nome", "Por favor, preencha seu nome.");
    } else {
      limparErro(nome, "erro-nome");
    }

    // Validação do E-mail (formato válido)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email.value.trim() === "") {
      mostrarErro(email, "erro-email", "O e-mail é obrigatório.");
    } else if (!emailRegex.test(email.value.trim())) {
      mostrarErro(email, "erro-email", "Informe um e-mail válido (ex: email@dominio.com).");
    } else {
      limparErro(email, "erro-email");
    }

    // Validação do Assunto
    if (assunto.value.trim() === "") {
      mostrarErro(assunto, "erro-assunto", "O assunto é obrigatório.");
    } else {
      limparErro(assunto, "erro-assunto");
    }

    // Validação da Mensagem
    if (mensagem.value.trim() === "") {
      mostrarErro(mensagem, "erro-mensagem", "A mensagem não pode estar vazia.");
    } else {
      limparErro(mensagem, "erro-mensagem");
    }

    // Se tudo estiver válido, simula o envio com sucesso
    // Só mostra sucesso quando todos os campos passaram pelas verificações.
    if (formValidado) {
      form.style.display = "none";
      msgSucesso.style.display = "block";
    }
  });
});