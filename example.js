const express = require('express')//importamos el framework de express para activar la api
const mysql = require('mysql')//importamos el complemento node-mysql

//establecemos la conexion con la base de datos
const conexion = mysql.createConnection({
	host : 'localhost',
	database : 'portal',
	user : 'api',
	password : 'S3cur3P@55w0rd_API',
})
//Manejamos y alertamos de posibles errores de conexion al servidor principal
conexion.connect(function(err) {
	if(err){
		console.error('[API] -> Error en la conexion con BD:' + err.stack)
		return
	}
	console.log('[API] -> Conectado con el identificador: ' + conexion.threadID)
})
//Hacemos una consulta de prueba
conexion.query('describe empleado', function(error, results, fields){
	if(error)
		throw error
	results.forEach(result => {
		console.log(result)
	})
})
//Cerramos la conexion con la base de datos
	conexion.end()

const app = express()
const port = 3000

app.get('/', (req, res) => {
	res.send('Hello World!')
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
