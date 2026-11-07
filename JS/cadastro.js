document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-cadastro');
  const selectTipo = document.getElementById('select-tipo');
  const inputPrecoDesconto = document.querySelector('input[name="precoDesconto"]');

  // Regra de UX: Se o feirante escolher APENAS DOAÇÃO, o campo de preço desconto é desativado
  selectTipo.addEventListener('change', (e) => {
    if (e.target.value === 'doacao') {
      inputPrecoDesconto.value = '';
      inputPrecoDesconto.disabled = true;
      inputPrecoDesconto.placeholder = 'Não se aplica para doação';
    } else {
      inputPrecoDesconto.disabled = false;
      inputPrecoDesconto.placeholder = 'Ex.: 4.00';
    }
  });

  // Quando o formulário for enviado
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Pega os dados digitados
    const formData = new FormData(form);
    const tipo = formData.get('tipo');
    
    // Converte os valores para números (ou 0 se estiver vazio)
    const precoOriginal = parseFloat(formData.get('precoOriginal')) || 0;
    let precoDesconto = parseFloat(formData.get('precoDesconto')) || 0;

    // Validação de segurança
    if (tipo !== 'doacao' && precoDesconto >= precoOriginal) {
      alert('⚠️ O preço com desconto deve ser menor que o preço original.');
      return;
    }

    // Se for doação, o preço é zero
    if (tipo === 'doacao') precoDesconto = 0;

    // Monta o objeto da nova oferta
    const novaOferta = {
      id: Date.now(), // Gera um ID único baseado no milissegundo atual
      barraca: formData.get('barraca').trim(),
      local: formData.get('local').trim(),
      alimento: formData.get('alimento').trim(),
      quantidade: parseFloat(formData.get('quantidade')),
      precoOriginal: precoOriginal,
      precoDesconto: precoDesconto,
      tipo: tipo,
      horario: formData.get('horario')
    };

    // Pega os dados antigos do localStorage (se existirem)
    const dadosSalvos = localStorage.getItem('feiracircular_ofertas');
    let todasAsOfertas = dadosSalvos ? JSON.parse(dadosSalvos) : [];

    // Adiciona a nova oferta na lista
    todasAsOfertas.push(novaOferta);

    // Salva de volta no localStorage
    localStorage.setItem('feiracircular_ofertas', JSON.stringify(todasAsOfertas));

    // Feedback para o usuário
    alert(`✅ Sucesso!\nO alimento "${novaOferta.alimento}" foi cadastrado e já está visível nas abas de Ofertas e Doações.`);
    
    // Limpa o formulário para o feirante cadastrar outro, se quiser
    form.reset();
    
    // Reseta o campo de preço desconto (por causa da regra de desativar em doações)
    inputPrecoDesconto.disabled = false;
    inputPrecoDesconto.placeholder = 'Ex.: 4.00';
  });
});