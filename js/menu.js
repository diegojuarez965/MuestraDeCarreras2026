// Función que se ejecuta para abrir/cerrar el menú en dispositivos móviles
function accion() {
  var enlace = document.getElementsByClassName("menu-enlace");
  for (var i = 0; i < enlace.length; i++) {
    enlace[i].classList.toggle("desaparece");
  }
}
