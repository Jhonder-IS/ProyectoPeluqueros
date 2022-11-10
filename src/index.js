import express from "express";
import morgan from "morgan";
import mysql from 'mysql';
import bodyparser from 'body-parser';
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import cors from 'cors';

import indexRoutes from "./routes/index.js";

const corsOptions ={
    origin:'*', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200,
 }

const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

app.use(bodyparser.json());
app.set("port", process.env.PORT || 3000);
app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(morgan("dev"));
app.use(cors(corsOptions)) // Use this after the variable declaration
app.use(indexRoutes);

app.use(express.static(join(__dirname, "public")));

app.listen(app.get("port"));
console.log("Servidor en el puerto", app.get("port"));

var mysqlConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jhonder.1527',
    database: 'mysqldatabase',
    multipleStatements: true
});

mysqlConnection.connect((err) => {
    if (!err)
        console.log('Base de datos conectada');
    else
        console.log('Error, no se ha podido conectar a la base de datos' + JSON.stringify(err, undefined, 2));

});

// inicio
// validar datos del usuario
app.post('/login', (req, res) => {
    const { correo, contrasena } = req.body;
    const validation = `SELECT * FROM usuarios WHERE correo = '${correo}' and contrasena = '${contrasena}'`
    mysqlConnection.query(validation, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            if (results[0].tipo == 1) {
                res.json({
                    titulo: "Usuario logueado con exito",
                    descripcion: "Recuperando datos del usuario ",
                    icono: "success",
                    id: results[0].id,
                    status: true,
                    path: "/opcionesPeluquero"
                });
            } else {
                res.json({
                    titulo: "Usuario logueado con exito",
                    descripcion: "Recuperando datos del usuario ",
                    icono: "success",
                    id: results[0].id,
                    status: true,
                    path: "/opcionUser"
                });
            }
        } else {
            res.json({
                titulo: "Error",
                descripcion: "El correo y contraseña digitados no concuerdan con los datos registrador, por favor ingrese nuevamente",
                icono: "error",
                status: false
            });
        }
    });
});

// registrar usuario
app.post('/add', (req, res) => {
    const { correo } = req.body;
    const validation = `SELECT * FROM usuarios WHERE correo = '${correo}'`
    mysqlConnection.query(validation, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json({
                titulo: "Error correo ya registrado",
                descripcion: "Por favor registrese con un correo diferente",
                icono: "error",
                status: false
            });
        } else {
            const sql = 'INSERT INTO usuarios SET ?'
            const usuarioObj = {
                nombre: req.body.nombre,
                tipo: req.body.tipo,
                contrasena: req.body.contrasena,
                correo: req.body.correo,
                celular: req.body.celular
            }
            mysqlConnection.query(sql, usuarioObj, err => {
                if (err) {
                    throw err;
                } else {
                    res.json({
                        titulo: "Usuario registrado correctamente",
                        descripcion: "Bienvenido al programa de citas",
                        icono: "success",
                        status: true
                    });
                }
            })
        }
    });
});

// recuperar usuario por el id
app.get('/usuarios/:id', (req, res) => {
    const { id } = req.params
    const sql = `SELECT * From usuarios WHERE id = ${id}`;

    mysqlConnection.query(sql, (err, result) => {
        if (err) throw err;
        if (result.length > 0) {
            res.json(result);
        } else {
            res.send('Este usuario no se encuentra en la base de datos');
        }
    });
});

// citas 
// citas agendadas segun peluquero
app.get('/getCitasPeluquero/:id', (req, res) => {
    const sql = `select c.dia, c.hora, u.nombre, u.correo, u.celular from citas c inner join usuarios u on u.id=c.usuario AND c.peluquero=${req.params.id}`
    mysqlConnection.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('No hay resultados');
        }
    });
});

// crear cita usuario
app.post('/crearcita', (req, res) =>{
    const validation = `SELECT * FROM citas WHERE dia = '${req.body.dia}' AND hora= '${req.body.hora}' AND peluquero='${req.body.peluquero}'`
    mysqlConnection.query(validation, (err,  results) =>{
        if (err) throw err;
        if(results.length === 0){
            const validation2 = `SELECT * FROM citas WHERE dia = '${req.body.dia}' AND hora= '${req.body.hora}' AND usuario='${req.body.usuario}'`
            mysqlConnection.query(validation2, (err2, results2) =>{
                if(results2.length === 0){
                    const sql = 'INSERT INTO citas SET ?'
                    const usuarioObj = {
                        dia: req.body.dia,
                        hora: req.body.hora,
                        usuario: req.body.usuario,
                        peluquero: req.body.peluquero,
                    }
                    mysqlConnection.query(sql, usuarioObj, err => {
                        if (err) {
                            throw err;
                        } else {
                            console.log('Cita agendada con exito')
                            res.json({
                                titulo: "Cita agendada con exito",
                                descripcion: "",
                                icono: "success",
                                status: true
                            });
                        }
                    })
                }else{
                    res.json({
                        titulo: "Error",
                        descripcion: "El peluquero seleccionado ya cuenta con una cita reservada para para la fecha y hora seleccionada, por favor seleccione otro cita en otro horario",
                        icono: "error",
                        status: false
                    }) 
                }
            })
        }else{
            res.json({
                titulo: "Error",
                descripcion: "El peluquero seleccionado ya cuenta con una cita reservada para la fecha y hora seleccionada, por favor seleccione otro cita en otro horario",
                icono: "error",
                status: false
            })
        }
    })
});

