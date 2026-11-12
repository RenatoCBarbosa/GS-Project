// Mostra reservas de consumidores ou solicitações de doação de ONGs.
document.addEventListener('DOMContentLoaded', () => {
  // O mesmo HTML serve aos dois perfis; os títulos mudam conforme a pessoa.
  const perfil = localStorage.getItem('feiracircular_perfil') || 'cliente';
  const ehOng = perfil === 'ong';
  montarMenu('painel-usuario');

  document.getElementById('titulo-painel').textContent = ehOng
    ? 'Painel da organização'
    : 'Meu histórico';
  document.getElementById('descricao-painel').textContent = ehOng
    ? 'Acompanhe as solicitações de doação feitas pela sua organização.'
    : 'Acompanhe suas reservas de alimentos nas feiras.';
  document.getElementById('titulo-historico').textContent = ehOng
    ? 'Doações solicitadas'
    : 'Minhas reservas';

  // Mantém apenas o tipo de registro que pertence ao perfil atual.
  const dadosSalvos = localStorage.getItem('feiracircular_minhas_reservas');
  const registros = dadosSalvos ? JSON.parse(dadosSalvos) : [];
  const tipoEsperado = ehOng ? 'doacao' : 'reserva';
  const registrosDoPerfil = registros.filter(registro =>
    registro.tipo ? registro.tipo === tipoEsperado : !ehOng
  );
  // Os dados antigos podem conter quantidade como número ou como texto.
  const lerQuantidade = registro => {
    const quantidade = Number.parseFloat(String(registro.qtd).replace(',', '.'));
    return Number.isFinite(quantidade) ? quantidade : 0;
  };
  const totalKg = registrosDoPerfil.reduce((total, registro) => {
    const quantidade = lerQuantidade(registro);
    return total + quantidade;
  }, 0);

  // Monta os cartões de resumo sem precisar manter totais separados.
  const resumo = document.getElementById('resumo-painel');
  const cards = [
    [ehOng ? 'Solicitações registradas' : 'Reservas realizadas', registrosDoPerfil.length],
    [ehOng ? 'Alimentos solicitados' : 'Quantidade reservada', `${totalKg.toLocaleString('pt-BR')} kg`]
  ];

  cards.forEach(([rotulo, valor]) => {
    const card = document.createElement('article');
    card.className = 'card-resumo';
    const titulo = document.createElement('h2');
    titulo.textContent = rotulo;
    const destaque = document.createElement('strong');
    destaque.textContent = String(valor);
    card.append(titulo, destaque);
    resumo.appendChild(card);
  });

  // Se não houver atividade, mostra uma explicação em vez de uma tabela vazia.
  const corpo = document.getElementById('corpo-historico');
  if (registrosDoPerfil.length === 0) {
    const linha = document.createElement('tr');
    const celula = document.createElement('td');
    celula.colSpan = 5;
    celula.textContent = ehOng
      ? 'Sua organização ainda não solicitou doações.'
      : 'Você ainda não fez nenhuma reserva.';
    linha.appendChild(celula);
    corpo.appendChild(linha);
    return;
  }

  registrosDoPerfil.slice().reverse().forEach(registro => {
    const linha = document.createElement('tr');
    const valores = [
      registro.data || '—',
      registro.alimento || '—',
      [registro.local, registro.barraca].filter(Boolean).join(' — ') || '—',
      `${lerQuantidade(registro).toLocaleString('pt-BR')} kg`,
      registro.status || 'Confirmada'
    ];

    valores.forEach((valor, indice) => {
      const celula = document.createElement('td');
      if (indice === 1) {
        const alimento = document.createElement('strong');
        alimento.textContent = valor;
        celula.appendChild(alimento);
      } else {
        celula.textContent = valor;
      }
      linha.appendChild(celula);
    });
    corpo.appendChild(linha);
  });
});
