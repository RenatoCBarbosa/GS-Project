/* =========================================================
   1. FUNÇÃO DO MENU DINÂMICO
   ========================================================= */
function montarMenu(paginaAtiva) {
  const menu = document.getElementById('menu-dinamico');
  if (!menu) return;

  const perfil = localStorage.getItem('feiracircular_perfil') || 'cliente';
  const linksPorPerfil = {
    feirante: [
      ['inicio.html', 'Início', 'inicio'],
      ['cadastro.html', 'Anunciar', 'cadastro'],
      ['ofertas.html', 'Ofertas', 'ofertas'],
      ['painel.html', 'Meu painel', 'painel'],
      ['cadastro-usuario.html', 'Meu perfil', 'perfil']
    ],
    ong: [
      ['inicio.html', 'Início', 'inicio'],
      ['doacoes.html', 'Mural de doações', 'doacoes'],
      ['painel-usuario.html', 'Meu painel', 'painel-usuario'],
      ['cadastro-usuario.html', 'Meu perfil', 'perfil']
    ],
    cliente: [
      ['inicio.html', 'Início', 'inicio'],
      ['ofertas.html', 'Ofertas', 'ofertas'],
      ['painel-usuario.html', 'Meu histórico', 'painel-usuario'],
      ['cadastro-usuario.html', 'Meu perfil', 'perfil']
    ]
  };
  const links = linksPorPerfil[perfil] || linksPorPerfil.cliente;
  const htmlLinks = links.map(([href, texto, pagina]) =>
    `<a href="${href}" class="nav__btn ${paginaAtiva === pagina ? 'active' : ''}">${texto}</a>`
  );
  const linksInstitucionais = [
    ['localizador', 'localizador.html', 'Feiras próximas'],
    ['sobre', 'sobre.html', 'Sobre'],
    ['integrantes', 'integrantes.html', 'Equipe'],
    ['faq', 'faq.html', 'FAQ'],
    ['contato', 'contato.html', 'Contato']
  ];
  htmlLinks.push(...linksInstitucionais.map(([pagina, href, texto]) =>
    `<a href="${href}" class="nav__btn ${paginaAtiva === pagina ? 'active' : ''}">${texto}</a>`
  ));
  htmlLinks.push('<a href="index.html" class="nav__btn btn-sair" data-sair>Sair</a>');
  menu.innerHTML = htmlLinks.join('');
  menu.querySelector('[data-sair]').addEventListener('click', () => {
    localStorage.removeItem('feiracircular_perfil');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const botaoMenu = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('menu-dinamico');
  if (!menu) return;

  const arquivoAtual = window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const paginaAtiva = arquivoAtual === 'cadastro-usuario' ? 'perfil' : arquivoAtual;
  montarMenu(paginaAtiva);
  if (!botaoMenu) return;

  botaoMenu.addEventListener('click', () => {
    const aberto = menu.classList.toggle('nav-ativa');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
  });

  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && menu.classList.contains('nav-ativa')) {
      menu.classList.remove('nav-ativa');
      botaoMenu.setAttribute('aria-expanded', 'false');
      botaoMenu.focus();
    }
  });
});
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js')
      .then(registration => {
        console.log('PWA ativado com sucesso. Escopo:', registration.scope);
      })
      .catch(err => {
        console.error('Erro ao ativar o PWA:', err);
      });
  });
}