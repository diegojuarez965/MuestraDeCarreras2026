const CANT_POR_PAGINA = 5; // Cantidad de resultados por página
let resultadosFiltrados = []; // Array que contiene los resultados filtrados
let paginaActual = 1; // Página actual

// URL codificada en Base64 para evitar lectura en texto plano
const _URL_ENC = "aHR0cHM6Ly9zY3JpcHQuZ29vZ2xlLmNvbS9tYWNyb3Mvcy9BS2Z5Y2J6Qk50NThrTUFBVUt4UUZPdDBYU0Q5a2pNUW9nQlpXNUgzckk1U1dpUWY3bnRHY2pzVUIxUGp3WXZPYnJlSWlPQ2gvZXhlYw==";
// Clave de sitio pública para Google reCAPTCHA v3
const RECAPTCHA_SITE_KEY = "6Ldys4ItAAAAAFLVVuu44RlKEnhTO1NaVr_qtP6t";

// Función para enviar los filtros y el resultado de la búsqueda a Google Sheets junto con el token de reCAPTCHA
function enviarLogAGoogleSheets(filtros, resultadosEncontrados, recaptchaToken) {
  try {
    const url = atob(_URL_ENC);

    const payload = {
      recaptchaToken: recaptchaToken,
      institucion: filtros.institucion || "Cualquiera",
      area: filtros.area || "Cualquiera",
      modalidad: filtros.modalidad || "Cualquiera",
      duracion: filtros.duracion || "Cualquiera",
      localidad: filtros.localidad || "Cualquiera",
      arancelada: filtros.arancelada || "Cualquiera",
      resultadosEncontrados: resultadosEncontrados
    };

    // Se envía como text/plain en modo no-cors para evitar problemas de preflight CORS en el navegador
    fetch(url, {
      method: "POST",
      mode: "cors",
      headers: {
        "Content-Type": "text/plain"
      },
      body: JSON.stringify(payload)
    })
      .then(() => {
        console.log("Log de búsqueda enviado con éxito a Google Sheets (protegido por reCAPTCHA v3).");
      })
      .catch((error) => {
        console.error("Error al enviar el log de búsqueda:", error);
      });
  } catch (e) {
    console.error("Error al decodificar o enviar logs:", e);
  }
}

// Función que se ejecuta para buscar propuestas
function buscar() {
  const institucion = document.getElementById("institucion").value;
  const area = document.getElementById("area").value;
  const modalidad = document.getElementById("modalidad").value;
  const duracion = document.getElementById("duracion").value;
  const localidad = document.getElementById("localidad").value;
  const arancelada = document.getElementById("arancelada").value;
  // Filtrar las propuestas según los criterios seleccionados
  resultadosFiltrados = propuestas.filter((p) => {
    return (
      (!institucion || p.institucion === institucion) &&
      (!area || p.area === area) &&
      (!modalidad || p.modalidad === modalidad) &&
      (!duracion || p.duracion === duracion) &&
      (!localidad || p.localidad === localidad) &&
      (!arancelada || p.arancelada === arancelada)
    );
  });
  // Ordenar los resultados por título
  resultadosFiltrados = resultadosFiltrados.sort((a, b) =>
    a.titulo.localeCompare(b.titulo),
  );
  paginaActual = 1;
  mostrarResultados(1);
  /*limpiarCampos(); */

  // Enviar los filtros aplicados y la cantidad de resultados a Google Sheets protegido con reCAPTCHA v3
  if (typeof grecaptcha !== "undefined") {
    grecaptcha.ready(function () {
      grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: "buscar" }).then(function (token) {
        enviarLogAGoogleSheets({
          institucion,
          area,
          modalidad,
          duracion,
          localidad,
          arancelada
        }, resultadosFiltrados.length, token);
      }).catch(function (error) {
        console.error("Error al obtener token de reCAPTCHA:", error);
      });
    });
  } else {
    console.warn("reCAPTCHA no cargado. Se omite el log.");
  }
}

