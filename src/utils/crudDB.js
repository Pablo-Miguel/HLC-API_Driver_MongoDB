const { MongoClient, ObjectId } = require('mongodb');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'contactos-db';

let db = undefined;

MongoClient.connect(connectionURL, { useNewUrlParser: true }, (error, client) => {
    if (error) {
        return console.log('Unable to connect to database!');
    }

    db = client.db(databaseName);
});

const crearContacto = (dni, nombre, edad, telefono, callback) => {
    if(!db){
        return callback('Unable to connect to database!', undefined);
    }

    if(!dni || !nombre || !edad || !telefono){
        return callback('Null property defined!', undefined);
    }

    db.collection('contacto').insertOne({
        dni: dni,
        nombre: nombre,
        edad: edad,
        telefono: telefono
    }).then(result => {
        return callback(undefined, { _token: result.insertedId });
    }).catch(error => {
        return callback('An error occurred when creating the contact!', undefined);
    })
}

const buscarContacto = (id, callback) => {
    if(!db){
        return callback('Unable to connect to database!', undefined);
    }

    db.collection('contacto').findOne({ 
        _id: new ObjectId(id) 
    }).then(contact => {
        if(contact == null) return callback('No contact found!', undefined);
        return callback(undefined, contact);
    }).catch(error => {
        return callback('An error occurred with the query!', undefined);
    });
};

module.exports = {
    crearContacto,
    buscarContacto
};