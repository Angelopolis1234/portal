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
	if (error) console.log(err);
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
		if (err) console.log(err);
		if (results.length > 0) {
			res.json(results);
		} else {
			res.send('No results');
		}
	});
});

app.get('/productos', (req, res) => {
	const sql = 'SELECT * FROM producto order by categoria';
	connection.query(sql, (err, results) => {
		if (err) console.log(err);
		if (results.length > 0) {
			res.json(results);
		} else {
			res.send('No results');
		}
	});
});

app.get('/horarios', (req, res) => {
	const sql = 'SELECT * FROM horario';
	connection.query(sql, (err, results) => {
		if (err) console.log(err);
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
		if (err) console.log(err);
		if (results.length > 0) {
			res.json(results);
		} else {
			res.send('No results');
		}
	});
});

////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Administracion de productos
////////////////////////////////////////////////////////////////////////////////////////////////////////////////

app.get('/addProduct', (req, res) => {
	let data = {
		nombre: req.query.nombre,
		descripcion: req.query.descripcion,
		precio: req.query.precio,
		categoria: req.query.categoria,
		password: req.query.password
	};
	console.log(`[API] :: Data fetched: ${data.nombre}, ${data.descripcion}, ${data.precio}, ${data.categoria} :: from post`);
	let pass = (data.password === password);
	console.log(pass + data.password + ' ' + password);
	if (data.password === password) {
		const sql = 'INSERT INTO producto (nombre,descripcion,precio,categoria) VALUES (\"' + data.nombre + '\", ' + '\"' + data.descripcion + '\",' + data.precio + '\'' + data.categoria + '\'' +')';
		console.log(`[API]:: QUERY -> ${sql}`);
		connection.query(sql, (err, results) => {
			if (err) console.log(err);
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
			if (err) console.log(err);
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
		categoria: req.query.categoria,
		password: req.query.password
	}
	console.log(`[API] :: Data fetched: ${data.id}, ${data.nombre}, ${data.descripcion}, ${data.precio}, ${data.categoria}`);
	if (data.password === password) {
		const sql = 'UPDATE producto SET nombre=\"' + data.nombre + '\", descripcion=\"' + data.descripcion + '\", precio=' + data.precio + ', categoria=\'' + data.categoria + '\' WHERE id_producto=' + data.id;
		console.log(`[API] :: QUERY -> ${sql}`);
		connection.query(sql, (err, results) => {
			if (err) console.log(err);
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
	let fecha = data.ingreso.split('-');
	fecha[1] = fecha[1].padStart(2, '0');
	fecha[2] = fecha[2].padStart(2, '0');
	console.log(`[API] :: Data fetched: ${data.nombre}, ${data.apellidop}, ${data.apellidom}, ${data.direccion}, ${data.telefono}, ${data.correo}, ${data.salario}, ${data.cargo}, ${data.ingreso}, ${data.horario}`);
	if (data.password === password) {
		const sql = `INSERT INTO empleado(nombre,apellido_paterno,apellido_materno,direccion,telefono,correo,salario,cargo,fecha_ingreso,id_horario) VALUES (\"${data.nombre}\",\"${data.apellidop}\",\"${data.apellidom}\",\"${data.direccion}\",\"${data.telefono}\",\"${data.correo}\",${data.salario},\"${data.cargo}\",\"${fecha[0]}-${fecha[1]}-${fecha[2]}\",${data.horario})`
		console.log(`[API] :: QUERY -> ${sql}`);
		connection.query(sql, (err, results) => {
			if (err) console.log(err);
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
	let fecha = data.ingreso.split('-');
	fecha[1] = fecha[1].padStart(2, '0');
	fecha[2] = fecha[2].padStart(2, '0');
	console.log(`[API] :: Data fetched: ${data.id}, ${data.nombre}, ${data.apellidop}, ${data.apellidom}, ${data.direccion}, ${data.telefono}, ${data.correo}, ${data.salario}, ${data.cargo}, ${data.ingreso}, ${data.horario}`);
	if (data.password === password) {
		const sql = `UPDATE empleado SET nombre=\"${data.nombre}\", apellido_paterno=\"${data.apellidop}\", apellido_materno=\"${data.apellidom}\", direccion=\"${data.direccion}\", telefono=\"${data.telefono}\" ,correo=\"${data.correo}\", salario=${data.salario}, cargo=\"${data.cargo}\", fecha_ingreso=\"${fecha[0]}-${fecha[1]}-${fecha[2]}\",id_horario=${data.horario} WHERE num_empleado=${data.id}`;
		console.log(`[API] :: QUERY -> ${sql}`);
		connection.query(sql, (err, results) => {
			if (err) console.log(err);
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
			if(err) console.log(err);
			else res.send('Empleado eliminado	correctamente');
		});
	}else{
		res.send('Incorrect Password');
	}
});


////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//Handle de post de Ordenes
////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const getIdOrden = (query) => {
	return new Promise((resolve, reject) => {
		connection.query(query, (err,result,fields) => {
			if (err) reject(err);
      resolve(result.map(field => field.num_orden));
		});
	})
}

app.post('/ordenar', (req, res) => {
	try{
		console.log(`[API]:: datos obtenidos: ${JSON.stringify(req.body)}`);
		let data = req.body;
		let query = `INSERT INTO orden(hora,mesa,personas,mesero) VALUES (\"${data[data.length - 1].tiempo}\",${data[data.length - 1].mesa},${data[data.length - 1].personas},${data[data.length - 1].mesero})`;
		let ids = data.map(item => item.id_producto);
		connection.query(query, (err, results) => {
			if (err) console.log(err);
		});
		query = `SELECT num_orden FROM orden WHERE mesa=${data[data.length - 1].mesa} AND mesero=${data[data.length - 1].mesero} AND hora=\'${data[data.length - 1].tiempo}\'`;
		let id_orden;
		getIdOrden(query)
			.then(result => {
				id_orden = result[0];
				for (let i = 0; i < ids.length - 1; i++) {
					query = `INSERT INTO producto_to_orden(id_producto,num_orden) VALUES (${ids[i]},${id_orden})`;
					console.log(`[API] :: QUERY -> ${query}`);
					connection.query(query, (err, result) => {
						if (err) console.log(err);
					});
				}
			})
		res.send('OK');
	}catch(err){
		res.send('Datos inv??lidos!');
	}
});

app.post('/terminarOrden', (req, res) => {
	let data = req.body;
	let query = `INSERT INTO nota(num_orden,forma_pago,propina,total) VALUES (${data.num_orden},${data.forma_pago},${data.propina},${data.total})`;
	console.log(`[API] :: QUERY -> ${query}`);
	connection.query(query, (err, results) => {
		if (err) console.log(err);
		res.send('OK');
	});
	res.send('OK');
});


//Para tener las ordenes sin terminar es: SELECT * FROM orden WHERE terminada=0
//Para los productos dentro de la orden es: /ordenes/:id en donde :id es el numero de orden

app.get('/get-ordenes-abiertas', (req, res) => {
	let query = `SELECT * FROM orden WHERE terminada=0`;
	connection.query(query, (err, results) => {
		if (err) console.log(err);
		if (results.length > 0) {
			res.json(results);
		} else {
			res.send('No results');
		}
	});
})

app.get('/ordenes/:id', (req, res) => {
	const { id } = req.params;
	const sql = `SELECT * FROM producto INNER JOIN producto_to_orden ON producto.id_producto = producto_to_orden.id_producto WHERE producto_to_orden.num_orden = ${id}`;
	connection.query(sql, (err, results) => {
		if (err) console.log(err);
		if (results.length > 0) {
			res.json(results);
		} else {
			res.send('No results');
		}
	});
});

app.get('/ordenes', (req, res) => {
	const sql = `SELECT * FROM producto INNER JOIN producto_to_orden ON producto.id_producto = producto_to_orden.id_producto ORDER BY num_orden`;
	connection.query(sql, (err, results) => {
		if (err) console.log(err);
		if (results.length > 0) {
			res.json(results);
		} else {
			res.send('No results');
		}
	});
});

app.post('/delete-orden', (req, res) => {
	data = req.body;
	deleteProdOrd(data.num_orden)
	.then(result => {
		let query = `DELETE FROM orden WHERE num_orden=${data.num_orden}`;
		connection.query(query, (err) => {
			if(err) console.log(err);
			else res.send('ok');
		});
	})
});

const deleteProdOrd = ( num_orden ) =>{
	return new Promise((resolve, reject) => {
		let query = `DELETE FROM producto_to_orden WHERE num_orden=${num_orden}`;
		connection.query(query, (err) => {if (err) reject(false)});
		resolve(true);
	})
}

app.post('/add-producto-orden', (req, res) => {
	data = req.body;
	let query = `INSERT INTO producto_to_orden(id_producto,num_orden) VALUES(${data.id_producto},${data.num_orden})`;
	connection.query(query, (err) => {
		if(err) console.log(err);
    else res.send('ok');
	});
})