let TimeTable = [];

const newEventModal = document.getElementById('newEventModal');
const deleteEventModal = document.getElementById('deleteEventModal');
const backDrop = document.getElementById('modalBackDrop');
const eventTitleInput = document.getElementById('eventTitleInput');

let buttonClicked = null; //Sera equivalente a el boton de evento presionado

function load(btnPress){
  buttonClicked = btnPress;
  
  const eventSerch = TimeTable.find(e => e.hour === buttonClicked.name);

  if (eventSerch) {//Si responde true quiere decir que ya hay un evento, por lo que la unica opcion es borrarlo
    deleteEventModal.style.display = 'block';
  } else {//Sino existe, quiere decir que se quiere agregar un evento
    newEventModal.style.display = 'block';
  }
  backDrop.style.display = 'block';
}

function saveEvent() {//Metodo para guardar el evento en un array y escribirlo en el btn
    TimeTable.push({
      //date: //Falta obtener variable con la fecha,
      hour : buttonClicked.name,
    });
    buttonClicked.textContent = 'Agregado';
    recorrer();
    closeModal();
  }

function deleteEvent() {//Metodo para borrar el evento del array y asignar el espacio en vacio
  TimeTable = TimeTable.filter(e => e.hour !== buttonClicked.name);
  buttonClicked.textContent = 'Agregar al horario';
  recorrer();
  closeModal();
}

function closeModal() {//Setea las etiquetas para que al abrirlas no tengan datos ya digitados
  newEventModal.style.display = 'none';
  deleteEventModal.style.display = 'none';
  backDrop.style.display = 'none';
}

function initButtons() {//Inicializa los btn y les asigna un metodo
  document.getElementById('saveButton').addEventListener('click', saveEvent);
  document.getElementById('cancelButton').addEventListener('click', closeModal);
  document.getElementById('deleteButton').addEventListener('click', deleteEvent);
  document.getElementById('closeButton').addEventListener('click', closeModal);
}

function recorrer(){//Metodo temporal para darle gestion al array
  msgForNormal = 'Array: ';
  for (var i=0; i<TimeTable.length; i++) { msgForNormal += TimeTable[i].hour+" - "; }
  console.log(msgForNormal);
}

initButtons();