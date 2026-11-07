function selecionarPerfil(perfil) {
  // 1. Salva a escolha no navegador para o site inteiro saber quem é o usuário
  localStorage.setItem('feiracircular_perfil', perfil);

  // 2. Dá um feedback rápido (opcional, mas bom para o usuário saber que funcionou)
  // Você pode remover o alert se achar que demora muito.
  // alert(`Você entrou como: ${perfil.toUpperCase()}`);

  // 3. Redireciona para a página inicial (Vitrine)
  window.location.href = 'inicio.html';
}