// Función que se ejecuta para mostrar los resultados en tarjetas
function mostrarResultados(pagina) {
  paginaActual = pagina;
  const seccion = document.getElementById("resultados");
  const header = document.getElementById("resultados-header");
  const grid = document.getElementById("resultados-grid");
  seccion.style.display = "block";
  grid.innerHTML = "";
  // Si no hay resultados, mostrar mensaje y salir
  if (resultadosFiltrados.length === 0) {
    header.textContent = "";
    grid.innerHTML = `
          <div class="sin-resultados">
            No se encontraron propuestas con los filtros seleccionados.
          </div>`;
    const paginacionDiv = document.getElementById("paginacion");
    if (paginacionDiv) paginacionDiv.innerHTML = "";
    return;
  }
  // Mostrar el número de resultados
  header.textContent = `${resultadosFiltrados.length} propuesta${resultadosFiltrados.length > 1 ? "s" : ""} encontrada${resultadosFiltrados.length > 1 ? "s" : ""}`;
  // Obtener los resultados de la página actual
  const resultadosPagina = resultadosFiltrados.slice(
    (pagina - 1) * CANT_POR_PAGINA,
    pagina * CANT_POR_PAGINA,
  );
  // Crear tarjetas para cada resultado
  resultadosPagina.forEach((p) => {
    const card = document.createElement("div");
    card.className = "propuesta-card";
    card.innerHTML = `
          <h3>${p.titulo}</h3>
          <div class="institucion">${p.institucion}</div>
          <div class="tags">
            <button class="tag" onclick="filtrarPorTag('area', '${p.area}')"> ${p.area}</button>
            <button class="tag" onclick="filtrarPorTag('modalidad', '${p.modalidad}')"> ${p.modalidad}</button>
            <button class="tag" onclick="filtrarPorTag('duracion', '${p.duracion}')"> ${p.duracion}</button>
            <button class="tag" onclick="filtrarPorTag('localidad', '${p.localidad}')"> ${p.localidad}</button>
            <button class="tag ${p.arancelada}" onclick="filtrarPorTag('arancelada', '${p.arancelada}')">
              ${p.arancelada === "No" ? " Gratuita" : " Arancelada"}
            </button>
          </div>
          ${p.url ? `<a class="btn-conocer-mas" href="${p.url}" target="_blank" rel="noopener noreferrer">Conocer más</a>` : ""}
        `;
    grid.appendChild(card);
  });
  // Crear botones de paginación
  crearBotonesPaginas(resultadosFiltrados);
  // Desplazarse suavemente a la sección de resultados
  seccion.scrollIntoView({ behavior: "smooth", block: "start" });
}

// Función que se ejecuta para crear los botones de paginación
function crearBotonesPaginas(resultados) {
  const paginacionDiv = document.getElementById("paginacion");
  if (!paginacionDiv) return;
  paginacionDiv.innerHTML = "";
  const cantResultados = resultados.length;
  const cantPaginas = Math.ceil(cantResultados / CANT_POR_PAGINA);
  // Si hay 1 o menos páginas, no mostrar paginación
  if (cantPaginas <= 1) {
    return;
  }
  // Botón Primero
  const btnPrimero = document.createElement("button");
  btnPrimero.innerHTML = "&laquo;";
  btnPrimero.className = "btn-pagina";
  if (paginaActual === 1) {
    btnPrimero.disabled = true;
  } else {
    btnPrimero.addEventListener("click", () => {
      mostrarResultados(1);
    });
  }
  paginacionDiv.appendChild(btnPrimero);
  // Botón Anterior
  const btnAnterior = document.createElement("button");
  btnAnterior.innerHTML = "&lt;";
  btnAnterior.className = "btn-pagina";
  if (paginaActual === 1) {
    btnAnterior.disabled = true;
  } else {
    btnAnterior.addEventListener("click", () => {
      mostrarResultados(paginaActual - 1);
    });
  }
  paginacionDiv.appendChild(btnAnterior);
  // Calcular rango de 3 botones
  let startPage = Math.max(1, paginaActual - 1);
  let endPage = startPage + 2;
  if (endPage > cantPaginas) {
    endPage = cantPaginas;
    startPage = Math.max(1, endPage - 2);
  }
  // Botones intermedios
  for (let i = startPage; i <= endPage; i++) {
    const boton = document.createElement("button");
    boton.textContent = i;
    boton.className =
      "btn-pagina" + (i === paginaActual ? " activo" : "");
    boton.addEventListener("click", () => {
      mostrarResultados(i);
    });
    paginacionDiv.appendChild(boton);
  }
  // Botón Siguiente
  const btnSiguiente = document.createElement("button");
  btnSiguiente.innerHTML = "&gt;";
  btnSiguiente.className = "btn-pagina";
  if (paginaActual === cantPaginas) {
    btnSiguiente.disabled = true;
  } else {
    btnSiguiente.addEventListener("click", () => {
      mostrarResultados(paginaActual + 1);
    });
  }
  paginacionDiv.appendChild(btnSiguiente);
  // Botón Último
  const btnUltimo = document.createElement("button");
  btnUltimo.innerHTML = "&raquo;";
  btnUltimo.className = "btn-pagina";
  if (paginaActual === cantPaginas) {
    btnUltimo.disabled = true;
  } else {
    btnUltimo.addEventListener("click", () => {
      mostrarResultados(cantPaginas);
    });
  }
  paginacionDiv.appendChild(btnUltimo);
}

