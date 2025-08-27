const ventanasAbiertas = {};
const infosAbiertas = {};

document.querySelectorAll('.icono').forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const idVentana = ['ventana-sobremi', 'ventana-proyectos', 'ventana-habilidades', 'ventana-contacto', 'ventana-blog'][index];
    if (!ventanasAbiertas[idVentana]) {
      const ventana = document.getElementById(idVentana);
      ventana.style.display = 'flex';
      ventana.classList.remove('abriendo');
      void ventana.offsetWidth; 
      ventana.classList.add('abriendo');
      ventanasAbiertas[idVentana] = true;


      if (idVentana === 'ventana-blog') {
        loadEmbeddedBlog();
      }
    }
  });
});


function loadEmbeddedBlog() {
  fetch('/blog/embedded/')
    .then(response => response.text())
    .then(html => {
      document.getElementById('blogContent').innerHTML = html;
      addEmbeddedBlogListeners();
    });
}


function addEmbeddedBlogListeners() {
  document.querySelectorAll('.read-more-btn').forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const slug = this.getAttribute('data-slug');
      fetch(`/blog/embedded/${slug}/`)
        .then(response => response.text())
        .then(html => {
          document.getElementById('blogContent').innerHTML = html;
          addEmbeddedBlogListeners();
        });
    });
  });
}


function cerrarVentana(id) {
  const ventana = document.getElementById(id);
  ventana.classList.remove('abriendo');
  ventana.classList.add('cerrando');
  
  setTimeout(() => {
    ventana.style.display = 'none';
    ventana.classList.remove('cerrando');
    delete ventanasAbiertas[id];
  }, 300);

}

const pista = document.querySelector('.carrusel-pista');
const flechaIzq = document.querySelector('.flecha-izq');
const flechaDer = document.querySelector('.flecha-der');

if (pista && flechaIzq && flechaDer) {
    const cuadrados = pista.querySelectorAll('.cuadrados');
    const totalCuadrados = cuadrados.length;
    let anchoCuadrado = 260; 
    const gap = 30;
    let cuadradosPorVista = 3;

    let indiceActual = 0;

    function actualizarDimensiones() {
      if (window.innerWidth <= 768 && window.innerWidth > 480) {
        cuadradosPorVista = 2;
        anchoCuadrado = 220;
      } else if (window.innerWidth <= 480) {
        cuadradosPorVista = 1;
        anchoCuadrado = 200;
      } else {
        cuadradosPorVista = 3;
        anchoCuadrado = 260;
      }
    }


    function actualizarCarrusel() {

        if (window.innerWidth > 768) {
            if (indiceActual > totalCuadrados - cuadradosPorVista) {
                indiceActual = 0;
            }
            if (indiceActual < 0) {
                indiceActual = totalCuadrados - cuadradosPorVista;
            }
            const desplazamiento = -(indiceActual * (anchoCuadrado + gap));
            pista.style.transform = `translateX(${desplazamiento}px)`;
        } else {

            pista.style.transform = 'none';
        }
    }

    function moverDerecha() {
        indiceActual++;
        if (indiceActual > totalCuadrados - cuadradosPorVista) {
            indiceActual = 0;
        }
        actualizarCarrusel();
    }

    function moverIzquierda() {
        indiceActual--;
        if (indiceActual < 0) {
            indiceActual = totalCuadrados - cuadradosPorVista;
        }
        actualizarCarrusel();
    }

    flechaDer.addEventListener('click', moverDerecha);
    flechaIzq.addEventListener('click', moverIzquierda);

    window.addEventListener('resize', () => {
      actualizarDimensiones();
      actualizarCarrusel();
    });

    document.addEventListener('keydown', (e) => {
        const proyectosVentana = document.getElementById('ventana-proyectos');
        if (proyectosVentana && proyectosVentana.style.display === 'flex') {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                moverDerecha();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                moverIzquierda();
            }
        }
    });

    actualizarDimensiones();
    actualizarCarrusel();
}





document.querySelectorAll('.boton-repo.info').forEach((btn, index) => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); 
    const IdInfo = ['ventanaInfo-portfolio', 'ventanaInfo-calculadora', 'ventanaInfo-preguntados', 'ventanaInfo-space', 'ventanaInfo-photoshop'][index];
    if (!infosAbiertas[IdInfo]) {
      const ventana_info = document.getElementById(IdInfo);
      ventana_info.style.display = 'block';
      ventana_info.classList.remove('abriendo');
      void ventana_info.offsetWidth; 
      ventana_info.classList.add('abriendo');
      infosAbiertas[IdInfo] = true;
    }
  });
});

function cerrarVentanaInfo(id) {
  const ventana_info = document.getElementById(id);
  ventana_info.classList.remove('abriendo');
  setTimeout(() => {
    ventana_info.style.display = 'none';
    delete infosAbiertas[id];
  }, 300);
}


document.addEventListener('click', (e) => {
  const ventanasInfo = document.querySelectorAll('[id^="ventanaInfo-"]');
  ventanasInfo.forEach(ventana => {
    if (ventana.style.display === 'block') {
      if (!ventana.contains(e.target) && !e.target.closest('.boton-repo.info')) {
        e.stopPropagation();
        cerrarVentanaInfo(ventana.id);
      }
    }
  });
});

function openBlogModal() {
  document.getElementById('blogModal').style.display = 'block';
  fetch('/blog/') 
    .then(response => response.text())
    .then(html => {
      document.getElementById('blogContent').innerHTML = html;
      addBlogLinksListeners();
    });
}

function closeBlogModal() {
  document.getElementById('blogModal').style.display = 'none';
}


function addBlogLinksListeners() {
  document.querySelectorAll('#blogContent a.btn-dark').forEach(link => {
    link.onclick = function(e) {
      e.preventDefault();
      fetch(this.href)
        .then(response => response.text())
        .then(html => {
          document.getElementById('blogContent').innerHTML = html;
          addBlogLinksListeners();
        });
    };
  });
}


