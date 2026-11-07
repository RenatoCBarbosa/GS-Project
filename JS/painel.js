document.addEventListener('DOMContentLoaded', () => {
  montarMenu('painel');

  const historicoSalvo = localStorage.getItem('feiracircular_historico');
  let historico = historicoSalvo ? JSON.parse(historicoSalvo) : [];

  let receitaTotal = 0;
  let kgDoados = 0;
  const corpoTabela = document.getElementById('corpo-tabela');
  
  if (corpoTabela) {
    corpoTabela.innerHTML = '';

    if (historico.length === 0) {
      corpoTabela.innerHTML = `<tr><td colspan="5" style="text-align:center; color:#888;">Nenhuma movimentação registrada ainda.</td></tr>`;
    } else {
      historico.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.data}</td>
          <td><strong>${item.alimento}</strong></td>
          <td>${item.operacao}</td>
          <td>${item.qtd}</td>
          <td>${item.valor}</td>
        `;
        corpoTabela.appendChild(tr);

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