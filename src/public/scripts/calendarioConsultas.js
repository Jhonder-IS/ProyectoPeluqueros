//Variables que ayudaran al desarrollo del calendario
let nav = 0;
const calendar = document.getElementById('calendar');
const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const events = [];//Guardara todos los datos obtenidos de la base de datos para realizar algunas validaciones
   
var day = null;//Almacenara el dia seleccionado
var actual;//Guaradara el dia en el que estamos

function verCitasDia(){//Sera el metodo que le dara funcion al boton ´citasDia´
 //Se guardara la variable del dia de hoy en una variable de sesion para mas adelante cargar las citas de este dia y nos rediccionara a getcitas donde cargara las citas de este dia
    sessionStorage.setItem("Day",actual);
    window.open("/getCitas","_self");
}

function openModal(date) {//Cuando el usuario seleccione un dia, este abrira open modal, donde recibira la fecha    seleccionada.
  day = date; //Se pasara ese valor a una variable global
  const eventConsult = events.find(e => e.dia === date);// se buscara en el arreglo si existe esa fecha, de ser asi quiere decir que ya hay citas para ese dia por lo que si se podra consultar

  if(eventConsult){//revisamos si la variable esta en verdadero para verificar que en efecto si hay citas
    sessionStorage.setItem("Day",day);//Guardamos la variable en una variable de sesion
    window.open("/getCitas","_self");//Nos redireccionara a getCitas donde podremos ver las citas de ese dia en una tabla
  }
  //De no cumplirse la condicion quiere decir que no hay citas para ese dia, por lo que no sera necesario verificar
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
      const eventForDay = events.find(e => e.dia === dayString);//Buscara si en arreglo se encuentra esa fecha

      if (i - paddingDays === day && nav === 0) {//Si el dia corresponde al dia actual se recalcara
        actual = dayString;//Cuando el dia marque el dia de hoy se guardara en actual
        daySquare.id = 'currentDay';
      }

      if (eventForDay) {//Si en efecto se encontro en el arreglo esa fecha quiere decir que ese dia hay citas para consultar, por lo que se digitara en el cuadro que ese dia hay citas.
        const eventDiv = document.createElement('div');
        eventDiv.classList.add('event');
        eventDiv.innerText = "Citas Pendientes";
        daySquare.appendChild(eventDiv);
      }
      daySquare.addEventListener('click', () => openModal(dayString));//El dia seleccionado por el peluquero abrira el open modal.
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
  //Buscaremos en la base de datos, que dias se han creado citas, para que el peluquero pueda verificar esos dias a cual cliente atender
    fetch(`http://localhost:3000/getCitasPeluquero/'${sessionStorage.getItem("usuarioID")}'`)
    .then(response => response.json())
    .then(data => PasarData(data))
    .catch(error => console.log(error), load())//Si hay error quiere decir que no existe ninguna cita, por lo que solo se refrescara un calendario en blanco
    const PasarData = (data) =>{
     for(let i = 0; i < data.length; i++){
        events[i] = data[i];//De existir citas pasaremos los datos a una arreglo global
     }
     load();//Refrescaremos el calendario con todos los datos necesarios
     }
  
initButtons();//Iniciamos los botones