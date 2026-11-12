const feiras = [
  {
    nome: 'Feira da Vila Mariana',
    endereco: 'Rua Domingos de Morais, 1500 — Vila Mariana, São Paulo',
    latitude: -23.5891,
    longitude: -46.6368
  },
  {
    nome: 'Feira do Ipiranga',
    endereco: 'Rua Silva Bueno, 800 — Ipiranga, São Paulo',
    latitude: -23.5928,
    longitude: -46.6062
  }
];

let localizacaoUsuario = null;

function calcularDistanciaKm(origem, destino) {
  const radianos = valor => valor * Math.PI / 180;
  const deltaLatitude = radianos(destino.latitude - origem.latitude);
  const deltaLongitude = radianos(destino.longitude - origem.longitude);
  const a = Math.sin(deltaLatitude / 2) ** 2
    + Math.cos(radianos(origem.latitude))
    * Math.cos(radianos(destino.latitude))
    * Math.sin(deltaLongitude / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function renderizarFeiras() {
  const container = document.getElementById('lista-feiras');
  const feirasOrdenadas = feiras
    .map(feira => ({
      ...feira,
      distancia: localizacaoUsuario ? calcularDistanciaKm(localizacaoUsuario, feira) : null
    }))
    .sort((a, b) => {
      if (a.distancia === null || b.distancia === null) return 0;
      return a.distancia - b.distancia;
    });

  container.replaceChildren();

  feirasOrdenadas.forEach(feira => {
    const card = document.createElement('article');
    card.className = 'card-feira';

    const titulo = document.createElement('h2');
    titulo.textContent = feira.nome;

    const endereco = document.createElement('p');
    endereco.textContent = feira.endereco;

    const distancia = document.createElement('p');
    distancia.className = 'distancia';
    distancia.textContent = feira.distancia === null
      ? 'Distância disponível após ativar a localização'
      : `${feira.distancia.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} km de distância aproximada`;

    const referencia = document.createElement('p');
    referencia.className = 'referencia';
    referencia.textContent = 'Ponto de referência aproximado; confirme endereço e horário antes de sair.';

    const linkMapa = document.createElement('a');
    linkMapa.className = 'btn';
    linkMapa.href = `https://www.openstreetmap.org/?mlat=${feira.latitude}&mlon=${feira.longitude}#map=16/${feira.latitude}/${feira.longitude}`;
    linkMapa.target = '_blank';
    linkMapa.rel = 'noopener noreferrer';
    linkMapa.textContent = 'Abrir no mapa';

    if (localizacaoUsuario) {
      linkMapa.href = `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${localizacaoUsuario.latitude}%2C${localizacaoUsuario.longitude}%3B${feira.latitude}%2C${feira.longitude}`;
      linkMapa.textContent = 'Ver rota';
    }

    card.append(titulo, endereco, distancia, referencia, linkMapa);
    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  montarMenu('localizador');
  renderizarFeiras();

  document.getElementById('btn-localizacao').addEventListener('click', () => {
    const status = document.getElementById('localizador-status');
    if (!navigator.geolocation) {
      status.textContent = 'Este navegador não oferece suporte à localização.';
      return;
    }

    status.textContent = 'Buscando sua localização...';
    navigator.geolocation.getCurrentPosition(
      position => {
        localizacaoUsuario = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };
        status.textContent = 'Feiras ordenadas pela distância aproximada da sua localização.';
        renderizarFeiras();
      },
      error => {
        const mensagens = {
          1: 'Permissão de localização negada. Autorize o acesso no navegador para ver as distâncias.',
          2: 'Não foi possível determinar sua localização. Tente novamente em um local com sinal.',
          3: 'A busca pela localização demorou demais. Tente novamente.'
        };
        status.textContent = mensagens[error.code] || 'Ocorreu um erro ao buscar sua localização.';
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  });
});
