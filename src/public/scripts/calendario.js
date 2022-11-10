//Variables que ayudaran al desarrollo del calendario
let nav = 0;
const calendar = document.getElementById('calendar');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const events = [];//Guardara todos los datos obtenidos de la base de datos para realizar algunas validaciones
   
var day = null;//Almacenara el dia seleccionado
var horario = 0;//Validara que tipo de horario selecciono el peluquero para ese dia


function openModal(date) {//Al seleccionar un dia se llamara a openModal
  day = date; //el dia se para a una variable global 
  
  for(var i = 0; i<events.length;i++){//Se buscara en el arreglo si existen citas para el dia seleccionado 
    if(events[i].dia === day){
      horario = events[i].timetable;//Si existe se obtendra que tipo de horario hay para ese dia 
    }
  }
  sessionStorage.setItem("Day",day);//Guardamos el dia en una varible de sesion, la cual nos serviria mas adelante en caso de que el usuario decida que crear una cita para este dia.

  //En el caso de ser  1 =  se abrira el horario completo
  if(horario === 1){
    horario = 0;
    window.open("/horarioUsuario1","_self");
  }else if(horario === 2){//En el caso de ser  2 =  se abrira el horario de la mañana
    horario = 0;
    window.open("/horarioUsuario2","_self");
  }else if(horario === 3){//En el caso de ser  3 =  se abrira el horario de la tarde
    horario = 0;
    window.open("/horarioUsuario3","_self");
  }
  //En el caso de ser diferente a esos casos, simplemente es un dia sin citas por lo que no se hara nada
}

function load() {//load creara y refrescara un calendario donde nos marcara que dias hay citas
  const dt = new Date();
  if (nav !== 0) {
    dt.setMonth(new Date().getMonth() + nav);
  }
  const day = dt.getDate();//Obtenemos el dia
  const month = dt.getMonth();//Obtenemos el mes
  const year = dt.getFullYear();//Obtenemos el año

  const firstDayOfMonth = new Date(year, month, 1);//Obtiene el primer dia del mes
  const daysInMonth = new Date(year, month + 1, 0).getDate();//Obtiene la cantidad de dias del mes
  const dateString = firstDayOfMonth.toLocaleDateString('en-us', {//Obtiene el dia, junto con la fecha corrspondiente
    weekday: 'long',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  });
  const paddingDays = weekdays.indexOf(dateString.split(', ')[0]);//Obtenemos el dia de la semana, de DateString
  document.getElementById('monthDisplay').innerText =
    `${dt.toLocaleDateString('en-us', { month: 'long' })} ${year}`;
  calendar.innerHTML = '';

  for (let i = 1; i <= paddingDays + daysInMonth; i++) {//Creamos cuadrados alrededor de cada fecha,ademas de cuadrados de relleno para las fecha que no hay en ese mes
    const daySquare = document.createElement('div');
    daySquare.classList.add('day');
    const dayString = `${month + 1}/${i - paddingDays}/${year}`;

    if (i > paddingDays) {//Si i > paddingDays, quiere decir que son dias reales
      daySquare.innerText = i - paddingDays;
      const eventForDay = events.find(e => e.dia === dayString);//Mientras se genera el calendario buscaremos si ese dia que se esta creando se encuentra dentro del arreglo, por lo que si encuentra quiere decir que ese dia el peluquero tiene citas.

      if (i - paddingDays === day && nav === 0) {//Si el dia corresponde al dia actual se recalcara
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {//Si eventForDay es verdadero entonces hay citas ese dia, por lo que marcaremos en el cuadro que hay citas disponibles
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = "Existen citas";
        daySquare.appendChild(eventDiv);
      }
      daySquare.addEventListener('click', () => openModal(dayString));
    } else {//Sino son dias de relleno
      daySquare.classList.add('padding');
    }
    calendar.appendChild(daySquare);
  }
}

//Inicializamos los botones de Siguiente y Atras para que sean funcionales
function initButtons() {
  document.getElementById('nextButton').addEventListener('click', () => {
    nav++;
    load();
  });

  document.getElementById('backButton').addEventListener('click', () => {
    nav--;
    load();
  });
}

  //Buscaremos en la base de datos que dias a asignado el peluquero como laborales para que el cliente tenga  presente que dias el peluquero seleccionado tiene citas
    fetch(`http://localhost:3000/getDiasPeluquero/'${sessionStorage.getItem("PeluqueroAsignado")}'`)
    .then(response => response.json())
    .then(data => PasarData(data))
    .catch(error => console.log(error), load())//Si hay error quiere decir que la base de datos esta vacia por lo tanto solamente se refrescara el calendario pero no marcara ninguna cita
    const PasarData = (data) =>{
     for(let i = 0; i < data.length; i++){
        events[i] = data[i];//Pasamos la respuesta de la base de datos a un arreglo global
     }
     load();//Refrescaremos el calendario con todos los datos necesarios
     }
  
initButtons();//Iniciamos los botones