// Función que se ejecuta para limpiar los campos del buscador
function limpiarCampos() {
  document.getElementById("institucion").value = "";
  document.getElementById("area").value = "";
  document.getElementById("modalidad").value = "";
  document.getElementById("duracion").value = "";
  document.getElementById("localidad").value = "";
  document.getElementById("arancelada").value = "";
}

// Función para limpiar campos y ocultar resultados de búsqueda
function limpiarTodo() {
  limpiarCampos();
  const seccion = document.getElementById("resultados");
  if (seccion) {
    seccion.style.display = "none";
  }
}

// Función que se ejecuta para filtrar por tag
function filtrarPorTag(propiedad, valor) {
  limpiarCampos();
  const select = document.getElementById(propiedad);
  select.value = valor;
  buscar();
}

// Función que se ejecuta para inicializar los filtros según las propuestas
function inicializarFiltros() {
  const poblarSelect = (id, propiedad) => {
    // Obtiene el select por su id
    const select = document.getElementById(id);
    if (!select) return;
    // Obtiene todos los valores posibles de la propiedad según las propuestas
    const valores = [
      ...new Set(propuestas.map((p) => p[propiedad])),
    ].filter((v) => v);
    // SI la propiedad es "duración", ordena los valores según la duración, donde "Otra" va al final
    if (propiedad === "duracion") {
      const obtenerPeso = (str) => {
        if (str === "Otra") {
          return 999;
        }
        if (str.includes("cuatrimestre")) {
          const num = parseInt(str) || 0;
          return num;
        }
        return 100;
      };
      valores.sort((a, b) => obtenerPeso(a) - obtenerPeso(b));
    } else if (propiedad === "arancelada") { // Si la propiedad es "arancelada", va "Si" antes de "No"
      valores.sort((a, b) =>
        b.localeCompare(a, "es", { sensitivity: "base" }),
      );
    } else { // Si no es "duración" ni "arancelada", ordena alfabéticamente
      valores.sort((a, b) =>
        a.localeCompare(b, "es", { sensitivity: "base" }),
      );
    }
    // Agrega la opción "Cualquiera..." al select
    select.innerHTML = '<option value="">Cualquiera...</option>';
    valores.forEach((v) => {
      const opt = document.createElement("option");
      opt.value = v;
      opt.textContent = v;
      select.appendChild(opt);
    });
  };
  poblarSelect("institucion", "institucion");
  poblarSelect("area", "area");
  poblarSelect("modalidad", "modalidad");
  poblarSelect("duracion", "duracion");
  poblarSelect("localidad", "localidad");
  poblarSelect("arancelada", "arancelada");
}

inicializarFiltros();
