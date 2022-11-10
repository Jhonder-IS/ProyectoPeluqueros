// opciones disponibles para el usuario
document.querySelector('#submit').addEventListener('click', (event) => {
  event.preventDefault()
  const opcionUser = document.getElementById('opcionUser').value;
  // segun la opcion del usuario entra a una vista diferente
    // crear cita usuario
    if (opcionUser === "1") { 
      window.location.href = "/getPeluquerosforUsuarios"
      // modificar cita usuario
    } else if (opcionUser === "2") {
      window.location.href = "/modificarCita"
      // eliminar cita usuario
    } else if (opcionUser === "3") {
      window.location.href = "/citaEliminar"
      // consultar citas usuario
    } else if (opcionUser === "4") {
      window.location.href = "/consultarUsuario"
    } else {
      window.location.href = "/opcionUser"
    }
});
