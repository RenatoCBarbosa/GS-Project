// Mostra as ofertas destinadas à doação e registra as solicitações feitas por ONGs.
let todasAsOfertas = [];

document.addEventListener('DOMContentLoaded', () => {
  montarMenu('doacoes');
  
  // Nesta demonstração, o perfil apenas ativa ou desativa o botão; não é autenticação real.
  const perfil = localStorage.getItem('feiracircular_perfil') || 'cliente';

  // Lê ofertas e preenche o filtro com as feiras que realmente têm anúncios.
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
  // Exibe somente doações com estoque que correspondam à busca e à feira escolhida.
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

  // O botão de solicitar fica ativo para ONG; nos demais perfis é apenas informativo.
  doacoesFiltradas.forEach(oferta => {
    const card = document.createElement('div');
    card.className = 'card-oferta';

    const cabecalho = document.createElement('div');
    cabecalho.className = 'card-header';
    const selo = document.createElement('span');
    selo.className = 'tag';
    selo.textContent = 'Doação';
    const estoque = document.createElement('span');
    estoque.className = 'estoque';
    estoque.textContent = `Disponível: ${oferta.quantidade} kg`;
    cabecalho.append(selo, estoque);

    const alimento = document.createElement('h3');
    alimento.textContent = oferta.alimento;
    const local = document.createElement('small');
    local.textContent = `${oferta.barraca} - ${oferta.local}`;
    const preco = document.createElement('div');
    preco.className = 'preco';
    const gratuito = document.createElement('span');
    gratuito.className = 'novo';
    gratuito.textContent = 'Gratuito';
    preco.appendChild(gratuito);

    const formularioDoacao = document.createElement('form');
    formularioDoacao.className = 'quantidade-form';
    const rotuloQuantidade = document.createElement('label');
    rotuloQuantidade.textContent = 'Quantidade para solicitar (kg)';
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
    if (perfil === 'ong') {
      botao.classList.add('btn--doar');
      botao.textContent = 'Solicitar doação';
    } else {
      botao.disabled = true;
      botao.textContent = 'Apenas ONGs podem solicitar';
      campoQuantidade.disabled = true;
    }
    formularioDoacao.addEventListener('submit', evento => {
      evento.preventDefault();
      solicitarDoacao(oferta.id, Number(campoQuantidade.value));
    });
    formularioDoacao.append(rotuloQuantidade, botao);

    card.append(cabecalho, alimento, local, preco, formularioDoacao);
    container.appendChild(card);
  });
}

function solicitarDoacao(idOferta, quantidadeSolicitada) {
  // Confere se existe estoque suficiente antes de confirmar a solicitação.
  const oferta = todasAsOfertas.find(o => o.id === idOferta);
  if (!oferta) return;

  if (!Number.isFinite(quantidadeSolicitada) || quantidadeSolicitada <= 0) {
    alert("Digite uma quantidade válida.");
    return;
  }
  if (quantidadeSolicitada > oferta.quantidade) {
    alert(`Desculpe, o feirante só tem ${oferta.quantidade} kg disponíveis.`);
    return;
  }

  // Salva o novo estoque e registra a solicitação para os painéis e históricos.
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

  const reservasSalvas = localStorage.getItem('feiracircular_minhas_reservas');
  const reservas = reservasSalvas ? JSON.parse(reservasSalvas) : [];
  reservas.push({
    tipo: 'doacao',
    data: new Date().toLocaleString('pt-BR'),
    alimento: oferta.alimento,
    barraca: oferta.barraca,
    local: oferta.local,
    qtd: quantidadeSolicitada,
    valor: 0,
    status: 'Solicitada'
  });
  localStorage.setItem('feiracircular_minhas_reservas', JSON.stringify(reservas));

  alert(`Solicitação confirmada!\nSua organização solicitou ${quantidadeSolicitada} kg de ${oferta.alimento}.`);
  renderizarDoacoes(); 
}