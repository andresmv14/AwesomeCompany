const express = require('express')
const app = express()
const path = require('path')
var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

//Database connection
var config = {
    server: 'localhost',  //update me
    authentication: {
        type: 'default',
        options: {
            userName: 'ANDRES', //update me
            password: 'admin'  //update me
        }
    },
    options: {
        // If you are on Microsoft Azure, you need encryption:

        database: 'AwesomeCompany'  //update me
    }
};
var connection = new Connection(config);
connection.on('connect', function (err) {
    // If no error, then good to proceed.
    if (err) {
        console.log("This app will explode");
        console.log(err);
        process.exit()
    } else {
        console.log("Connected");
        executeStatement()
    }


});

connection.connect();

function executeStatement() {
    const request = new Request('select * from Employe', (err, rowCount) => {
        if (err) {
            throw err;
        }
        
        console.log('DONE!');
        connection.close();
    });

    // Emits a 'DoneInProc' event when completed.
    request.on('row', (columns) => {
        columns.forEach((column) => {
            if (column.value === null) {
                console.log('NULL');
            } else {
                console.log(column.value);
            }
        });
    });

    request.on('done', (rowCount) => {
        console.log('Done is called!');
    });

    request.on('doneInProc', (rowCount, more) => {
        console.log(rowCount + ' rows returned');
    });
    connection.execSql(request);

}
//settings
app.set('port', 3000)

//middlewares
app.use(express.static(path.join(__dirname, 'public')))


//routes
app.get('/', (req, res) => {
    res.send('Bienvenidos')
})

app.listen(app.get('port'), () => {
    console.log(`Aplicacion corriendo en el puerto ${app.get('port')}`)
})