const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');


const PORT = process.env.PORT || 3000;
const app = express();
app.use(bodyParser.json());
app.use(cors());

//Connection with mysql
const password = 'S3cur3P@55w0rd_API';
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'api',
	password: password,
	database: 'portal'
});

//Cheking connection
connection.connect(error => {
	if (error) throw error;
	console.log('[BD]:: Connection successful');
});
app.listen(PORT, () => console.log(`[API]::Server running on port ${PORT}`));

//Creating endpoints

//routes
app.get('/', (req, res) => {
	res.send('Wellcome to my API');
});

app.get('/empleado', (req, res) => {
	const sql = 'SELECT * FROM empleado';
	connection.query(sql, (err, results) => {
		if (err) throw err;
		if (results.length > 0) {
			res.json(results);
		} else {
			res.send('No results');
		}
	});
});

app.get('/productos', (req, res) => {
	const sql = 'SELECT * FROM producto';
	connection.query(sql, (err, results) => {
		if (err) throw err;
		if (results.length > 0) {
			res.json(results);
		} else {
			res.send('No results');
		}
	});
});

app.get('/ordenes/:id', (req, res) => {
	const { id } = req.params;
	const sql = `SELECT nombre, precio FROM producto INNER JOIN producto_to_orden ON producto.id_producto = producto_to_orden.id_producto WHERE producto_to_orden.num_orden = ${id}`;
	connection.query(sql, (err, results) => {
		if (err) throw err;
		if (results.length > 0) {
			res.json(results);
		} else {
			res.send('No results');
		}
	});
});

app.get('/addProduct', (req, res) => {
	let data = {
		nombre: req.query.nombre,
		descripcion: req.query.descripcion,
		precio: req.query.precio,
		password: req.query.password
	};
	console.log(`[API] :: Data fetched: ${data.nombre}, ${data.descripcion}, ${data.precio} :: from post`);
	let pass = (data.password === password);
	console.log(pass + data.password + ' ' + password);
	if (data.password === password) {
		const sql = 'INSERT INTO producto (nombre,descripcion, precio) VALUES (\'' + data.nombre + '\', ' + '\'' + data.descripcion + '\',' + data.precio + ')';
		console.log(`[API]:: QUERY -> ${sql}`);
		connection.query(sql, (err, results) => {
			if (err) throw err;
			else res.send('Producto Agregado');
		});
	} else {
		res.send('Incorrect Password');
	}
});

app.get('/deleteProduct', (req, res) => {
	let data = {
		id: req.query.id_producto,
		password: req.query.password
	};
	console.log(`[API] :: Product to erase: ${data.id}`);
	if (data.password === password) {
		const sql = 'DELETE FROM producto WHERE id_producto = ' + data.id;
		console.log('[API] :: QUERY -> ' + sql);
		connection.query(sql, (err, results) => {
			if (err) throw err;
			else res.send('Producto Eliminado')
		});
	} else {
		res.send('Incorrect Password');
	}
});

app.get('/editProduct', (req, res) => {
	let data = {
		id: req.query.id,
		nombre: req.query.nombre,
		descripcion: req.query.descripcion,
		precio: req.query.precio,
		password: req.query.password
	}
	console.log(`[API] :: Data fetched: ${data.id}, ${data.nombre}, ${data.descripcion}, ${data.precio}`);
	if (data.password === password) {
		const sql = 'UPDATE producto SET nombre=\'' + data.nombre + '\', descripcion=\'' + data.descripcion + '\', precio=' + data.precio + ' WHERE id_producto=' + data.id;
		console.log(`[API] :: QUERY -> ${sql}`);
		connection.query(sql, (err, results) => {
			if (err) throw err;
			else res.send('Producto Editado');
		});
	}else{
		res.send('Incorrect Password');
	}
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Administracion de empleados
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/addEmpleado', (req, res) => {
	let data = {
		nombre: req.query.nombre,
		apellidop: req.query.apellidop,
		apellidom: req.query.apellidom,
		direccion: req.query.direccion,
		telefono: req.query.telefono,
		correo: req.query.correo,
		salario: req.query.salario,
		cargo: req.query.cargo,
		ingreso: req.query.ingreso,
		horario: req.query.horario,
		password: req.query.password
	}
	console.log(`[API] :: Data fetched: ${data.nombre}, ${data.apellidop}, ${data.apellidom}, ${data.direccion}, ${data.telefono}, ${data.correo}, ${data.salario}, ${data.cargo}, ${data.ingreso}, ${data.horario}`);
	if (data.password === password) {
		const sql = `INSERT INTO empleado(nombre,apellido_paterno,apellido_materno,direccion,telefono,correo,salario,cargo,fecha_ingreso,id_horario) VALUES (\'${nombre}\',\'${apellidop}\',\'${apellidom}\',\'${direccion}\',\'${telefono}\',\'${correo}\',${salario},\'${cargo}\',\'${decha_ingreso}\',${horario}')`
		console.log(`[API] :: QUERY -> ${sql}`);
		connection.query(sql, (err, results) => {
			if (err) throw err;
			else res.send('Empleado Agregado');
		});
	}else{
		res.send('Incorrect Password');
	}
});

app.get('/editEmpleado', (req, res) => {
	let data = {
		id: req.query.id,
		nombre: req.query.nombre,
		apellidop: req.query.apellidop,
		apellidom: req.query.apellidom,
		direccion: req.query.direccion,
		telefono: req.query.telefono,
		correo: req.query.correo,
		salario: req.query.salario,
		cargo: req.query.cargo,
		ingreso: req.query.ingreso,
		horario: req.query.horario,
		password: req.query.password
	}
	console.log(`[API] :: Data fetched: ${data.id}, ${data.nombre}, ${data.apellidop}, ${data.apellidom}, ${data.direccion}, ${data.telefono}, ${data.correo}, ${data.salario}, ${data.cargo}, ${data.ingreso}, ${data.horario}`);
	if (data.password === password) {
		const sql = `UPDATE empleado SET nombre=\'${data.nombre}\', apellido_paterno=\'${data.apellidop}\', apellido_materno=\'${data.apellidom}\', direccion=\'${data.direccion}\', telefono=\'${data.telefono}\' ,correo=\'${data.correo}\', salario=${data.salario}, cargo=\'${data.cargo}\', fecha_ingreso=\'${data.ingreso}\',id_horario=${data.horario} WHERE num_empleado=${data.id}`;
		console.log(`[API] :: QUERY -> ${sql}`);
		connection.query(sql, (err, results) => {
			if (err) throw err;
			else res.send('Empleado Editado Correctamente');
		});
	}else{
		res.send('Incorrect Password');
	}
});

app.get('/deleteEmpleado', (req, res) => {
	let data = {
		id: req.query.id,
		password: req.query.password
	}
	console.log(`[API] :: Data fetched: ${data.id}`);
	if (data.password === password) {
		const sql = `DELETE FROM empleado WHERE num_empleado=${data.id}`;
		console.log(`[API] :: QUERY -> ${sql}`);
		connection.query(sql, (err, results) => {
			if(err) throw err;
			else res.send('Empleado eliminado	correctamente');
		});
	}else{
		res.send('Incorrect Password');
	}
});