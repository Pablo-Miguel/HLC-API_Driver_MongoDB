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

    try {

        db.collection('contacto').findOne({ 
            _id: new ObjectId(id) 
        }).then(contact => {
            if(contact == null) return callback('No contact found!', undefined);
            return callback(undefined, contact);
        }).catch(error => {
            return callback('An error occurred with the query!', undefined);
        });

    } catch(BSONTypeError){
        return callback('The Id is not correct!', undefined);
    }

};

const actualizaContacto = (id, newData, callback) => {
    
    if(!db){
        return callback('Unable to connect to database!', undefined);
    }

    try {

        db.collection('contacto').updateOne({
            _id: new ObjectId(id)
        }, {
            $set: newData
        }).then(result => {
            if(result.matchedCount === 0) return callback("Contact to update hasn't been found!", undefined);
            else if(result.modifiedCount === 0) return callback("Contact hasn't been updated!", undefined);
            return callback(undefined, { result });
        }).catch(error => {
            return callback('An error occurred trying to update the contact!', undefined);
        })

    } catch(BSONTypeError){
        return callback('The Id is not correct!', undefined);
    }

};

const borraContacto = (id, callback) => {

    if(!db){
        return callback('Unable to connect to database!', undefined);
    }

    try {

        db.collection('contacto').deleteOne({
            _id: new ObjectId(id)
        }).then(result => {
            if(result.deletedCount === 0) return callback("Contact to delete hasn't been found!", undefined);
            return callback(undefined, { result });
        }).catch(error => {
            return callback('An error occurred trying to delete the contact!', undefined);
        })

    } catch(BSONTypeError){
        return callback('The Id is not correct!', undefined);
    }

};

module.exports = {
    crearContacto,
    buscarContacto,
    actualizaContacto,
    borraContacto
};