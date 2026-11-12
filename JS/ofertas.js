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
    const desconto = oferta.precoOriginal > 0
      ? Math.round(((oferta.precoOriginal - oferta.precoDesconto) / oferta.precoOriginal) * 100)
      : 0;
    const card = document.createElement('div');
    card.className = 'card-oferta';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'card-header';
    const selo = document.createElement('span');
    selo.className = 'tag';
    selo.textContent = `${desconto}% OFF`;
    const estoque = document.createElement('span');
    estoque.className = 'estoque';
    estoque.textContent = `Restam ${oferta.quantidade} kg`;
    cabecalho.append(selo, estoque);

    const alimento = document.createElement('h3');
    alimento.textContent = oferta.alimento;
    const local = document.createElement('small');
    local.textContent = `${oferta.barraca} - ${oferta.local}`;

    const preco = document.createElement('div');
    preco.className = 'preco';
    const precoOriginal = document.createElement('span');
    precoOriginal.className = 'riscado';
    precoOriginal.textContent = formatarMoeda(oferta.precoOriginal);
    const precoDesconto = document.createElement('span');
    precoDesconto.className = 'novo';
    precoDesconto.textContent = `${formatarMoeda(oferta.precoDesconto)} /kg`;
    preco.append(precoOriginal, precoDesconto);

    const formularioReserva = document.createElement('form');
    formularioReserva.className = 'quantidade-form';
    const rotuloQuantidade = document.createElement('label');
    rotuloQuantidade.textContent = 'Quantidade para reservar (kg)';
    const campoQuantidade = document.createElement('input');
    campoQuantidade.type = 'number';
    campoQuantidade.min = '0.1';
    campoQuantidade.step = '0.1';
    campoQuantidade.max = String(oferta.quantidade);
    campoQuantidade.required = true;
    campoQuantidade.placeholder = 'Ex.: 2';
    rotuloQuantidade.appendChild(campoQuantidade);

    const botao = document.createElement('button');
    botao.type = 'submit';
    botao.className = 'btn';
    if (perfil === 'feirante') {
      botao.disabled = true;
      botao.textContent = 'Seu anúncio ativo';
      campoQuantidade.disabled = true;
    } else if (perfil === 'ong') {
      botao.disabled = true;
      botao.textContent = 'Exclusivo para consumidores';
      campoQuantidade.disabled = true;
    } else {
      botao.classList.add('btn--primary');
      botao.textContent = 'Reservar agora';
    }
    formularioReserva.addEventListener('submit', evento => {
      evento.preventDefault();
      fazerReserva(oferta.id, Number(campoQuantidade.value));
    });
    formularioReserva.append(rotuloQuantidade, botao);

    card.append(cabecalho, alimento, local, preco, formularioReserva);
    container.appendChild(card);
  });
}

function fazerReserva(idOferta, quantidadeReservada) {
  const oferta = todasAsOfertas.find(o => o.id === idOferta);
  if (!oferta) return;

  if (!Number.isFinite(quantidadeReservada) || quantidadeReservada <= 0) {
    alert("Digite uma quantidade válida.");
    return;
  }
  if (quantidadeReservada > oferta.quantidade) {
    alert(`Só temos ${oferta.quantidade} kg disponíveis.`);
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

  const reservasSalvas = localStorage.getItem('feiracircular_minhas_reservas');
  const reservas = reservasSalvas ? JSON.parse(reservasSalvas) : [];
  reservas.push({
    tipo: 'reserva',
    data: new Date().toLocaleString('pt-BR'),
    alimento: oferta.alimento,
    barraca: oferta.barraca,
    local: oferta.local,
    qtd: quantidadeReservada,
    valor: quantidadeReservada * oferta.precoDesconto,
    status: 'Reservada'
  });
  localStorage.setItem('feiracircular_minhas_reservas', JSON.stringify(reservas));

  alert(`Sucesso!\nVocê reservou ${quantidadeReservada} kg de ${oferta.alimento}.\nTotal: ${formatarMoeda(quantidadeReservada * oferta.precoDesconto)}.`);
  renderizarOfertas(); 
}