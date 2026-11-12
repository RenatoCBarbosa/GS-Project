// Calcula os resultados do feirante e mostra cada venda ou doação registrada.
document.addEventListener('DOMContentLoaded', () => {
  montarMenu('painel');

  // Carrega do navegador o histórico compartilhado pelas operações da demonstração.
  const historicoSalvo = localStorage.getItem('feiracircular_historico');
  let historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];

  let receitaTotal = 0;
  let kgDoados = 0;
  const corpoTabela = document.getElementById('corpo-tabela');
  
  // Percorre o histórico para preencher a tabela e somar receita e quilos doados.
  if (corpoTabela) {
    corpoTabela.innerHTML = '';

    if (historico.length === 0) {
      const linha = document.createElement('tr');
      const celula = document.createElement('td');
      celula.colSpan = 5;
      celula.textContent = 'Nenhuma movimentação registrada ainda.';
      linha.appendChild(celula);
      corpoTabela.appendChild(linha);
    } else {
      historico.forEach(item => {
        const tr = document.createElement('tr');
        [item.data, item.alimento, item.operacao, item.qtd, item.valor].forEach((valor, indice) => {
          const celula = document.createElement('td');
          if (indice === 1) {
            const alimento = document.createElement('strong');
            alimento.textContent = valor;
            celula.appendChild(alimento);
          } else {
            celula.textContent = valor;
          }
          tr.appendChild(celula);
        });
        corpoTabela.appendChild(tr);

        // Converte os valores que já estão formatados em texto para poder somá-los.
        if (item.operacao === 'Venda com desconto') {
          const valorLimpo = item.valor.replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
          const valorNumerico = parseFloat(valorLimpo);
          if (!isNaN(valorNumerico)) {
            receitaTotal += valorNumerico;
          }
        } else if (item.operacao === 'Doação') {
          const qtdLimpa = item.qtd.replace('kg', '').replace(',', '.').trim();
          const qtdNumerica = parseFloat(qtdLimpa);
          if (!isNaN(qtdNumerica)) {
            kgDoados += qtdNumerica;
          }
        }
      });
    }
  }

  document.getElementById('res-receita').textContent = receitaTotal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  document.getElementById('res-doacoes').textContent = kgDoados + ' kg';
  document.getElementById('res-descarte').textContent = '0 kg';
});