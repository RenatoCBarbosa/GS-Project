document.addEventListener('DOMContentLoaded', () => {
  const tipoUsuario = localStorage.getItem('feiracircular_perfil') || 'cliente';
  montarMenu('perfil');

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

  const form = document.getElementById('form-usuario');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const dados = Object.fromEntries(new FormData(form));
    delete dados.senha;
    localStorage.setItem('feiracircular_dados_perfil', JSON.stringify(dados));
    alert('Perfil salvo neste navegador. A senha não é armazenada.');
  });
});