document.addEventListener('DOMContentLoaded', () => {
  montarMenu('inicio');
  
  const perfil = localStorage.getItem('feiracircular_perfil') || 'cliente';
  const saudacao = document.getElementById('saudacao');
  const subtitulo = document.getElementById('subtitulo-saudacao');
  const hora = new Date().getHours();
  const textoHora = (hora < 12) ? "Bom dia" : (hora < 18) ? "Boa tarde" : "Boa noite";

  if (perfil === 'feirante') {
    saudacao.textContent = `${textoHora}, Feirante!`;
    subtitulo.textContent = "Bem-vindo ao seu centro de controle. O que vamos fazer hoje?";
    
    document.getElementById('acoes-rapidas').innerHTML = `
      <a href="cadastro.html" class="card-acao destaque">
        <div class="icone">➕</div>
        <div class="texto"><h2>Anunciar Excedente</h2><p>Cadastre o que sobrou para vender ou doar.</p></div>
      </a>
      <a href="painel.html" class="card-acao">
        <div class="icone">📊</div>
        <div class="texto"><h2>Meu Painel de Resultados</h2><p>Veja sua receita e impacto do dia.</p></div>
      </a>
    `;

    document.getElementById('resumo-dia').style.display = 'block';
    const ofertas = JSON.parse(localStorage.getItem('feiracircular_ofertas')) || [];
    const historico = JSON.parse(localStorage.getItem('feiracircular_historico')) || [];
    const ativos = ofertas.filter(o => o.quantidade > 0).length;
    let receita = 0;
    historico.forEach(h => {
      if (h.operacao === 'Venda com desconto') receita += parseFloat(h.valor.replace('R$', '').replace('.', '').replace(',', '.').trim());
    });

    document.getElementById('resumo-dia').innerHTML = `
      <h2>Seu impacto hoje</h2>
      <div class="grid-impacto">
        <div class="impacto-item"><span>${ativos}</span><small>Produtos no ar</small></div>
        <div class="impacto-item"><span>${historico.length}</span><small>Reservas recebidas</small></div>
        <div class="impacto-item"><span>${receita.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span><small>Receita garantida</small></div>
      </div>
    `;

  } else if (perfil === 'ong') {
    saudacao.textContent = `${textoHora}, Organização Social!`;
    subtitulo.textContent = "Encontre alimentos disponíveis para doação na sua região.";
    document.getElementById('acoes-rapidas').innerHTML = `
      <a href="doacoes.html" class="card-acao destaque" style="border-left-color: #ef6c00;">
        <div class="icone">🤝</div>
        <div class="texto"><h2>Buscar Doações</h2><p>Veja alimentos disponíveis e solicite a retirada.</p></div>
      </a>
    `;

  } else {
    saudacao.textContent = `${textoHora}, Consumidor!`;
    subtitulo.textContent = "Encontre alimentos frescos e com desconto perto de você.";
    document.getElementById('acoes-rapidas').innerHTML = `
      <a href="ofertas.html" class="card-acao destaque">
        <div class="icone">🛒</div>
        <div class="texto"><h2>Ver Ofertas com Desconto</h2><p>Encontre alimentos frescos com preço reduzido.</p></div>
      </a>
    `;
  }
});