// mostar citas segun usuario
app.get('/citas/:id', (req, res) => {
    console.log(req.params)
    const sql = `select c.dia, c.hora, u.nombre, u.correo, u.celular from citas c inner join usuarios u on u.id=c.peluquero AND  c.usuario = ${req.params.id}` 
    mysqlConnection.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('El usuario seleccionado no cuenta con citas registradas');
        }
    });
});


app.put('/modificarcita/:id', (req, res) =>{ /// M/D/A
    // convertimos la fecha nueva en un formato A/M/D para cnvertirla a date y con esto poder compararlas con el  .getTime()
    let fechaT = req.body.diaNuevo.split('/');
    let  f = fechaT[2]+"/"+fechaT[0]+"/"+fechaT[1]
    let fechaActual = new Date();
    let fechaNueva = new Date(f);
    if(fechaActual.getTime() > fechaNueva.getTime()){ /// si la  fecha nueva es menor o igual a la actual 
        res.json({
            titulo: "Error",
            descripcion: "La fecha nueva no puede ser igual o menor a la actual",
            icono: "error",
            status: false,
            path: "/modificarCita"
        })
        return;
    }
    /// se crea una variable booleana para saber se la hora es am  o pm, ya que se trabajara con formato militar  
    var tarde = new Boolean(false);
    var tempH ='';
    for(let i=0; i<req.body.horaNueva.length; i++){
        console.log(req.body.horaNueva[i]);
        if(req.body.horaNueva[i]==='p'){// se valida si esta la 'p' para saber si en la  tarde 
            tarde = true;
        }
        if(!(req.body.horaNueva[i]===':') && i<2){ //// se extrae solamente la hora de la hora nueva  
            tempH += req.body.horaNueva[i];
        }

        if(req.body.horaNueva[i]===':'){
            if(!(req.body.horaNueva[i+1] ==='0' || req.body.horaNueva[i+1] ==='3')){/// valida que los minutos solo sean 30 o 0, ya que solo se pueden hacer citas en tractos de 30 minutos 
                res.json({
                    titulo: "Error",
                    descripcion: "Las citas solo se pueden escoger en tractos de 30 minutos",
                    icono: "error",
                    status: false,
                    path: "/modificarCita"
                })
                return;
            }
        }
    }
    var hora =parseInt(tempH);
    if(hora===12){/// si la que se obtuvo en el for anterior es igual a 12 lanza una alerta, porque en esa hora el peluquero almuerza
        res.json({
            titulo: "Error",
            descripcion: "No se pueden agendar citas en el horario de almuerzo del peluquero",
            icono: "error",
            status: false,
            path: "/modificarCita"
        })
        return;
    }
    if(tarde===true){
        hora = hora+12;
    }
    const validation = `SELECT * FROM citas WHERE usuario= ${req.params.id} AND dia = '${req.body.dia}' and hora= '${req.body.hora}'`// valida que exista  la cita
    mysqlConnection.query(validation, (err1,  results1) =>{
        console.log('Entro query')
        if (err1) throw err1;
        if(results1.length === 0){
            res.json({
                titulo: "Error",
                descripcion: "No existe una cita con la fecha "+req.body.dia+" y la hora "+req.body.hora,
                icono: "error",
                status: false,
                path: "/modificarCita"
            })
            return;
        }else{
            const validation2 = `SELECT * FROM citas WHERE usuario= ${req.params.id} AND dia = '${req.body.diaNuevo}' and hora= '${req.body.horaNueva}'`// valida que la cita nueva no este registrada  
            mysqlConnection.query(validation2, (err2,  results2) =>{
                console.log('Entro query')
                if (err2) throw err2;
                if(results2.length > 0){
                    res.json({
                        titulo: "Error",
                        descripcion: "La cita ya ha sido registrada por otro usuario",
                        icono: "error",
                        status: false,
                        path: "/modificarCita"
                    })
                    return;
                }else{
                    const validation3 = `select * from horario WHERE dia= '${req.body.diaNuevo}' AND peluquero ='${results1[0].peluquero}'`;// verifica que el peluquero escogido en la cita anterior tenga campo para ese día y esa hora
                    mysqlConnection.query(validation3, (err3,  results3) =>{
                        if (err3) throw err3;
                        if(results3.length > 0){
                            // el horario del peluquero se maneja dentro de un rango 1-3, entonces extraemos  ese horario
                            // e inicializamos las variables para poder manejar que la hora  ingresada no incumpla el horario
                            // del peluquero, se trabajara con hora militar
                            var horarioInicio =0;
                            var horarioFin = 0;
                            if(results3[0].timetable===1){
                                horarioInicio=7;
                                horarioFin=18;
                            }else{
                                if(results3[0].timetable===2){
                                    horarioInicio=7;
                                    horarioFin=12;
                                }else{
                                    horarioInicio=13;
                                    horarioFin=18;
                                }
                            }
                            if(hora>=horarioInicio && hora<horarioFin){// verifica que la hora seleccionada este dentro del  horario del peluquero
                                var sql=  `UPDATE citas SET dia='${req.body.diaNuevo}', hora='${req.body.horaNueva}', peluquero= '${results1[0].peluquero}' WHERE usuario = ${req.params.id}  AND dia='${req.body.dia}' AND hora='${req.body.hora}'`
                                mysqlConnection.query(sql,(err4, results4)=>{
                                    if (err4) throw err4;
                                    return res.json({
                                        titulo: "La cita ha sido actualizada con exitó",
                                        descripcion: " ",
                                        icono: "success",
                                        status: false,
                                        path: "/modificarCita"
                                    })
                                })
                            }else{
                                res.json({
                                    titulo: "Error",
                                    descripcion: "El peluquero no se encuentra disponible en la hora ingresada",
                                    icono: "error",
                                    status: false,
                                    path: "/modificarCita"
                                })
                                return; 
                            }
                        }else{
                            res.json({
                                titulo: "Error",
                                descripcion: "El peluquero no se encuentra disponible",
                                icono: "error",
                                status: false,
                                path: "/modificarCita"
                            })
                            return;
                        }
                    })
                }
            })  
        }
    })
});

