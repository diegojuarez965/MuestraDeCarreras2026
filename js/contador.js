// Función para contar las visitas a la página (Solo incrementa una visita si el usuario accede por primera vez en el día)
(function () {
  const KEY = "muestra_carreras_uns_2026_visits";
  const storageKey = "muestra_carreras_last_visit";
  // Formatear la fecha local como YYYY-MM-DD
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;

  let lastVisit = null;
  let storageAvailable = true;
  // Intenta obtener la última visita del localStorage
  try {
    lastVisit = localStorage.getItem(storageKey);
  } catch (e) {
    console.warn("localStorage no disponible:", e);
    storageAvailable = false;
  }
  // Decidir si incrementamos (hit) o solo obtenemos (get)
  const isNewVisitToday = !storageAvailable || (lastVisit !== today);
  const action = isNewVisitToday ? 'hit' : 'get';
  const url = `https://countapi.mileshilliard.com/api/v1/${action}/${KEY}`;

  fetch(url)
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al consultar el contador de visitas');
      }
      return response.json();
    })
    .then(data => {
      const contadorEl = document.getElementById('contador-visitas');
      if (contadorEl && typeof data.value === 'number') {
        // Formatear número con separador de miles
        contadorEl.textContent = data.value.toLocaleString();

        // Si fue una visita nueva y exitosa, guardar la marca de hoy
        if (isNewVisitToday && storageAvailable) {
          try {
            localStorage.setItem(storageKey, today);
          } catch (e) {
            console.error("Error al escribir en localStorage:", e);
          }
        }
      }
    })
    .catch(error => {
      console.error('Error en el contador de visitas:', error);
      const visitasContainer = document.getElementById('visitas-container');
      if (visitasContainer) {
        visitasContainer.style.display = 'none';
      }
    });
})();
