// Executado quando a pessoa escolhe um dos cartões da página inicial.
function selecionarPerfil(perfil) {
  // O localStorage mantém o perfil escolhido entre páginas no mesmo navegador.
  localStorage.setItem('feiracircular_perfil', perfil);

  // Depois da escolha, leva a pessoa à tela inicial personalizada.
  window.location.href = 'inicio.html';
}