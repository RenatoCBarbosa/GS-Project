document.addEventListener('DOMContentLoaded', () => {
  // 1. Pega o tipo de usuário logado (se não tiver, assume 'cliente')
  const tipoUsuario = localStorage.getItem('feiracircular_perfil') || 'cliente';
  
  // 2. Monta o Menu Dinâmico
  const menu = document.getElementById('menu-dinamico');
  let menuHTML = '';

  // Abas baseadas no perfil
  if (tipoUsuario === 'feirante') {
    menuHTML = `
      <a href="ofertas.html" class="nav__btn">Ofertas</a>
      <a href="cadastro.html" class="nav__btn">Anunciar</a>
      <a href="painel.html" class="nav__btn">Meu Painel</a>
      <a href="cadastro-usuario.html" class="nav__btn active">Meu Perfil</a>
    `;
  } else if (tipoUsuario === 'ong') {
    menuHTML = `
      <a href="doacoes.html" class="nav__btn">Doações</a>
      <a href="cadastro-usuario.html" class="nav__btn active">Meu Perfil</a>
    `;
  } else {
    // Cliente
    menuHTML = `
      <a href="ofertas.html" class="nav__btn">Ofertas</a>
      <a href="cadastro-usuario.html" class="nav__btn active">Meu Perfil</a>
    `;
  }
  
  // Adiciona um botão para Sair (voltar para a tela de seleção)
  menuHTML += `<a href="index.html" class="nav__btn" style="color: #c62828; border-color: #c62828;" onclick="localStorage.removeItem('feiracircular_perfil')">Sair</a>`;
  
  menu.innerHTML = menuHTML;

  // 3. Mostra os campos corretos no formulário
  const secaoFeirante = document.getElementById('secao-feirante');
  const secaoOng = document.getElementById('secao-ong');
  const subtitulo = document.getElementById('subtitulo-perfil');

  if (tipoUsuario === 'feirante') {
    secaoFeirante.style.display = 'block';
    subtitulo.textContent = 'Complete os dados do seu perfil de feirante.';
  } else if (tipoUsuario === 'ong') {
    secaoOng.style.display = 'block';
    subtitulo.textContent = 'Complete os dados da sua organização.';
  } else {
    subtitulo.textContent = 'Complete seus dados para fazer reservas.';
  }

  // 4. Salvar o formulário
  const form = document.getElementById('form-usuario');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('✅ Perfil salvo com sucesso!');
    // Aqui futuramente você pode salvar os dados no localStorage
  });
});