let todasAsOfertas = [];

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

document.addEventListener('DOMContentLoaded', () => {
  montarMenu('ofertas');
  const perfil = localStorage.getItem('feiracircular_perfil') || 'cliente';

  const dadosSalvos = localStorage.getItem('feiracircular_ofertas');
  todasAsOfertas = dadosSalvos ? JSON.parse(dadosSalvos) : [];

  if (todasAsOfertas.length === 0) {
    todasAsOfertas = [
      { id: 1, barraca: "Barraca do Zé", local: "Feira da Vila Mariana", alimento: "Tomate Italiano", quantidade: 12, precoOriginal: 8.50, precoDesconto: 4.00, tipo: "venda" },
      { id: 2, barraca: "Horta da Maria", local: "Feira do Ipiranga", alimento: "Banana Prata", quantidade: 15, precoOriginal: 6.00, precoDesconto: 3.00, tipo: "venda" }
    ];
    localStorage.setItem('feiracircular_ofertas', JSON.stringify(todasAsOfertas));
  }

  const selectFeira = document.getElementById('filtro-feira');
  const feirasUnicas = [...new Set(todasAsOfertas.map(o => o.local))];
  feirasUnicas.forEach(feira => {
    const option = document.createElement('option');
    option.value = feira;
    option.textContent = feira;
    selectFeira.appendChild(option);
  });

  renderizarOfertas();
  document.getElementById('filtro-busca').addEventListener('input', renderizarOfertas);
  document.getElementById('filtro-feira').addEventListener('change', renderizarOfertas);
});

function renderizarOfertas() {
  const container = document.getElementById('lista-ofertas');
  const msgVazio = document.getElementById('msg-vazio');
  const termoBusca = document.getElementById('filtro-busca').value.toLowerCase();
  const feiraSelecionada = document.getElementById('filtro-feira').value;
  const perfil = localStorage.getItem('feiracircular_perfil') || 'cliente';

  const ofertasFiltradas = todasAsOfertas.filter(oferta => {
    const ehVenda = oferta.tipo === 'venda' || oferta.tipo === 'ambos';
    const bateBusca = oferta.alimento.toLowerCase().includes(termoBusca) || oferta.barraca.toLowerCase().includes(termoBusca);
    const bateFeira = feiraSelecionada === 'todas' || oferta.local === feiraSelecionada;
    const temEstoque = oferta.quantidade > 0;
    return ehVenda && bateBusca && bateFeira && temEstoque;
  });

  container.innerHTML = '';

  if (ofertasFiltradas.length === 0) {
    msgVazio.style.display = 'block';
    return;
  } else {
    msgVazio.style.display = 'none';
  }

  ofertasFiltradas.forEach(oferta => {
    const desconto = Math.round(((oferta.precoOriginal - oferta.precoDesconto) / oferta.precoOriginal) * 100);
    const card = document.createElement('div');
    card.className = 'card-oferta';
    
    // Lógica de botões por perfil
    let botaoHTML = '';
    if (perfil === 'feirante') {
      botaoHTML = `<button class="btn" style="background:#ccc; cursor:not-allowed;" disabled>Seu anúncio ativo</button>`;
    } else if (perfil === 'ong') {
      botaoHTML = `<button class="btn" style="background:#ccc; cursor:not-allowed;" disabled>Exclusivo p/ Consumidor</button>`;
    } else {
      botaoHTML = `<button class="btn btn--primary" onclick="fazerReserva(${oferta.id})">Reservar Agora</button>`;
    }

    card.innerHTML = `
      <div class="card-header">
        <span class="tag">${desconto}% OFF</span>
        <span class="estoque">Restam ${oferta.quantidade} kg</span>
      </div>
      <h3>${oferta.alimento}</h3>
      <small>📍 ${oferta.barraca} - ${oferta.local}</small>
      <div class="preco">
        <span class="riscado">${formatarMoeda(oferta.precoOriginal)}</span>
        <span class="novo">${formatarMoeda(oferta.precoDesconto)} <small>/kg</small></span>
      </div>
      ${botaoHTML}
    `;
    container.appendChild(card);
  });
}

function fazerReserva(idOferta) {
  const oferta = todasAsOfertas.find(o => o.id === idOferta);
  if (!oferta) return;

  const qtdDigitada = prompt(`Quantos kg de ${oferta.alimento} você deseja reservar?\n(Disponível: ${oferta.quantidade} kg)`);
  const quantidadeReservada = parseFloat(qtdDigitada);

  if (isNaN(quantidadeReservada) || quantidadeReservada <= 0) {
    alert("Por favor, digite uma quantidade válida.");
    return;
  }
  if (quantidadeReservada > oferta.quantidade) {
    alert(`Desculpe, só temos ${oferta.quantidade} kg disponíveis.`);
    return;
  }

  oferta.quantidade -= quantidadeReservada;
  localStorage.setItem('feiracircular_ofertas', JSON.stringify(todasAsOfertas));

  const historicoSalvo = localStorage.getItem('feiracircular_historico');
  let historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];
  
  historico.push({
    data: new Date().toLocaleString('pt-BR'),
    alimento: oferta.alimento,
    operacao: 'Venda com desconto',
    qtd: quantidadeReservada + ' kg',
    valor: formatarMoeda(quantidadeReservada * oferta.precoDesconto)
  });
  localStorage.setItem('feiracircular_historico', JSON.stringify(historico));

  alert(`✅ Sucesso!\nVocê reservou ${quantidadeReservada} kg de ${oferta.alimento}.\nTotal: ${formatarMoeda(quantidadeReservada * oferta.precoDesconto)}.`);
  renderizarOfertas(); 
}