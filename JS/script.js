/* =========================================================
   FeiraCircular — Lógica do Front-End
   Persistência via localStorage (simula banco de dados)
   ========================================================= */

const STORAGE_KEY = 'feiracircular_ofertas';
const HIST_KEY    = 'feiracircular_historico';

/* ---------- ESTADO ---------- */
let ofertas    = carregar(STORAGE_KEY);
let historico  = carregar(HIST_KEY);

/* ---------- UTILITÁRIOS ---------- */
function carregar(chave) {
  try { return JSON.parse(localStorage.getItem(chave)) || []; }
  catch { return []; }
}
function salvar() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ofertas));
  localStorage.setItem(HIST_KEY, JSON.stringify(historico));
}
function formatarMoeda(v) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
function agora() {
  return new Date().toLocaleString('pt-BR');
}
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ---------- NAVEGAÇÃO DE ABAS ---------- */
document.querySelectorAll('.nav__btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.nav__btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ---------- CADASTRO DE EXCEDENTE ---------- */
const form = document.getElementById('form-cadastro');
form.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(form);

  const oferta = {
    id: Date.now(),
    barraca: fd.get('barraca').trim(),
    local: fd.get('local').trim(),
    alimento: fd.get('alimento').trim(),
    quantidade: parseFloat(fd.get('quantidade')),
    precoOriginal: parseFloat(fd.get('precoOriginal')) || 0,
    precoDesconto: parseFloat(fd.get('precoDesconto')) || 0,
    tipo: fd.get('tipo'),
    horario: fd.get('horario'),
    criadoEm: agora()
  };

  // Validações de negócio
  if (oferta.tipo !== 'doacao' && oferta.precoDesconto >= oferta.precoOriginal) {
    toast('⚠️ O preço com desconto deve ser menor que o original.');
    return;
  }
  if (oferta.tipo === 'doacao') oferta.precoDesconto = 0;

  ofertas.push(oferta);
  salvar();
  form.reset();
  renderizarTudo();
  toast('✅ Excedente cadastrado com sucesso!');
});

/* ---------- RENDERIZAÇÃO DAS OFERTAS ---------- */
function renderizarOfertas() {
  const lista = document.getElementById('lista-ofertas');
  const vazio = document.getElementById('msg-vazio');
  const busca = document.getElementById('filtro-busca').value.toLowerCase();
  const tipo  = document.getElementById('filtro-tipo').value;

  const filtradas = ofertas.filter(o => {
    const okBusca = o.alimento.toLowerCase().includes(busca) ||
                    o.barraca.toLowerCase().includes(busca);
    const okTipo =
      tipo === 'todos' ? true :
      tipo === 'venda' ? (o.tipo === 'venda' || o.tipo === 'ambos') :
      /* doacao */       (o.tipo === 'doacao' || o.tipo === 'ambos');
    return okBusca && okTipo && o.quantidade > 0;
  });

  lista.innerHTML = '';
  vazio.style.display = filtradas.length ? 'none' : 'block';

  filtradas.forEach(o => {
    const card = document.createElement('div');
    const ehDoacao = (o.tipo === 'doacao');
    card.className = 'card-oferta' + (ehDoacao ? ' doacao' : '');

    const tagTexto =
      o.tipo === 'ambos' ? 'Venda e Doação' :
      o.tipo === 'venda' ? 'Venda com desconto' : 'Doação';

    card.innerHTML = `
      <span class="tag">${tagTexto}</span>
      <h3>${o.alimento}</h3>
      <small>${o.barraca} · ${o.local}</small>
      <small>Disponível: <strong>${o.quantidade} kg</strong> · até ${o.horario}</small>
      ${
        o.tipo !== 'doacao'
          ? `<div class="preco">
               <span class="riscado">${formatarMoeda(o.precoOriginal)}</span>
               <span class="novo">${formatarMoeda(o.precoDesconto)}</span>
             </div>`
          : `<div class="preco"><span class="novo">Gratuito</span></div>`
      }
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        ${o.tipo !== 'doacao' ? `<button class="btn btn--small btn--reserva" data-acao="reservar" data-id="${o.id}">Reservar</button>` : ''}
        ${o.tipo !== 'venda'  ? `<button class="btn btn--small btn--doar" data-acao="doar" data-id="${o.id}">Solicitar doação</button>` : ''}
      </div>
    `;
    lista.appendChild(card);
  });
}

