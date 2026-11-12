document.addEventListener('DOMContentLoaded', () => {
  // Monta o menu (a função vem do auth.js)
  montarMenu('cadastro');

  const form = document.getElementById('form-cadastro');
  if (!form) return; // Segurança caso o HTML esteja errado

  const selectTipo = document.getElementById('select-tipo');
  const inputPrecoDesconto = document.querySelector('input[name="precoDesconto"]');

  // Regra de UX: Desativa o preço se for doação
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

  // Ação de Salvar
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const tipo = formData.get('tipo');
    const precoOriginal = parseFloat(formData.get('precoOriginal')) || 0;
    let precoDesconto = parseFloat(formData.get('precoDesconto')) || 0;

    if (tipo !== 'doacao' && precoDesconto >= precoOriginal) {
      alert('O preço com desconto deve ser menor que o preço original.');
      return;
    }
    if (tipo === 'doacao') precoDesconto = 0;

    const novaOferta = {
      id: Date.now(),
      barraca: formData.get('barraca').trim(),
      local: formData.get('local').trim(),
      alimento: formData.get('alimento').trim(),
      quantidade: parseFloat(formData.get('quantidade')),
      precoOriginal: precoOriginal,
      precoDesconto: precoDesconto,
      tipo: tipo,
      horario: formData.get('horario')
    };

    const dadosSalvos = localStorage.getItem('feiracircular_ofertas');
    let todasAsOfertas = dadosSalvos ? JSON.parse(dadosSalvos) : [];
    
    todasAsOfertas.push(novaOferta);
    localStorage.setItem('feiracircular_ofertas', JSON.stringify(todasAsOfertas));

    alert(`Anúncio publicado.\nO alimento "${novaOferta.alimento}" foi cadastrado.`);
    
    form.reset();
    inputPrecoDesconto.disabled = false;
    inputPrecoDesconto.placeholder = 'Ex.: 4.00';
  });
});