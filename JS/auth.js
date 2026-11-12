// Funções compartilhadas pelas páginas que têm menu ou suporte para instalação como app.

/* =========================================================
   1. FUNÇÃO DO MENU DINÂMICO
   ========================================================= */
function montarMenu(paginaAtiva) {
  // Se a página não tiver área de navegação, não há menu para montar.
  const menu = document.getElementById('menu-dinamico');
  if (!menu) return;

  // O perfil fica salvo neste navegador para o site saber quais links mostrar.
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
  // O terceiro valor identifica a página atual e destaca seu link no menu.
  const htmlLinks = links.map(([href, texto, pagina]) =>
    `<a href="${href}" class="nav__btn ${paginaAtiva === pagina ? 'active' : ''}">${texto}</a>`
  );
  // Estas páginas são informativas e aparecem para todos os perfis.
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
  // Ao sair, remove somente a escolha de perfil deste navegador.
  htmlLinks.push('<a href="index.html" class="nav__btn btn-sair" data-sair>Sair</a>');
  menu.innerHTML = htmlLinks.join('');
  menu.querySelector('[data-sair]').addEventListener('click', () => {
    localStorage.removeItem('feiracircular_perfil');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Descobre a página atual pelo nome do arquivo para destacar o link correto.
  const botaoMenu = document.querySelector('[data-menu-toggle]');
  const menu = document.getElementById('menu-dinamico');
  if (!menu) return;

  const arquivoAtual = window.location.pathname.split('/').pop().replace(/\.html$/, '');
  const paginaAtiva = arquivoAtual === 'cadastro-usuario' ? 'perfil' : arquivoAtual;
  montarMenu(paginaAtiva);
  if (!botaoMenu) return;

  // Em telas pequenas, o botão abre/fecha o menu e atualiza seu estado acessível.
  botaoMenu.addEventListener('click', () => {
    const aberto = menu.classList.toggle('nav-ativa');
    botaoMenu.setAttribute('aria-expanded', String(aberto));
  });

  // A tecla Escape também fecha o menu e devolve o foco ao botão.
  document.addEventListener('keydown', evento => {
    if (evento.key === 'Escape' && menu.classList.contains('nav-ativa')) {
      menu.classList.remove('nav-ativa');
      botaoMenu.setAttribute('aria-expanded', 'false');
      botaoMenu.focus();
    }
  });
});
// O Service Worker permite guardar páginas no cache para abrir o site mais rápido.
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