/* ---------- AÇÕES (RESERVA / DOAÇÃO) ---------- */
document.getElementById('lista-ofertas').addEventListener('click', e => {
  const btn = e.target.closest('button[data-acao]');
  if (!btn) return;

  const id = Number(btn.dataset.id);
  const oferta = ofertas.find(o => o.id === id);
  if (!oferta) return;

  const acao = btn.dataset.acao;

  if (acao === 'reservar') {
    const qtd = prompt(`Quantos kg de ${oferta.alimento} deseja reservar? (máx: ${oferta.quantidade})`);
    const num = parseFloat(qtd);
    if (!num || num <= 0) return;
    if (num > oferta.quantidade) { toast('⚠️ Quantidade maior que a disponível.'); return; }

    oferta.quantidade -= num;
    historico.push({
      data: agora(),
      alimento: oferta.alimento,
      operacao: 'Venda com desconto',
      qtd: num + ' kg',
      valor: formatarMoeda(num * oferta.precoDesconto)
    });
    salvar();
    renderizarTudo();
    toast(`🛒 Reserva de ${num} kg confirmada!`);
  }

  if (acao === 'doar') {
    const qtd = prompt(`Quantos kg de ${oferta.alimento} a organização deseja solicitar? (máx: ${oferta.quantidade})`);
    const num = parseFloat(qtd);
    if (!num || num <= 0) return;
    if (num > oferta.quantidade) { toast('⚠️ Quantidade maior que a disponível.'); return; }

    oferta.quantidade -= num;
    historico.push({
      data: agora(),
      alimento: oferta.alimento,
      operacao: 'Doação',
      qtd: num + ' kg',
      valor: '—'
    });
    salvar();
    renderizarTudo();
    toast(`🤝 Doação de ${num} kg registrada!`);
  }
});

/* ---------- PAINEL / HISTÓRICO ---------- */
function renderizarPainel() {
  const totalCadastrados = ofertas.length;
  const vendas = historico.filter(h => h.operacao === 'Venda com desconto');
  const doacoes = historico.filter(h => h.operacao === 'Doação');

  const receita = vendas.reduce((acc, h) => {
    const num = parseFloat(h.valor.replace(/[^\d,]/g, '').replace(',', '.')) || 0;
    return acc + num;
  }, 0);

  document.getElementById('stat-cadastrados').textContent = totalCadastrados;
  document.getElementById('stat-vendidos').textContent = vendas.length;
  document.getElementById('stat-doados').textContent = doacoes.length;
  document.getElementById('stat-receita').textContent = formatarMoeda(receita);

  const tbody = document.getElementById('tabela-historico');
  tbody.innerHTML = '';
  historico.slice().reverse().forEach(h => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${h.data}</td>
      <td>${h.alimento}</td>
      <td>${h.operacao}</td>
      <td>${h.qtd}</td>
      <td>${h.valor}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ---------- RENDER GERAL ---------- */
function renderizarTudo() {
  renderizarOfertas();
  renderizarPainel();
}

/* ---------- FILTROS ---------- */
document.getElementById('filtro-busca').addEventListener('input', renderizarOfertas);
document.getElementById('filtro-tipo').addEventListener('change', renderizarOfertas);

/* ---------- INICIALIZAÇÃO + SEED ---------- */
(function seed() {
  if (ofertas.length === 0) {
    ofertas.push({
      id: 1,
      barraca: 'Barraca do Zé',
      local: 'Feira da Vila Mariana',
      alimento: 'Tomate',
      quantidade: 20,
      precoOriginal: 8.0,
      precoDesconto: 5.0,
      tipo: 'ambos',
      horario: '14:00',
      criadoEm: agora()
    });
    ofertas.push({
      id: 2,
      barraca: 'Horta da Dona Maria',
      local: 'Feira do Ipiranga',
      alimento: 'Banana',
      quantidade: 15,
      precoOriginal: 6.0,
      precoDesconto: 3.5,
      tipo: 'venda',
      horario: '13:30',
      criadoEm: agora()
    });
    ofertas.push({
      id: 3,
      barraca: 'Verduras São Paulo',
      local: 'Feira da Lapa',
      alimento: 'Couve',
      quantidade: 10,
      precoOriginal: 4.0,
      precoDesconto: 0,
      tipo: 'doacao',
      horario: '12:00',
      criadoEm: agora()
    });
    salvar();
  }
  renderizarTudo();
})();