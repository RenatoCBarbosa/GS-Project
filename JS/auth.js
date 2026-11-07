function montarMenu(paginaAtiva) {
  const menu = document.getElementById('menu-dinamico');
  if (!menu) return; // Se não achar o menu, ele não faz nada e evita erros

  const perfil = localStorage.getItem('feiracircular_perfil') || 'cliente';
  let html = '';
  const btnSair = `<a href="index.html" class="nav__btn btn-sair" onclick="localStorage.removeItem('feiracircular_perfil')">Sair</a>`;

  if (perfil === 'feirante') {
    html = `
      <a href="inicio.html" class="nav__btn ${paginaAtiva === 'inicio' ? 'active' : ''}">Início</a>
      <a href="cadastro.html" class="nav__btn ${paginaAtiva === 'cadastro' ? 'active' : ''}">Anunciar</a>
      <a href="ofertas.html" class="nav__btn ${paginaAtiva === 'ofertas' ? 'active' : ''}">Minhas Ofertas</a>
      <a href="painel.html" class="nav__btn ${paginaAtiva === 'painel' ? 'active' : ''}">Meu Painel</a>
      ${btnSair}
    `;
  } else if (perfil === 'ong') {
    html = `
      <a href="inicio.html" class="nav__btn ${paginaAtiva === 'inicio' ? 'active' : ''}">Início</a>
      <a href="doacoes.html" class="nav__btn ${paginaAtiva === 'doacoes' ? 'active' : ''}">Mural de Doações</a>
      ${btnSair}
    `;
  } else {
    html = `
      <a href="inicio.html" class="nav__btn ${paginaAtiva === 'inicio' ? 'active' : ''}">Início</a>
      <a href="ofertas.html" class="nav__btn ${paginaAtiva === 'ofertas' ? 'active' : ''}">Ver Ofertas</a>
      ${btnSair}
    `;
  }

  menu.innerHTML = html;
}