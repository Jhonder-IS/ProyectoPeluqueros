CREATE DATABASE mysqldatabase;

use mysqldatabase;

CREATE TABLE usuarios(
 id int auto_increment,
 nombre varchar(100) not null,
 tipo boolean,
 correo varchar(100) not null,
 contrasena varchar(100) not null,
 celular int not null,
 PRIMARY KEY(id)
);

CREATE TABLE citas(
    id int not null auto_increment,
    dia varchar(100) not null,
    hora varchar(100) not null,
    usuario int not null,
    peluquero int not null,
    primary key(id),
    foreign key(usuario) references usuarios(id),
    foreign key(peluquero) references usuarios(id)
);

CREATE TABLE horario(
	id int not null auto_increment,
    dia varchar(100) not null,
    timetable int not null,
    peluquero int not null,
    primary key(id),
    foreign key(peluquero) references usuarios(id)
);

SHOW TABLES;

describe usuarios;