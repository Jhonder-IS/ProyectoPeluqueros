//Al accionar el boton permite hacer cualquiera de las opciones
document.querySelector('#submit').addEventListener('click', (event) => {
    event.preventDefault()
    const opcionUser = document.getElementById('opcionUser').value;//Extrae la opcion que selecciona el usuario
    if (opcionUser === "1") {//Si la opcion es 1 abre calendarioLaboral
      window.location.href = "/calendarioLaboral"
    } else if (opcionUser === "2") {//Si la opcion es 1 abre calendarioConsultas
      window.location.href = "/calendarioConsultas"
    } else {//Sino quedarse en seleccionar opcion
      window.location.href = "/opcionUser"
    }
  });