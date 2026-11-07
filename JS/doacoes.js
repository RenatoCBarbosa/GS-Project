let todasAsOfertas = [];

document.addEventListener('DOMContentLoaded', () => {
  montarMenu('doacoes');
  
  // Proteção: só ONG acessa essa página (ou cliente/feirante visualiza mas não interage)
  const perfil = localStorage.getItem('feiracircular_perfil') || 'cliente';

  const dadosSalvos = localStorage.getItem('feiracircular_ofertas');
  todasAsOfertas = dadosSalvos ? JSON.parse(dadosSalvos) : [];

  const selectFeira = document.getElementById('filtro-feira');
  const feirasUnicas = [...new Set(todasAsOfertas.map(o => o.local))];
  feirasUnicas.forEach(feira => {
    const option = document.createElement('option');
    option.value = feira;
    option.textContent = feira;
    selectFeira.appendChild(option);
  });

  renderizarDoacoes();
  document.getElementById('filtro-busca').addEventListener('input', renderizarDoacoes);
  document.getElementById('filtro-feira').addEventListener('change', renderizarDoacoes);
});

function renderizarDoacoes() {
  const container = document.getElementById('lista-doacoes');
  const msgVazio = document.getElementById('msg-vazio');
  const termoBusca = document.getElementById('filtro-busca').value.toLowerCase();
  const feiraSelecionada = document.getElementById('filtro-feira').value;
  const perfil = localStorage.getItem('feiracircular_perfil') || 'cliente';

  const doacoesFiltradas = todasAsOfertas.filter(oferta => {
    const ehDoacao = oferta.tipo === 'doacao' || oferta.tipo === 'ambos';
    const bateBusca = oferta.alimento.toLowerCase().includes(termoBusca) || oferta.barraca.toLowerCase().includes(termoBusca);
    const bateFeira = feiraSelecionada === 'todas' || oferta.local === feiraSelecionada;
    const temEstoque = oferta.quantidade > 0;
    return ehDoacao && bateBusca && bateFeira && temEstoque;
  });

  container.innerHTML = '';

  if (doacoesFiltradas.length === 0) {
    msgVazio.style.display = 'block';
    return;
  } else {
    msgVazio.style.display = 'none';
  }

  doacoesFiltradas.forEach(oferta => {
    const card = document.createElement('div');
    card.className = 'card-oferta';
    
    // Lógica de botões
    let botaoHTML = '';
    if (perfil === 'ong') {
      botaoHTML = `<button class="btn btn--doar" onclick="solicitarDoacao(${oferta.id})">Solicitar Doação</button>`;
    } else {
      botaoHTML = `<button class="btn" style="background:#ccc; cursor:not-allowed;" disabled>Apenas ONGs podem solicitar</button>`;
    }

    card.innerHTML = `
      <div class="card-header">
        <span class="tag">Doação</span>
        <span class="estoque">Disponível: ${oferta.quantidade} kg</span>
      </div>
      <h3>${oferta.alimento}</h3>
      <small>📍 ${oferta.barraca} - ${oferta.local}</small>
      <div class="preco"><span class="novo">Gratuito</span></div>
      ${botaoHTML}
    `;
    container.appendChild(card);
  });
}

function solicitarDoacao(idOferta) {
  const oferta = todasAsOfertas.find(o => o.id === idOferta);
  if (!oferta) return;

  const qtdDigitada = prompt(`Quantos kg de ${oferta.alimento} a sua organização deseja solicitar?\n(Disponível: ${oferta.quantidade} kg)`);
  const quantidadeSolicitada = parseFloat(qtdDigitada);

  if (isNaN(quantidadeSolicitada) || quantidadeSolicitada <= 0) {
    alert("Por favor, digite uma quantidade válida.");
    return;
  }
  if (quantidadeSolicitada > oferta.quantidade) {
    alert(`Desculpe, o feirante só tem ${oferta.quantidade} kg disponíveis.`);
    return;
  }

  oferta.quantidade -= quantidadeSolicitada;
  localStorage.setItem('feiracircular_ofertas', JSON.stringify(todasAsOfertas));

  const historicoSalvo = localStorage.getItem('feiracircular_historico');
  let historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
  
  historico.push({
    data: new Date().toLocaleString('pt-BR'),
    alimento: oferta.alimento,
    operacao: 'Doação',
    qtd: quantidadeSolicitada + ' kg',
    valor: 'Gratuito'
  });
  localStorage.setItem('feiracircular_historico', JSON.stringify(historico));

  alert(`🤝 Doação Confirmada!\nSua organização solicitou ${quantidadeSolicitada} kg de ${oferta.alimento}.`);
  renderizarDoacoes(); 
}