// eliminar cita usuario
app.delete('/delete/:id', (req, res) => {/// agregar una validacion de que si no la encuentra manda un mensaje de que no la encontro
    const { id } = req.params.id;
    const sql = `DELETE From citas WHERE usuario = ${req.params.id} AND dia='${req.body.dia}' AND hora ='${req.body.hora}'`;
    mysqlConnection.query(sql, (err, result) => {
        if (err) throw err;
        if(result.affectedRows){
            res.json({
                titulo: "Estado de la cita",
                descripcion: "Se elimino la cita del día "+req.body.dia+"a las "+req.body.hora,
                icono: "success",
                status: false,
                path : "/citaEliminar"
            })
        }else{
            res.json({
                titulo: "Estado de la cita",
                descripcion: "La cita no se encontro",
                icono: "error",
                status: false,
                path : "/citaEliminar"
            })
        }
    })
});


// usuarios de la base de datos
app.get('/usuarios', (req, res) => {
    const sql = 'SELECT * FROM usuarios';
    mysqlConnection.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('La base de datos mysqldatabase no cuenta con usuarios registrados');
        }
    });
});

// horarios
// crearHorario
app.post('/crearhorario', (req, res) =>{
    const validation = `SELECT * FROM horario WHERE dia = '${req.body.dia}' AND peluquero = '${req.body.correo}'`
    mysqlConnection.query(validation, (err,  results) =>{
        if (err) throw err;
        if(results.length === 0){
            const sql = 'INSERT INTO horario SET ?'
            const usuarioObj = {
                dia: req.body.dia,
                timetable: req.body.timetable,
                peluquero: req.body.correo
            }
            mysqlConnection.query(sql, usuarioObj, err => {
                if (err) {
                    throw err;
                } else {
                    console.log('Se agrego al horario')
                    res.json({
                        titulo: "Estado del Horario",
                        descripcion: "Agregado",
                        icono: "success",
                        status: true
                    });
                }
            })
        }else{
            res.json({
                titulo: "Estado del Horario",
                descripcion: "El horario para este dia ya esta definido",
                icono: "error",
                status: false
            })
        }
    })
});


app.get('/getDiasPeluquero/:id', (req, res) => {
    const sql = `SELECT * FROM horario WHERE peluquero = ${req.params.id}`;
    mysqlConnection.query(sql, (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results);
        } else {
            res.send('Error\n No se han encontrado resultados');
        }
    });
});
