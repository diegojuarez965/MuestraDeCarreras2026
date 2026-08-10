// Función que se ejecuta para abrir/cerrar el menú en dispositivos móviles
function accion() {
  const btnMenu = document.getElementById('btnMenu');
  const menuHorizontal = document.querySelector('.menu-horizontal');
  if (btnMenu && menuHorizontal) {
    const isExpanded = btnMenu.classList.toggle('activo');
    menuHorizontal.classList.toggle('activo');
    btnMenu.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
  }
}

// Registrar el listener de click solo una vez
if (!window.menuListenerAdded) {
  document.addEventListener('click', function (event) {
    const btnMenu = document.getElementById('btnMenu');
    const menuHorizontal = document.querySelector('.menu-horizontal');

    if (!btnMenu || !menuHorizontal) return;

    if (menuHorizontal.classList.contains('activo')) {
      const clickedLink = event.target.closest('.menu-horizontal a');
      const clickedOutside = !menuHorizontal.contains(event.target) && !btnMenu.contains(event.target);

      if (clickedLink || clickedOutside) {
        btnMenu.classList.remove('activo');
        menuHorizontal.classList.remove('activo');
        btnMenu.setAttribute('aria-expanded', 'false');
      }
    }
  });
  window.menuListenerAdded = true;
}

