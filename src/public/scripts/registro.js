// cuando le da registrar, valida que  existan todos los campos 
document.querySelector('#submit').addEventListener('click', (event) => {
    event.preventDefault()

    var nombreDij = document.getElementById('nombreID').value;
    var TipoDij = document.getElementById('inputGroupSelect01').value;
    var mailDij = document.getElementById('mailID').value;
    var contrasenaDij = document.getElementById('passwordID').value;
    var telefonoDij = document.getElementById('telefonoID').value;

    if(nombreDij.trim().length === 0){// valida que el nombre no este vacío 
      errorDato("El nombre no es válido")
    }else{
      if(TipoDij === "Choose..."){// valida que el tipo se haya escogido
        errorDato("El tipo no es válido")
      }else{
        if(mailDij.trim().length === 0 || validarCorreo(mailDij)===false){// valida que el correo no se nulo y que termine en @gmail.com
          errorDato("El correo no es válido, debe terminar en @gmail.com")
        }else{
          if(contrasenaDij.trim().length === 0){// valida que la  contraseña no sea vacía
            errorDato("La contraseña no es válida")
          }else{
            if(telefonoDij.trim().length === 0){ // valida que el telefono no este vacío 
              errorDato("El telefono no es válido")
            }else{ /// si todos los datos son válidos se ejectuta el fecth, que sirve para agregar el usuario
              fetch('http://localhost:3000/add', {
                method: 'POST',
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ nombre: nombreDij, tipo: TipoDij, correo: mailDij, contrasena: contrasenaDij, celular: telefonoDij })
              })
                .then(res => {  
                  res.json().then(alertr => {//una vez se termine la llamada a la base de datos se lanza una alerta 
                    Swal.fire(alertr.titulo, alertr.descripcion, alertr.icono);
                    document.getElementById('formulario').reset();
                    if (alertr.status) {
                      setTimeout(function () {//// se devuelve a la página principal
                        window.location.href = "/";
                      }, 2500);
                    }
                  })
              })
            }
          }
        }
      }
    }
  })

  function errorDato(detalle){// si algun dato no es válido se llama a esta función con una descripción para que lanze la alerta
    Swal.fire({
        title: 'Error con los datos',
        text: detalle,
        icon: 'warning',
      })
  }

  function validarCorreo(mailID){/// vlida que el correo sea válido 
    var arroba =  new Boolean(false);
    let correoV = "";
    for(let i = 0; i < mailID.trim().length; i++){
      if((mailID[i]==='@' || arroba === true) && i>0){
        correoV += mailID[i];
        arroba = true;
      }
    }
  if(correoV === "@gmail.com"){
    return true;
  }else{
    return false;
  }
}