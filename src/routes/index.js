import { Router } from "express";

const router = Router();


// loguear usuario
router.get("/", (req, res) => {
  res.render("login", { title: "Inicio" });
});

// registrar usuario
router.get("/registro", (req, res) => {
  res.render("registro", { title: "Registro" });
});

// opciones del usuario
router.get("/opcionUser", (req, res) => {
  res.render("opcionUser", { title: "Opciones de Usuario" });
});

// consultar citas usuario
router.get("/consultarUsuario", (req, res) => {
  res.render("consultarUsuario", { title: "Consultas " });
});

// crear cita usuario
router.get("/crearCitaUsuario", (req, res) => {
  res.render("crearCitaUsuario", { title: "Citas" });
});

// eliminar cita usuario
router.get("/citaEliminar", (req, res) => {
  res.render("citaEliminar", { title: "Eliminar cita" });
});

// modificar cita usuario
router.get("/modificarCita", (req, res) => {
  res.render("modificarCita", { title: "Modificar cita" });
});

router.get("/modificarCita", (req, res) => {
  res.render("modificarCita", { title: "Citas" });
});


//  calendario
router.get("/calendario", (req, res) => {
  res.render("calendario", { title: "Calendario" });
});
// horario de 7 a 5.30
router.get("/horarioUsuario1", (req, res) => {
  res.render("horarioUsuario1", { title: "Horario Completo" });
});

// horario de 7 a 11.30
router.get("/horarioUsuario2", (req, res) => {
  res.render("horarioUsuario2", { title: "Horario Mañana" });
});

// horario de 1 a 5.30
router.get("/horarioUsuario3", (req, res) => {
  res.render("horarioUsuario3", { title: "Horario Tarde" });
});


// opcion de horarios peluquero
router.get("/opcionCalendario", (req, res) => {
  res.render("opcionCalendario", { title: "Horario Peluquero" });
});

// calendario del peluquero
router.get("/calendarioLaboral", (req, res) => {
  res.render("calendarioLaboral", { title: "Calenderio Laboral" });
});

// calendario para consultas
router.get("/calendarioConsultas", (req, res) => {
  res.render("calendarioConsultas", { title: "Calenderio Consultas" });
});



// citas del dia del peluquero
router.get("/citasPeluquero", (req, res) => {
  res.render("citasPeluquero", { title: "Citas" });
});

// opciones del peluquero
router.get("/opcionesPeluquero", (req, res) => {
  res.render("opcionesPeluquero", { title: "Inicio Peluquero" });
});

// opciones de peluqueros
router.get("/getPeluquerosforUsuarios", (req, res) => {
  res.render("getPeluquerosforUsuarios", { title: "Opciones de Peluqueros" });
});

router.get("/getUsuario", (req, res) => {
  res.render("getUsuario", { title: "Consultar" });
});

 
router.get("/getCitas", (req, res) => {
  res.render("getCitas", { title: "Consultar" });
});

export default router;